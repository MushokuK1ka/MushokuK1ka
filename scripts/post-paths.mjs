export const leetcodeDirectory = '/posts/leetcode/';

export function problemNumber(slug) {
  return /^leetcode-([1-9]\d*)$/.exec(slug)?.[1];
}

export function postPath(slug) {
  const number = problemNumber(slug);
  return number ? leetcodeDirectory + number + '.html' : '/posts/' + slug + '.html';
}

export function postSlug(path) {
  const problem = /^\/posts\/leetcode\/([1-9]\d*)\.html$/.exec(path);
  return problem ? 'leetcode-' + problem[1] : /^\/posts\/([a-z0-9-]+)\.html$/.exec(path)?.[1];
}
