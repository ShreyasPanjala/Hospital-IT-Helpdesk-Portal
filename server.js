const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Hospital IT Helpdesk API Running' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
