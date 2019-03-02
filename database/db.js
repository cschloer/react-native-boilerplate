import { SQLite } from 'expo';

const db = SQLite.openDatabase('db.db', 3);

export default db;
