import postTemplate from '../posts/first-post.html';

const postPath = /^\/posts\/([a-z0-9-]+)\.html$/;

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const isHome = pathname === '/' || pathname === '/index.html';
    const isArchive = pathname === '/posts.html';
    const post = pathname.match(postPath);

    if (!isHome && !isArchive && !post) return env.ASSETS.fetch(request);

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD' },
      });
    }

    const response = post
      ? await renderPost(env.DB, post[1])
      : await renderList(env, request.url, isHome);

    if (request.method === 'HEAD') {
      await response.body?.cancel();
      return new Response(null, { status: response.status, headers: response.headers });
    }
    return response;
  },
};

async function renderList(env, url, isHome) {
  const templatePath = isHome ? '/index.html' : '/posts.html';
  const selector = isHome ? '.posts ul' : '.post-list';
  const listQuery = `SELECT slug, title, published_on FROM posts
    ORDER BY published_on DESC, slug DESC`;

  const [template, { results }] = await Promise.all([
    env.ASSETS.fetch(new Request(new URL(templatePath, url))),
    env.DB.prepare(isHome ? `${listQuery} LIMIT 5` : listQuery).all(),
  ]);
  if (!template.ok) return template;

  const items = results.map(({ slug, title, published_on }) => {
    const link = `<a href="/posts/${encodeURIComponent(slug)}.html">${escapeHtml(title)}</a>`;
    const date = `<time class="date" datetime="${escapeHtml(published_on)}">${escapeHtml(published_on)}</time>`;
    return `<li>${link}${isHome ? ' - ' : ' '}${date}</li>`;
  }).join('');

  return new HTMLRewriter()
    .on(selector, {
      element(element) {
        element.setInnerContent(items || '<li>暂时没有文章。</li>', { html: true });
      },
    })
    .transform(htmlResponse(template.body));
}

async function renderPost(db, slug) {
  const post = await db.prepare(`SELECT title, heading, browser_title, published_on, body_html
    FROM posts WHERE slug = ?`).bind(slug).first();
  if (!post) return new Response('找不到这篇文章。', { status: 404 });

  const [year, month, day] = post.published_on.split('-');
  const published = `发布日期：${year}年${Number(month)}月${Number(day)}日`;

  return new HTMLRewriter()
    .on('title', { element: (element) => element.setInnerContent(`${post.browser_title ?? post.title} | 我的博客`) })
    .on('header h1', { element: (element) => element.setInnerContent(post.heading ?? post.title) })
    .on('main', {
      element(element) {
        // The body HTML is authored by the blog owner through D1.
        element.setInnerContent(`<p class="post-date">${escapeHtml(published)}</p>${post.body_html}`, {
          html: true,
        });
      },
    })
    .transform(htmlResponse(postTemplate));
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
