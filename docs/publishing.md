# tsumugi 博客

主站 [tsumugi.cc.cd](https://tsumugi.cc.cd/) 用 GitHub Pages。动态站 [p.tsumugi.cc.cd](https://p.tsumugi.cc.cd/) 用 Cloudflare Workers 和 D1。

## 写新文章或修改旧稿

安装 Node.js 后，在项目目录运行一次 `npm ci`。

在 `content/posts/` 创建 Markdown 文件，例如 `my-first-post.md`。文件名用小写英文字母、数字和短横线。它会成为文章链接的一部分，更新同一篇文章时沿用原来的文件名。开头填写标题、日期和可选简介，正文接在下面。

```markdown
---
title: "我的第一篇项目笔记"
date: "2026-11-19"
description: "这次我做了什么，以及学到了什么。"
---

开头写这篇文章想记录的事情。

## 我做了什么

![页面示意图](/images/my-first-post/demo.png)
```

插图放在 `images/` 下，按文章分子目录。正文中用 `/images/文章目录/文件名` 引用。该目录的插图作为公开静态资源随网站发布。

## 预览和发布

```sh
npm run blog:preview -- my-first-post
npm run blog:publish -- my-first-post
```

- **预览**会生成文章页面、首页列表、归档和 RSS，给本地 D1 写入这篇文章，并启动本地网站。用终端输出的地址打开 `/posts/my-first-post.html`。
- **发布**在 `main` 分支运行。命令会提交文章和引用的插图、推送到 GitHub Pages、部署 Worker，再把这篇文章写入线上 D1。首次使用的电脑需要能推送该仓库，并用 `npx wrangler login` 登录 Cloudflare。某一步中断时可重新执行同一条发布命令。
- 发布后在两个站点检查文章。GitHub Pages 会在推送后构建新版主站。

`npm run blog:build -- my-first-post` 只生成本地文件，适合检查脚本输出。建站教程的完整稿件在 [content/posts/cloudflare-blog-from-dns.md](../content/posts/cloudflare-blog-from-dns.md)。
