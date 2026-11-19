const controls = document.querySelector('[data-resource-controls]');
const queryInput = document.querySelector('#resource-query');
const clear = document.querySelector('[data-resource-clear]');
const count = document.querySelector('[data-resource-count]');
const empty = document.querySelector('[data-resource-empty]');
const categoryButtons = [...controls.querySelectorAll('[data-resource-filter]')];
let category = 'all';

function normalize(value) {
  return value.normalize('NFKC').toLowerCase();
}

const sections = [...document.querySelectorAll('[data-resource-category]')].map(section => {
  const name = section.querySelector('h2').textContent;
  const entries = [...section.querySelectorAll('[data-resource]')].map(entry => ({
    entry,
    keywords: normalize(name + ' ' + entry.textContent + ' ' + entry.dataset.keywords),
  }));
  return { section, entries };
});

function filterResources() {
  const terms = normalize(queryInput.value).trim().split(/\s+/).filter(Boolean);
  let total = 0;
  for (const { section, entries } of sections) {
    const selected = category === 'all' || section.dataset.resourceCategory === category;
    let matches = 0;
    for (const { entry, keywords } of entries) {
      const visible = selected && terms.every(term => keywords.includes(term));
      entry.hidden = !visible;
      if (visible) matches += 1;
    }
    section.hidden = matches === 0;
    total += matches;
  }
  count.textContent = `显示 ${total} 项资源`;
  clear.hidden = queryInput.value.length === 0;
  empty.hidden = total > 0;
}

controls.querySelector('form').addEventListener('submit', event => event.preventDefault());
queryInput.addEventListener('input', filterResources);
clear.addEventListener('click', () => {
  queryInput.value = '';
  filterResources();
  queryInput.focus();
});
for (const button of categoryButtons) {
  button.addEventListener('click', () => {
    category = button.dataset.resourceFilter;
    for (const item of categoryButtons) {
      item.setAttribute('aria-pressed', String(item === button));
    }
    filterResources();
  });
}

controls.hidden = false;
filterResources();
