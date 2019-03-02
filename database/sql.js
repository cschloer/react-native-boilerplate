export const v1 = `
  CREATE TABLE test (
    field TEXT
  )
`;

export const v2 = `
  ALTER TABLE test ADD COLUMN another_field TEXT
`;

export const v3 = `
  CREATE TABLE anothertest (
    field TEXT
  )
`;
