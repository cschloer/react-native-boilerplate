import { SQLite } from 'expo';
import migrations from './sql';

const db = SQLite.openDatabase('db.notecarder', migrations.length);
console.log('@@@@@@@@@@@@@@@@@@  Opened the database!!!');

export default db;
