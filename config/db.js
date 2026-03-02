import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { readFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use project root directory safely
const rootDir = process.cwd();

// Create db folder inside project root if not exists
const dbFolder = path.join(rootDir, "db");
if (!existsSync(dbFolder)) {
  mkdirSync(dbFolder, { recursive: true });
}

// Safe DB file location
const DB_PATH = path.join(dbFolder, "app.db");

// Safe schema path
const schemaPath = path.join(rootDir, "db", "schema.sql");

let db;

export const getDb = async () => {
  if (!db) {
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    });

    await db.exec("PRAGMA journal_mode = WAL;");
    await db.exec("PRAGMA foreign_keys = ON;");

    // Only load schema if file exists
    if (existsSync(schemaPath)) {
      const schema = readFileSync(schemaPath, "utf8");
      await db.exec(schema);
    } else {
      console.warn("⚠ schema.sql not found, skipping schema setup");
    }

    console.log("✅ Database connected at:", DB_PATH);
  }

  return db;
};

export default getDb;