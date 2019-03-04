export const v1 = [
  `
  CREATE TABLE group_meta (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
  )
  `,
  `
  CREATE TABLE group_aspect_meta (
    id INTEGER PRIMARY KEY,
    group_meta_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (group_meta_id) REFERENCES group_meta (id)
  )
  `,
  `
  CREATE TABLE group_aspect_connection (
    id INTEGER PRIMARY KEY,
    aspect_source_id INTEGER NOT NULL,
    aspect_target_id INTEGER NOT NULL,
    FOREIGN KEY(aspect_source_id) REFERENCES group_aspect_meta(id),
    FOREIGN KEY(aspect_target_id) REFERENCES group_aspect_meta(id)
  )
  `,
];
export const v2 = [
  `
  SELECT * FROM group_meta
  `,
  `
  SELECT * FROM group_aspect_meta
  `,
  `
  SELECT * FROM group_aspect_connection
  `,
];

export default [v1, v2, v2, v2];
