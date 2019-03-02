import db from './db';
import {
  v1, v2, v3,
} from './sql';

const versions = [v1, v2, v3];

/**
 * this class decides what migrations to run and runs them
 */
/* eslint-disable no-underscore-dangle */
class RNSqliteMigrator {
  constructor(db) {
    this._db = db;

    this.initialize();
    this._migrationsMap = {};
    this._versions = [];
    this._cursor = 0;
  }

  _next() {
    if (this._versions[this._cursor]) {
      const next = this._versions[this._cursor];
      this._migrationsMap[next].execute(this._db, () => {
        this._cursor += 1;
        this._next();
      });
    } else {
      // done!
      this._cursor = 0;
      // update version stored in the database to current version
      this._db.transaction(txn => {
        txn.executeSql('UPDATE version SET version = :version', [this._db.version]);
      });
    }
  }

  initialize() {
    this._db.transaction(txn => {
      txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name=:name", ['version'], (tx, result) => {
        if (!result.rows.length) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS version (version INTEGER)');
          tx.executeSql('CREATE INDEX IF NOT EXISTS version_idx ON version (version);');
          tx.executeSql('INSERT INTO version (version) VALUES (:version)', [0]);
          tx.executeSql('CREATE TABLE IF NOT EXISTS executed_migrations (migration INTEGER)');
          tx.executeSql('CREATE INDEX IF NOT EXISTS migration_idx ON executed_migrations (migration);');
          this.currentVersion = 0;
        } else {
          tx.executeSql('SELECT version FROM version LIMIT 1', [], (tx2, result2) => {
            this.currentVersion = result2.rows.item(0).version;
          });
        }
      });
    }, error => console.error(error), this.migrate.bind(this));
  }

  migrate() {
    if (typeof this.currentVersion === 'undefined') return; // haven't initialized yet
    console.log('In migrate, we have initialized');
    console.log('current verson', this.currentVersion);
    console.log('db version', this._db.version);

    if (this._cursor === 0 && this.currentVersion < this._db.version) {
      let found = false;
      this._versions.forEach((version, i) => {
        if (!found && this.currentVersion >= version) {
          this._cursor = i + 1;
        } else {
          found = true;
        }
      });
      /*
      for (let i = 0; i < this._versions.length && !found; i++) {
        if (this.currentVersion >= this._versions[i]) {
          this._cursor = i + 1;
        } else {
          found = true;
        }
      }
      */

      // call migrations
      this._next();
    }
  }

  up(migration) {
    if (this._migrationsMap[migration.version]) throw new Error('Migration with that version number already exists');
    this._migrationsMap[migration.version] = migration;

    this._versions.push(migration.version);
    this._versions.sort((a, b) => a - b);
  }
}
/* eslint-enable no-underscore-dangle */

/**
 * extend this to make new migrations
 */

class RNSqliteMigration {
  constructor(version, sql) {
    this.version = version;
    this.sql = sql;
  }

  execute = (db, next) => {
    function exec(tx, sql) {
      tx.executeSql(sql);
    }

    db.transaction(txn => {
      txn.executeSql('SELECT migration FROM executed_migrations WHERE migration=:migration', [this.version], (tx, result) => {
        if (!result.rows.length) {
          if (Array.isArray(this.sql)) {
            this.sql.forEach(s => exec(tx, s));
          } else {
            exec(tx, this.sql);
          }
          tx.executeSql('INSERT INTO executed_migrations (migration) VALUES (:migration)', [this.version]);
        }
      });
    }, error => {
      console.log('error eecuting migration', error);
      next(error);
    }, next);
  }
}


/**
 * USAGE
 */
const migrations = versions.map((version, index) => new RNSqliteMigration(index + 1, version));

const migrator = new RNSqliteMigrator(db);
migrations.forEach(migration => {
  migrator.up(migration);
});


export default migrator;
/*
// attempt to run migrations anytime the app state changes to active
// if there are new migrations to run (ie, your user has updated the app
// and there are new migrations) then the migrator will run only those
// migrations
AppState.addEventListener('change', () => {
  if (AppState.currentState === 'active') {
    migrator.migrate();
  }
});
*/
