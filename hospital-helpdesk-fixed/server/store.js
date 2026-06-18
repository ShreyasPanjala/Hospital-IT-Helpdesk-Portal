const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');

function readDb() {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({ users: [], tickets: [] }, null, 2));
    }
    const content = fs.readFileSync(dbPath, 'utf8');
    if (!content.trim()) {
      return { users: [], tickets: [] };
    }
    return JSON.parse(content);
  } catch (err) {
    console.error("Database read error, using fallback state:", err);
    return { users: [], tickets: [] };
  }
}

function writeDb(data) {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Database write error:", err);
  }
}

function nextId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

module.exports = { readDb, writeDb, nextId };
