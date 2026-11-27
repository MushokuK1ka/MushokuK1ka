const projectOwner = 'MushokuK1ka';
const projectList = document.querySelector('[data-project-list]');
const projectCard = projectList.firstElementChild;

function renderProject(repo) {
  const card = projectCard.cloneNode(true);
  const link = card.querySelector('a');
  link.href = 'https://github.com/' + projectOwner + '/' + encodeURIComponent(repo.name);
  card.querySelector('[data-repo-name]').textContent = repo.name;

  const description = card.querySelector('[data-repo-description]');
  description.textContent = repo.description || (repo.name === projectOwner + '.github.io'
    ? '个人博客源码，包括像素房间、文章和资源导航。' : '');
  description.hidden = !description.textContent;
  const meta = card.querySelector('[data-repo-meta]');
  meta.textContent = [repo.language, repo.fork && 'Fork', repo.archived && '已归档'].filter(Boolean).join(' · ');
  meta.hidden = !meta.textContent;
  return card;
}

async function refreshProjects() {
  const cards = document.createDocumentFragment();
  for (let page = 1; ; page++) {
    const url = new URL('https://api.github.com/users/' + projectOwner + '/repos');
    url.search = new URLSearchParams({ type: 'owner', sort: 'pushed', direction: 'desc', per_page: 100, page });
    const response = await fetch(url, { credentials: 'omit' });
    if (!response.ok) return;
    const repos = await response.json();
    if (!Array.isArray(repos)) return;
    for (const repo of repos) {
      if (!repo.private && repo.owner?.login === projectOwner && repo.name !== projectOwner) {
        cards.append(renderProject(repo));
      }
    }
    if (repos.length < 100) break;
  }
  projectList.replaceChildren(cards);
}

// Keep the links already in the HTML if GitHub is unreachable or rate-limits the request.
refreshProjects().catch(() => {});
