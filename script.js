const themes = {
  paper: 'Paper White',
  cyber: 'Cyber Neon',
  sakura: 'Sakura Journal',
  glass: 'Glass UI',
  terminal: 'Retro Terminal',
};
const themeKey = 'mushoku-theme';
const themeSlot = document.querySelector('[data-theme-slot]');
const themeChoices = [...document.querySelectorAll('[data-theme-choice]')];

if (themeSlot) {
  themeSlot.innerHTML = '<div class="theme-switcher">' +
    '<button class="button button-outline theme-switcher__toggle" type="button" aria-label="选择主题" aria-expanded="false" aria-controls="theme-options">' +
    '<span class="theme-switcher__dot" aria-hidden="true"></span><span data-current-theme>Paper White</span></button>' +
    '<div class="theme-switcher__menu" id="theme-options" hidden>' +
    Object.entries(themes).map(([key, name]) =>
      '<button class="theme-option" type="button" data-theme-choice="' + key + '" aria-pressed="false">' + name + '</button>'
    ).join('') +
    '<a class="theme-preview-link" href="/theme-preview.html">主题预览 ↗</a></div></div>';
  themeChoices.push(...themeSlot.querySelectorAll('[data-theme-choice]'));

  const toggle = themeSlot.querySelector('.theme-switcher__toggle');
  const options = themeSlot.querySelector('.theme-switcher__menu');
  const showOptions = (shown) => {
    options.hidden = !shown;
    toggle.setAttribute('aria-expanded', String(shown));
  };

  toggle.addEventListener('click', () => showOptions(options.hidden));
  options.addEventListener('click', (event) => {
    if (event.target.closest('[data-theme-choice]')) {
      showOptions(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!themeSlot.contains(event.target)) showOptions(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !options.hidden) {
      showOptions(false);
      toggle.focus();
    }
  });
}

function applyTheme(preference) {
  const theme = Object.hasOwn(themes, preference) ? preference : 'paper';
  document.documentElement.dataset.theme = theme;
  const current = themeSlot?.querySelector('[data-current-theme]');
  if (current) current.textContent = themes[theme];
  for (const choice of themeChoices) {
    choice.setAttribute('aria-pressed', String(choice.dataset.themeChoice === theme));
  }
}

let savedTheme;
try {
  savedTheme = localStorage.getItem(themeKey);
} catch {
  // Themes still work without persistent browser storage.
}
applyTheme(savedTheme);
for (const choice of themeChoices) {
  choice.addEventListener('click', () => {
    const { themeChoice } = choice.dataset;
    applyTheme(themeChoice);
    try {
      localStorage.setItem(themeKey, themeChoice);
    } catch {
      // The current page already has the selected theme.
    }
  });
}

const staticArchive = document.querySelector('[data-static-archive]');
if (staticArchive) {
  const query = new URLSearchParams(location.search).get('q')?.trim().slice(0, 120) || '';
  if (query) {
    staticArchive.querySelector('#search').value = query;
    staticArchive.querySelector('.search-reset').hidden = false;
    let matches = 0;
    for (const row of staticArchive.querySelectorAll('.post-row')) {
      const title = row.querySelector('.post-row-title').textContent;
      row.hidden = !title.toLowerCase().includes(query.toLowerCase());
      if (!row.hidden) matches += 1;
    }
    const summary = staticArchive.querySelector('[data-search-summary]');
    summary.textContent = matches ? '找到 ' + matches + ' 篇文章' : '没有找到匹配的文章。';
    summary.hidden = false;
  }
}

const toc = document.querySelector('[data-article-toc]');
if (toc) {
  const headings = document.querySelectorAll('.reading-article .article-content h2, .reading-article .article-content h3');
  const tocList = toc.querySelector('ol');
  headings.forEach((heading, index) => {
    if (!heading.id) {
      let id = 'section-' + (index + 1);
      while (document.getElementById(id)) id += '-heading';
      heading.id = id;
    }
    const item = document.createElement('li');
    if (heading.tagName === 'H3') item.className = 'toc-subheading';
    const link = document.createElement('a');
    link.href = '#' + encodeURIComponent(heading.id);
    link.textContent = heading.textContent;
    item.append(link);
    tocList.append(item);
  });
  toc.hidden = !headings.length;
}

const progress = document.querySelector('[data-reading-progress]');
if (progress) {
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progress.style.transform = 'scaleX(' + ratio + ')';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

const copyStatus = document.querySelector('[data-copy-status]');
function enableCopy(button, value) {
  const label = button.textContent;
  let timer;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = '已复制';
      if (copyStatus) copyStatus.textContent = label + '成功';
    } catch {
      button.textContent = '复制失败';
      if (copyStatus) copyStatus.textContent = '复制失败，请手动复制';
    }
    clearTimeout(timer);
    timer = setTimeout(() => { button.textContent = label; }, 1700);
  });
}

const copyLink = document.querySelector('[data-copy-link]');
if (copyLink && navigator.clipboard) {
  copyLink.hidden = false;
  enableCopy(copyLink, new URL(location.pathname, location.origin).href);
}

if (navigator.clipboard) {
  for (const code of document.querySelectorAll('.reading-article .article-content pre > code')) {
    const block = document.createElement('div');
    const button = document.createElement('button');
    block.className = 'code-block';
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = '复制代码';
    const pre = code.parentElement;
    pre.before(block);
    block.append(pre, button);
    enableCopy(button, code.textContent);
  }
}
