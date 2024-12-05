import fs from 'fs';
import path from "path";
import cron from "node-cron";
import Database, { Database as TDatabase } from "better-sqlite3";

import { ResponseError } from "./utils";
import { PRODUCTION } from "../environment";
// import { PRODUCTION } from "../environment";

const BASE_PATH = PRODUCTION ? "/var/data" : `${__dirname}/..`;
export class PlatformDb {
  private _db: TDatabase;

  constructor(private platform: string, private _path: string, private _updateFunction: (username: string) => void){
    this._path = _path;
    const dbPath = path.resolve(BASE_PATH, this._path);
    const dirPath = path.dirname(dbPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    try {
      this._db = new Database(dbPath, {});
    } catch (err){
      console.error(`Error connecting to database at ${dbPath}:`, err);
      throw new Error(`Error connecting to database at ${dbPath}`);
    }

    this._db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    cron.schedule(PRODUCTION ? "0 0 * * *" : "* * * * *", () => {
      console.log(`[${new Date().toISOString()}] Starting midnight ${this.platform} cache data refresh...`);
      this.updateRegisteredUsers();
    }).start();
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
      throw new ResponseError(`Error unregistering user ${username}) to ${this.platform}`, err, 500);
    }
  }

  private async updateRegisteredUsers(){
    let users: { id: number, username: string }[];
    try {
      users = this._db.prepare("SELECT id, username FROM users").all() as { id: number; username: string; }[];
    } catch (err) {
      console.error("Error fetching registered users:", err);
      return;
    }

    if (users.length > 0){
      console.log(`[${new Date().toISOString()}] Refreshing ${this.platform} data for ${users.length} users...`, users);
      users.forEach(({id, username}) => {
        this._updateFunction(username);
        this.refreshUpdateTime(id);
      });
    }
  }

  private refreshUpdateTime(id: number): boolean{
    try {
      this._db.prepare(`
        UPDATE users
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = ?;
      `).run(id);
    } catch (error) {
      console.error(`Error refreshing ${this.platform} data for user with ID ${id}:`, error);
    }
    return true;
  }
}