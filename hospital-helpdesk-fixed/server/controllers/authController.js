const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { nextId } = require('../store');

function makeToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET || 'hospital_helpdesk_secret', { expiresIn: '7d' });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, department = 'General', role = 'staff' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered.' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      id: nextId('USR'),
      name,
      email: email.toLowerCase(),
      department,
      role,
      password: hashedPassword
    });
    
    await user.save();
    
    const safeUser = { id: user.id, name: user.name, email: user.email, department: user.department, role: user.role };
    res.status(201).json({ token: makeToken(user), user: safeUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const safeUser = { id: user.id, name: user.name, email: user.email, department: user.department, role: user.role };
    res.json({ token: makeToken(user), user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

exports.me = (req, res) => res.json({ user: req.user });

exports.users = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: 'Server error fetching users.' });
  }
};
