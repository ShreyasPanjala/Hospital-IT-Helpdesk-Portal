const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb, writeDb, nextId } = require('../store');

function makeToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET || 'hospital_helpdesk_secret', { expiresIn: '7d' });
}

exports.register = async (req, res) => {
  const { name, email, password, department = 'General', role = 'staff' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
  const db = readDb();
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) return res.status(409).json({ message: 'Email already registered.' });
  const user = { id: nextId('USR'), name, email, department, role, password: await bcrypt.hash(password, 10), createdAt: new Date().toISOString() };
  db.users.push(user);
  writeDb(db);
  const safeUser = { id: user.id, name, email, department, role };
  res.status(201).json({ token: makeToken(user), user: safeUser });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === String(email || '').toLowerCase());
  if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password.' });
  const safeUser = { id: user.id, name: user.name, email: user.email, department: user.department, role: user.role };
  res.json({ token: makeToken(user), user: safeUser });
};

exports.me = (req, res) => res.json({ user: req.user });

exports.users = (req, res) => {
  const db = readDb();
  res.json(db.users.map(({ password, ...u }) => u));
};
