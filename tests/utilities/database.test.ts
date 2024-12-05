
import path from "path";
import Database from "better-sqlite3";
import { PlatformDb } from "../../src/utils/database";

(() => {
  // Path to the SQLite database file
  const dbPath = path.resolve(__dirname, "./test.sqlite");

  // Open the database connection
  const db = new Database(dbPath);

  const result: boolean = !!db
    .prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`
    )
    .get("users");

  if (!result) {
      db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const insert = db.prepare(`
      INSERT INTO users (username)
      VALUES (?);
    `);

    const dummyUsers = [
      ["john_doe1"],
      ["john_doe2"],
      ["john_doe3"],
      ["john_doe4"],
      ["john_doe5"],
    ];

    for (const row of dummyUsers) {
      insert.run(row);
    }
  }

  console.log("Database setup completed. Ready to use.");
})();

describe('Database class should work functionally', () => {
  let db;

  it('Should connect to the database file', () => {
      db = new PlatformDb("../../tests/utilities/test.sqlite");
      console.log(db);
      expect(db).toBeInstanceOf(PlatformDb);
  });

  it("Should properly run an update function on all polled users", () => {
    let count = 0;
    db.updateRegisteredUsers((user) => {
      expect(user).toBeDefined();
      expect(user).toEqual(`john_doe${++count}`);
      console.log(`Data refreshed for user: ${user}`);
    })
  })

  it("Should properly refresh the update times", () => {
    expect(db.refreshUpdateTime()).toEqual(true)
  })
});