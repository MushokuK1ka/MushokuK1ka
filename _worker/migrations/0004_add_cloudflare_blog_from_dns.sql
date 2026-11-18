INSERT INTO posts (slug, title, published_on, body_html) VALUES
  ('cloudflare-blog-from-dns', '建站学习日记：从 DNS 到 Cloudflare Workers + D1', '2026-11-19', '
<p>刚开始搭这个博客时，我想先弄明白一件事：拿到一个域名以后，网页该放在哪里，别人又是怎么找到它的？我先用 GitHub Pages 让一张网页上线，后来才加上 Cloudflare 和数据库。下面按我的建站顺序，把每一件事拆开说。</p>

<h2>输入网址，浏览器先去哪里找？</h2>
<p>以 <code>https://p.tsumugi.cc.cd/posts.html</code> 为例。<code>p.tsumugi.cc.cd</code> 是网站的名字，<code>/posts.html</code> 是我想看的那一页。就像去图书馆要先找地址，再去找书，浏览器也得先找到网站，再向它要页面。</p>
<p><strong>DNS 就是浏览器用来查地址的一套系统。</strong> 平时输入的是好记的名字，电脑连接网站时要用网络地址。查到地址以后，浏览器再用 HTTPS 建立连接，把想看的页面告诉网站。<a href="https://www.cloudflare.com/learning/dns/what-is-dns/">DNS 查询的官方图解</a></p>
<figure style="margin: 1.5em 0;">
  <img src="/images/cloudflare-blog/dns-lookup.png" width="960" height="555" loading="lazy" decoding="async" alt="网址分成网站的名字 p.tsumugi.cc.cd 和想看的页面 /posts.html。浏览器先通过 DNS 查地址，再向网站索取页面。">
  <figcaption>图 1　DNS 帮浏览器找到网站，网站负责把页面发回来。<a href="/images/cloudflare-blog/dns-lookup.png" aria-label="查看 DNS 解析插画大图">查看大图</a></figcaption>
</figure>
<p>打开域名管理页面，会看到几种叫做「DNS 记录」的设置。我是这样记的：</p>
<ul>
  <li><strong>A / AAAA</strong> 像写下门牌号码，分别填 IPv4 和 IPv6 两种网络地址。</li>
  <li><strong>CNAME</strong> 像起个别名。查到这个别名时，会继续找它指向的那个名字的地址。</li>
  <li><strong>TXT</strong> 是一张文字便条。比如 GitHub 可以让你贴上它给的文字，来确认你有权管理这个域名。</li>
  <li><strong>NS</strong> 负责指路，告诉大家该去问哪几台服务器，才能拿到这个域名的正式答案。</li>
</ul>
<p><a href="https://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/">Cloudflare 的 DNS 记录说明</a></p>

<h2>先让一张网页上线</h2>
<p>拿到域名只是有了网站的名字，接下来还要给网页找个能放在网上的地方。我先在 GitHub 建了一个仓库，也就是存放项目文件的地方，再交给 <strong>GitHub Pages</strong> 把文件发布成网站。</p>
<ol>
  <li>在自己的 GitHub 账号下建一个公开仓库，添加 <code>index.html</code>。打开网站首页时，GitHub Pages 会把它当作入口。第一次试可以只写一行 <code>&lt;h1&gt;你好，这是我的博客&lt;/h1&gt;</code>。</li>
  <li>在仓库的 <strong>Settings → Pages</strong> 里选择 <strong>Deploy from a branch</strong>，选存放这个文件的分支。如果文件在仓库最外层，目录就选 <strong>/(root)</strong>，然后保存。</li>
  <li>发布完成后，点 Pages 页面里的 <strong>Visit site</strong>。用 GitHub 给的地址就能先看到网页，自己的域名可以稍后再接。</li>
</ol>
<p>这个阶段的博客是<strong>静态站</strong>。写好的网页文件已经放在 GitHub Pages 上，有人来访问时，Pages 就把文件交给对方。<a href="https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site">GitHub Pages 建站步骤</a></p>

<h2>把 DNS 交给 Cloudflare 管</h2>
<p>我是从 DNSHE 拿到 <code>tsumugi.cc.cd</code> 这个免费子域名的。后来我让 Cloudflare 帮忙回答这个域名的 DNS 查询。这一步叫<strong>修改 NS 委派</strong>，意思是把「这个域名去哪里查」换成 Cloudflare 给出的服务器。网页还是可以放在 GitHub Pages。</p>
<ol>
  <li><strong>在 Cloudflare 添加自己的域名。</strong> 如果已经有网站或域名邮箱，先在 Cloudflare 把仍在用的 DNS 记录准备好。</li>
  <li><strong>把 Cloudflare 分配的名称服务器填回域名平台。</strong> 我的入口在 DNSHE。你用的是自己购买的域名，就到注册商那里找「名称服务器」。如果拿的是免费子域名，要看平台是否支持把它委派出去，以及 Cloudflare 是否支持添加该域名。</li>
  <li><strong>等 Cloudflare 显示 Active（已激活）。</strong> 之后，这个域名的 DNS 记录就在 Cloudflare 里改。DNS 的旧回答可能在不同网络上缓存一段时间，所以新设置未必同时生效。</li>
</ol>
<p>如果想给静态站也用自己的域名，可以先用 GitHub 提供的 TXT 记录验证所有权，然后在 Pages 设置里填自定义域名，最后按 GitHub 的说明添加对应的访问记录。我把主站的记录保留给 GitHub Pages，另外用一个带 <code>p.</code> 的名字测试动态版。<a href="https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/">Cloudflare 接管 DNS</a> · <a href="https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site">GitHub Pages 自定义域名</a></p>

<h2>让博客从数据库里取文章</h2>
<p>静态站已经能读文章了。后来我想让博客按关键词查正文，就加了两样东西。<strong>Worker</strong> 是 Cloudflare 帮我运行的一小段后端程序，负责接收访问和组织回复。<strong>D1</strong> 是放文章的数据库。可以把我的文章表想成一张表格，每一行存一篇文章的标题、日期和正文。接上以后，读者打开一篇文章，Worker 就去 D1 找到正文，再拼成网页发回去。</p>
<ol>
  <li><strong>先让 Worker 跑起来。</strong> 在 Cloudflare 的 <strong>Workers &amp; Pages</strong> 选 <strong>Create application</strong>，从一个简单模板开始。点 <strong>Deploy</strong>，也就是把程序放到 Cloudflare 上运行。用它给的 <code>workers.dev</code> 地址，先确认浏览器能打开。</li>
  <li><strong>准备一个 D1 数据库。</strong> 在 Cloudflare 的 <strong>D1 SQL database</strong> 创建数据库。第一次可以只放一个标题，方便确认程序真的能读到它。</li>
  <li><strong>把 Worker 和 D1 连起来。</strong> 打开 Worker 的 <strong>Bindings → Add binding</strong>，选 <strong>D1 database</strong> 和刚建好的数据库，把变量名设为 <code>DB</code>。这一步也叫「绑定」：Worker 之后用 <code>env.DB</code> 就能访问这个数据库。</li>
</ol>
<p><a href="https://developers.cloudflare.com/workers/get-started/dashboard/">在控制台创建 Worker</a> · <a href="https://developers.cloudflare.com/d1/get-started/">D1 入门步骤</a></p>
<details>
  <summary>动手试一下，让 Worker 读出一篇文章的标题</summary>
  <p>打开刚建好的练习数据库，在 <strong>Console</strong> 执行下面两行。SQL 是和数据库说话的语言，第一行建表，第二行放入一个标题。</p>
  <pre><code>CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT);
INSERT INTO posts (id, title) VALUES (1, ''我的第一篇博客'');</code></pre>
  <p>在练习用 Worker 的代码编辑器里使用下面这段代码，再点 <strong>Deploy</strong>。<code>SELECT</code> 的意思是「取出数据」。打开测试地址，应该会看到「我的第一篇博客」。</p>
  <pre><code>export default {
  async fetch(request, env) {
    const post = await env.DB
      .prepare("SELECT title FROM posts WHERE id = 1")
      .first();
    return new Response(post?.title ?? "还没有文章", {
      headers: { "Content-Type": "text/plain; charset=UTF-8" },
    });
  },
};</code></pre>
</details>

<h2>给动态版加一个自己的地址</h2>
<p>在 <code>workers.dev</code> 上确认 Worker 能打开后，我给它绑了 <code>p.tsumugi.cc.cd</code>。操作入口在 Worker 的 <strong>Settings → Domains &amp; Routes → Add → Custom Domain</strong>。域名在 Cloudflare 激活后，就能在这里填一个可用的子域名。Cloudflare 会创建对应记录，并办好 HTTPS 证书。<a href="https://developers.cloudflare.com/workers/configuration/routing/custom-domains/">给 Worker 绑定自定义域名</a></p>
<figure style="margin: 1.5em 0;">
  <img src="/images/cloudflare-blog/request-paths.png" width="960" height="592" loading="lazy" decoding="async" alt="tsumugi.cc.cd 由 GitHub Pages 交付写好的网页；p.tsumugi.cc.cd 由 Worker 查询 D1，再拼成网页。Cloudflare 管理这两个名字的 DNS 记录。">
  <figcaption>图 2　现在主站继续走 GitHub Pages，带 <code>p.</code> 的地址打开 Worker 版。<a href="/images/cloudflare-blog/request-paths.png" aria-label="查看两个网站入口的插画大图">查看大图</a></figcaption>
</figure>
<p>我以前还问过，既然正文存在 D1，为什么「查看网页源码」还是能看到全部文字？后来发现，我看到的是 Worker 已经拼好的网页。查数据库这一步早在网页送到浏览器之前就完成了。这个做法叫<strong>服务端渲染</strong>。</p>

<h2>以后写新文章，要更新哪里？</h2>
<p>我的博客现在有两份。主站读 GitHub 仓库里的网页文件，把改动提交并推送到 GitHub，Pages 就会发布新版。动态版用 <strong>Wrangler</strong> 把后端代码上传到 Cloudflare，再用 SQL 把新文章写入 D1。Wrangler 可以理解成 Cloudflare 提供的上传工具。如果只改动态版的正文，更新 D1 就够了。</p>
<figure style="margin: 1.5em 0;">
  <img src="/images/cloudflare-blog/publish-paths.png" width="960" height="558" loading="lazy" decoding="async" alt="修改静态网页时推到 GitHub 交给 Pages 发布，修改后端时用 Wrangler 上传到 Worker，写动态文章时把新内容写进 D1。">
  <figcaption>图 3　修改的是网页、后端代码还是文章内容，决定了要把它发到哪里。<a href="/images/cloudflare-blog/publish-paths.png" aria-label="查看博客内容发布插画大图">查看大图</a></figcaption>
</figure>
<p>如果我从零再做一次，还是会先放一个 <code>index.html</code>，用平台给的测试地址把它打开，再配自己的域名。等我真的想让网页搜文章、读数据时，再接上 Worker 和 D1。这样每做完一步，都能打开一个页面看看自己刚完成了什么。</p>
');
