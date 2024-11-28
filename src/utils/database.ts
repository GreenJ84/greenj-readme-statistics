import path from "path";
import Database, { Database as TDatabase } from "better-sqlite3";

export class PlatformDb {
  private _db: TDatabase;
  private _path: string;

  constructor(_path: string){
    this._path = _path;
    const dbPath = path.resolve(__dirname, this._path);

    this._db = new Database(dbPath, {
      fileMustExist: true
    });

    this._db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  updateRegisteredUsers(
    dataUpdate: (user: string) => void
  ){
    const users: [number, string][] = this._db.prepare("SELECT id, username FROM users").all() as [number, string][];

    users.forEach(([id, username]) => {
      dataUpdate(username);
      this.refreshUpdateTime(id);
    });
  }

  refreshUpdateTime(id: number): boolean{
    try {
      this._db.prepare(`
        UPDATE users
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = ?;
      `).run(id);
    } catch (error) {
      console.error(`Error refreshing data for user with ID ${id}:`, error);
    }
    return true;
  }
}