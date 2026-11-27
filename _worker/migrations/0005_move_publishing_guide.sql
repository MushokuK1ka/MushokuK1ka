UPDATE posts SET body_html = replace(body_html,
  'https://github.com/MushokuK1ka/MushokuK1ka.github.io/blob/agent/five-switchable-themes/README.md',
  'https://github.com/MushokuK1ka/MushokuK1ka/blob/main/docs/publishing.md')
WHERE slug = 'cloudflare-blog-from-dns' AND instr(body_html, 'https://github.com/MushokuK1ka/MushokuK1ka.github.io/blob/agent/five-switchable-themes/README.md') > 0;
