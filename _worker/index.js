import postTemplate from '../posts/first-post.html';
import { profileRoom } from './profile-room.js';

const postPath = /^\/posts\/([a-z0-9-]+)\.html$/;
const postColumns = 'SELECT slug, title, published_on FROM posts';
const postOrder = ' ORDER BY published_on DESC, slug DESC';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isHome = url.pathname === '/' || url.pathname === '/index.html';
    const isArchive = url.pathname === '/posts.html';
    const isFeed = url.pathname === '/feed.xml';
    const isProfileRoom = url.pathname === '/profile/room.svg';
    const post = url.pathname.match(postPath);

    if (!isHome && !isArchive && !isFeed && !isProfileRoom && !post) return env.ASSETS.fetch(request);
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD' },
      });
    }

    if (isProfileRoom) return profileRoom(request, env.ASSETS);
    let response;
    if (isFeed) response = await renderFeed(env.DB, url.origin);
    else if (post) response = await renderPost(env.DB, post[1], url);
    else response = await renderList(env, url, isHome);

    if (request.method === 'HEAD') {
      await response.body?.cancel();
      return new Response(null, { status: response.status, headers: response.headers });
    }
    return response;
  },
};

async function renderList(env, url, isHome) {
  const templatePath = isHome ? '/index.html' : '/posts.html';
  const query = isHome ? '' : (url.searchParams.get('q') ?? '').trim().slice(0, 120);
  let statement;
  if (query) {
    statement = env.DB.prepare(postColumns +
      ' WHERE instr(lower(title), lower(?)) > 0 OR instr(lower(body_html), lower(?)) > 0' + postOrder
    ).bind(query, query);
  } else {
    statement = env.DB.prepare(postColumns + postOrder + (isHome ? ' LIMIT 5' : ''));
  }

  const [template, { results }] = await Promise.all([
    env.ASSETS.fetch(new Request(new URL(templatePath, url))),
    statement.all(),
  ]);
  if (!template.ok) return template;

  const items = results.map(({ slug, title, published_on }) =>
    '<li class="post-row"><a href="/posts/' + encodeURIComponent(slug) + '.html">' +
    '<time datetime="' + escapeHtml(published_on) + '">' + escapeHtml(published_on) + '</time>' +
    '<span class="post-row-title">' + escapeHtml(title) + '</span>' +
    '<span class="post-row-arrow" aria-hidden="true">↗</span></a></li>'
  ).join('');
  const empty = '<li class="empty-state">' + (query ? '没有找到匹配的文章。' : '暂时没有文章。') + '</li>';

  const page = new HTMLRewriter()
    .on('[data-post-list]', {
      element(element) {
        element.setInnerContent(items || empty, { html: true });
      },
    })
    .on('[data-static-archive]', {
      element: (element) => element.removeAttribute('data-static-archive'),
    });
  if (query) {
    page.on('#search', { element: (element) => element.setAttribute('value', query) })
      .on('.search-reset', { element: (element) => element.removeAttribute('hidden') })
      .on('[data-search-summary]', {
        element(element) {
          element.removeAttribute('hidden');
          element.setInnerContent('找到 ' + results.length + ' 篇文章');
        },
      });
  }
  return page.transform(htmlResponse(template.body));
}

async function renderPost(db, slug, url) {
  const post = await db.prepare(
    'SELECT title, heading, browser_title, published_on, body_html FROM posts WHERE slug = ?'
  ).bind(slug).first();
  if (!post) return new Response('找不到这篇文章。', { status: 404 });

  const heading = post.heading ?? post.title;
  const title = post.browser_title ?? post.title;
  const articleUrl = new URL(url.pathname, url.origin).href;
  const email = 'mailto:?subject=' + encodeURIComponent(heading) + '&body=' + encodeURIComponent(articleUrl);

  return new HTMLRewriter()
    .on('title', { element: (element) => element.setInnerContent(title + ' | tsumugi.') })
    .on('.article-title', { element: (element) => element.setInnerContent(heading) })
    .on('.post-date', {
      element(element) {
        element.setAttribute('datetime', post.published_on);
        element.setInnerContent(post.published_on);
      },
    })
    .on('.article-content', {
      element(element) {
        // The author controls the HTML saved in D1.
        element.setInnerContent(post.body_html, { html: true });
      },
    })
    .on('[data-share-email]', { element: (element) => element.setAttribute('href', email) })
    .transform(htmlResponse(postTemplate));
}

async function renderFeed(db, origin) {
  const { results } = await db.prepare(postColumns + postOrder + ' LIMIT 30').all();
  const items = results.map(({ slug, title, published_on }) => {
    const link = escapeHtml(origin + '/posts/' + encodeURIComponent(slug) + '.html');
    return '    <item><title>' + escapeHtml(title) + '</title><link>' + link + '</link><guid>' + link +
      '</guid><pubDate>' + new Date(published_on).toUTCString() + '</pubDate></item>';
  }).join('\n');
  const body = '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n' +
    '    <title>tsumugi. 博客</title>\n    <link>' + escapeHtml(origin) + '/</link>\n' +
    '    <description>技术学习、设备排查与日常记录。</description>\n    <language>zh-CN</language>\n' +
    items + '\n  </channel>\n</rss>\n';
  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

function htmlResponse(body) {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-store',
    },
  });
}

function escapeHtml(value) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}
