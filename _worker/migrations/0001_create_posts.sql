CREATE TABLE posts (
  slug TEXT PRIMARY KEY NOT NULL CHECK (slug <> '' AND slug NOT GLOB '*[^a-z0-9-]*'),
  title TEXT NOT NULL,
  published_on TEXT NOT NULL CHECK (published_on IS date(published_on, '+0 days')),
  body_html TEXT NOT NULL
);

CREATE INDEX posts_by_date ON posts (published_on DESC, slug ASC);
