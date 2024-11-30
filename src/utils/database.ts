import path from "path";
import Database, { Database as TDatabase } from "better-sqlite3";
import { ResponseError } from "./utils";

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

  registerUser(username: string): boolean {
    const user = this._db.prepare(`SELECT id FROM users WHERE username = ?`).get(username);
    if (user === undefined){
      try{
        this._db.prepare(`INSERT INTO users (username) VALUES (?)`).run(username);
        return true;
      } catch (err) {
        throw new ResponseError(`Error registering user ${username}`, err, 500);
      }
    }
    return false;
  };

  unregisterUser(username: string): void{
    try{
      this._db.prepare(`DELETE FROM users WHERE username = ?`).run(username);
    } catch (err) {
      throw new ResponseError(`Error unregistering user ${username})`, err, 500);
    }
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

  private refreshUpdateTime(id: number): boolean{
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