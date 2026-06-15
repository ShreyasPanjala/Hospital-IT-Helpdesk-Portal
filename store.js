const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');

function readDb() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({ users: [], tickets: [] }, null, 2));
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function nextId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

module.exports = { readDb, writeDb, nextId };
