import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || join(__dirname, "../../db/app.db");
const schemaPath = join(__dirname, "../../db/schema.sql");

let db;

export const getDb = async () => {
  if (!db) {
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    });
    await db.exec("PRAGMA journal_mode = WAL;");
    await db.exec("PRAGMA foreign_keys = ON;");
    const schema = readFileSync(schemaPath, "utf8");
    await db.exec(schema);
  }
  return db;
};

export default getDb;
