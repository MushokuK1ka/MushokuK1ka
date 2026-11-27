import { execFileSync } from 'node:child_process';
import {
  existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import { parse as parseYaml } from 'yaml';

const root = fileURLToPath(new URL('..', import.meta.url));
const work = join(root, '.wrangler');
const branch = 'main';
const domain = 'https://tsumugi.cc.cd';
const parser = new MarkdownIt({ html: true });
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const listPattern = /(<ul class="post-list" data-post-list>)[\s\S]*?(\n[ \t]*<\/ul>)/;
const feedPattern = /(<\/language>)[\s\S]*?(\n  <\/channel>)/;
const bodyPattern = /(<div class="article-content">)[\s\S]*?(\n      <\/div>\n      <nav class="article-actions")/;
const wrangler = join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js');

function read(path) {
  return readFileSync(join(root, path), 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
}

function encode(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function fill(source, pattern, content) {
  if (!pattern.test(source)) throw new Error('页面模板与发文脚本不匹配，请检查：' + pattern.source);
  return source.replace(pattern, (_, before, after) => before + content + after);
}

function readDraft(slug) {
  const source = 'content/posts/' + slug + '.md';
  const match = read(source).match(/^---\n([\s\S]*?)\n---\n([\s\S]+)$/);
  if (!match) throw new Error(source + ' 需要以两行 --- 包住标题和日期，下面写正文。');

  const { title, date, description = title } = parseYaml(match[1]) ?? {};
  if (typeof title !== 'string' || !title.trim() || /[\r\n]/.test(title)) {
    throw new Error('title 需要是一行非空文本。');
  }
  if (typeof description !== 'string' || /[\r\n]/.test(description)) {
    throw new Error('description 需要是一行文本。');
  }
  const timestamp = new Date(date + 'T00:00:00Z');
  if (typeof date !== 'string' || !datePattern.test(date) || Number.isNaN(timestamp.getTime()) ||
      timestamp.toISOString().slice(0, 10) !== date) {
    throw new Error('date 需要是实际存在的日期，格式为 YYYY-MM-DD。');
  }

  const body = parser.render(match[2]).trim();
  if (!body) throw new Error('请写好正文再生成文章。');
  const images = new Set();
  for (const [, , src] of body.matchAll(/<img\b[^>]*?\ssrc\s*=\s*(["'])(.*?)\1/gi)) {
    if (/^https?:\/\//i.test(src)) continue;
    const assetUrl = new URL(src, domain);
    const pathname = decodeURIComponent(assetUrl.pathname);
    if (!src.startsWith('/images/') || !pathname.startsWith('/images/') || pathname.includes('\\') ||
        pathname.split('/').some(segment => segment === '.' || segment === '..')) {
      throw new Error('本地插图请放在 images/，并用 /images/… 引用：' + src);
    }
    const asset = pathname.slice(1);
    if (!existsSync(join(root, asset))) throw new Error('找不到插图：' + asset);
    images.add(asset);
  }
  return { slug, source, title: title.trim(), date, description, body, images };
}

function renderPost({ slug, title, date, description, body }) {
  const mail = 'mailto:?subject=' + encodeURIComponent(title) +
    '&body=' + encodeURIComponent(domain + '/posts/' + slug + '.html');
  let post = read('posts/first-post.html');
  post = fill(post, /(<title>)[\s\S]*?(<\/title>)/, encode(title) + ' | tsumugi.');
  post = fill(post, /(<meta name="description" content=")[^"]*(">)/, encode(description));
  post = fill(post, /(<h1 class="article-title">)[\s\S]*?(<\/h1>)/, encode(title));
  post = fill(post, /(<time class="post-date" datetime=")[\s\S]*?(<\/time>)/, date + '">' + date);
  post = fill(post, /(<a class="button button-outline" data-share-email href=")[^"]*(")/, encode(mail));
  return fill(post, bodyPattern, '\n' + body.split('\n').map(line => line ? '        ' + line : '').join('\n'));
}

function updatedListing(archive, draft) {
  const existing = archive.match(listPattern)?.[0];
  if (!existing) throw new Error('找不到文章归档。');

  const rows = [...existing.matchAll(/<li class="post-row">[\s\S]*?<\/li>/g)];
  if (rows.length !== (existing.match(/<li\b/g) ?? []).length) {
    throw new Error('归档结构有变化，请先核对文章列表。');
  }
  const entries = rows.map(([row]) => {
    const post = row.match(/<a href="\/posts\/([a-z0-9-]+)\.html"><time datetime="([^"]+)">[^<]*<\/time><span class="post-row-title">([^<]*)<\/span>/);
    if (!post || !datePattern.test(post[2])) throw new Error('归档里有一条无法读取的文章记录。');
    return { slug: post[1], date: post[2], title: post[3] };
  });

  const { slug, title, date } = draft;
  const updated = entries.filter(entry => entry.slug !== slug);
  updated.push({ slug, date, title: encode(title) });
  return updated.sort((a, b) => {
    const left = a.date + a.slug;
    const right = b.date + b.slug;
    return left === right ? 0 : left < right ? 1 : -1;
  });
}

function renderList(page, entries) {
  const rows = entries.map(({ slug, date, title }) =>
    '    <li class="post-row"><a href="/posts/' + slug + '.html"><time datetime="' + date + '">' +
    date + '</time><span class="post-row-title">' + title +
    '</span><span class="post-row-arrow" aria-hidden="true">↗</span></a></li>');
  return fill(page, listPattern, '\n' + rows.join('\n'));
}

function renderFeed(feed, entries) {
  const items = entries.slice(0, 30).map(({ slug, title, date }) => {
    const link = domain + '/posts/' + slug + '.html';
    const timestamp = new Date(date + 'T00:00:00Z').toUTCString();
    return '    <item><title>' + title + '</title><link>' + link + '</link><guid>' + link +
      '</guid><pubDate>' + timestamp + '</pubDate></item>';
  });
  return fill(feed, feedPattern, '\n' + items.join('\n'));
}

function writePostSql(draft, file) {
  const quote = text => "'" + text.replaceAll("'", "''") + "'";
  const values = [draft.slug, draft.title, draft.date, draft.body, draft.title, draft.title];
  writeFileSync(file, 'INSERT INTO posts (slug, title, published_on, body_html, heading, browser_title)\n' +
    'VALUES (' + values.map(quote).join(', ') + ')\n' +
    'ON CONFLICT (slug) DO UPDATE SET\n' +
    '  title = excluded.title, published_on = excluded.published_on, body_html = excluded.body_html,\n' +
    '  heading = excluded.heading, browser_title = excluded.browser_title;\n');
}

function readTemplate(path, region, publishing) {
  const working = read(path);
  if (!publishing) return working;
  const committed = run('git', ['show', 'HEAD:' + path], root, true).replace(/\r\n/g, '\n');
  if (fill(working, region, '') !== fill(committed, region, '')) {
    throw new Error(path + ' 有尚未提交的模板改动。请先处理这些改动，再运行发布命令。');
  }
  // A previous local preview may have added entries for other unpublished drafts.
  return committed;
}

function build(draft, publishing) {
  const { slug, source, images } = draft;
  const post = 'posts/' + slug + '.html';
  const homepage = readTemplate('index.html', listPattern, publishing);
  const archive = readTemplate('posts.html', listPattern, publishing);
  const feed = readTemplate('feed.xml', feedPattern, publishing);
  const entries = updatedListing(archive, draft);
  const files = new Map([
    [post, renderPost(draft)],
    ['index.html', renderList(homepage, entries.slice(0, 5))],
    ['posts.html', renderList(archive, entries)],
    ['feed.xml', renderFeed(feed, entries)],
  ]);
  for (const [path, contents] of files) writeFileSync(join(root, path), contents);
  return [source, ...files.keys(), ...images];
}

function run(command, args, cwd = root, capture = false) {
  return execFileSync(command, args, {
    cwd, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  });
}

function publish(draft, files, sqlFile) {
  run('git', ['--literal-pathspecs', '-c', 'core.safecrlf=false', 'add', '--', ...files]);
  const staged = run('git', ['--literal-pathspecs', 'diff', '--cached', '--name-only', '--', ...files], root, true);
  if (staged.trim()) {
    run('git', ['--literal-pathspecs', 'commit', '--only', '-m', 'Publish blog post: ' + draft.slug, '--', ...files]);
  }

  const commit = run('git', ['rev-parse', 'HEAD'], root, true).trim();
  const release = mkdtempSync(join(work, 'blog-release-'));
  try {
    // Deploy the same committed files that GitHub Pages receives.
    const snapshot = join(release, 'site');
    const archive = join(release, 'site.tar');
    mkdirSync(snapshot);
    run('git', ['archive', '--format=tar', '--output=' + archive, commit]);
    run('tar', ['-xf', archive, '-C', snapshot]);
    run('git', ['push', 'origin', commit + ':refs/heads/' + branch]);
    run(process.execPath, [wrangler, 'deploy'], snapshot);
    run(process.execPath, [wrangler, 'd1', 'migrations', 'apply', 'DB', '--remote'], snapshot);
    run(process.execPath, [wrangler, 'd1', 'execute', 'DB', '--remote', '--yes', '--file', sqlFile], snapshot);
    console.log('已发布 ' + domain + '/posts/' + draft.slug + '.html');
  } finally {
    if (resolve(release).startsWith(resolve(work, 'blog-release-'))) rmSync(release, { recursive: true });
  }
}

function main() {
  const [command, slug, ...extra] = process.argv.slice(2);
  if (!['build', 'preview', 'publish'].includes(command) || !slugPattern.test(slug ?? '') || extra.length) {
    throw new Error('用法：npm run blog:build、blog:preview 或 blog:publish，后接 -- 文章-slug');
  }
  if (command === 'publish' && run('git', ['branch', '--show-current'], root, true).trim() !== branch) {
    throw new Error('请在博客的发布分支运行发文命令：' + branch);
  }

  mkdirSync(work, { recursive: true });
  const lock = join(work, 'blog-build.lock');
  try {
    writeFileSync(lock, String(process.pid), { flag: 'wx' });
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error('博客生成或发布正在运行：' + lock);
    throw error;
  }
  try {
    const draft = readDraft(slug);
    const sqlFile = join(work, 'blog-' + slug + '.sql');
    const files = build(draft, command === 'publish');
    writePostSql(draft, sqlFile);
    if (command === 'publish') {
      publish(draft, files, sqlFile);
    } else if (command === 'preview') {
      run(process.execPath, [wrangler, 'd1', 'migrations', 'apply', 'DB', '--local']);
      run(process.execPath, [wrangler, 'd1', 'execute', 'DB', '--local', '--file', sqlFile]);
      console.log('预览地址见启动日志，文章路径为 /posts/' + slug + '.html');
    } else {
      console.log('已生成 posts/' + slug + '.html、文章列表、RSS 和 ' + sqlFile);
    }
  } finally {
    rmSync(lock, { force: true });
  }
  if (command === 'preview') run(process.execPath, [wrangler, 'dev', '--ip', '127.0.0.1']);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

