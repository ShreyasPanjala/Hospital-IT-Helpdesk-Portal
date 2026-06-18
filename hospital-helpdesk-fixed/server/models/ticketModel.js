const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  at: { type: Date, default: Date.now },
  by: { type: String, required: true },
  action: { type: String, required: true },
  note: { type: String, default: '' }
}, { _id: false });

const ticketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, required: true, enum: ['Low', 'Medium', 'High', 'Critical'] },
  description: { type: String, required: true },
  system: { type: String, default: 'Hospital IT System' },
  status: { type: String, default: 'Open', enum: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'] },
  assignedTo: { type: String, default: '' },
  resolutionNote: { type: String, default: '' },
  createdBy: { type: String, required: true },
  createdByName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  slaDueAt: { type: Date, required: true },
  history: [historySchema]
});

module.exports = mongoose.model('Ticket', ticketSchema);
