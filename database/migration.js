import dbRef from './db';
import versions from './sql';

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

  async _next() {
    if (this._versions[this._cursor]) {
      const next = this._versions[this._cursor];
      console.log('Migrating to version', next);
      await this._migrationsMap[next].execute(this._db, async () => {
        this._cursor += 1;
        await this._db.transaction(txn => {
          txn.executeSql('UPDATE version SET version = :version', [next]);
        });
        await this._next();
      });
    } else {
      console.log('Succesfully migrated to version', this._db.version);
      // done!
      this._cursor = 0;
      // update version stored in the database to current version
      await this._db.transaction(txn => {
        txn.executeSql('UPDATE version SET version = :version', [this._db.version]);
      });
    }
  }

  initialize() {
    this._db.transaction(
      txn => {
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name=:name", ['version'], (tx, result) => {
          if (!result.rows.length) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS version (version INTEGER)');
            tx.executeSql('CREATE INDEX IF NOT EXISTS version_idx ON version (version);');
            tx.executeSql('INSERT INTO version (version) VALUES (:version)', [0]);
            this.currentVersion = 0;
          } else {
            tx.executeSql('SELECT version FROM version LIMIT 1', [], (tx2, result2) => {
              this.currentVersion = result2.rows.item(0).version;
            });
          }
        });
      },
      error => console.error(error),
    );
  }

  migrate = async () => {
    // if (typeof this.currentVersion === 'undefined') return; // haven't initialized yet

    if (this._cursor === 0 && this.currentVersion < this._db.version) {
      let found = false;
      this._versions.forEach((version, i) => {
        if (!found && this.currentVersion >= version) {
          this._cursor = i + 1;
        } else {
          found = true;
        }
      });
      // call migrations
      await this._next();
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

  execute = async (db, next) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        async (txn) => {
          let { sql } = this;
          if (!Array.isArray(sql)) {
            sql = [sql];
          }
          const sqlExecutions = this.sql.map((sqlString) => (
            new Promise((resolveEx, rejectEx) => {
              txn.executeSql(
                sqlString,
                [],
                resolveEx,
                (_, err) => {
                  console.log('SQL failed to run', err);
                  rejectEx();
                },
              );
            })
          ));
          sqlExecutions.forEach(async (prom) => {
            await prom;
          });
        },
        error => {
          console.log('Error executing migration', error);
          reject(error);
        },
        async () => {
          await next();
          resolve();
        },
      );
    });
  }
}


/**
 * USAGE
 */
const migrations = versions.map((version, index) => new RNSqliteMigration(index + 1, version));

const migrator = new RNSqliteMigrator(dbRef);
migrations.forEach(migration => {
  migrator.up(migration);
});


export default migrator;
