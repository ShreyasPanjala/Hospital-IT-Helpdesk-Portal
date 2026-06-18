const Ticket = require('../models/ticketModel');
const { nextId } = require('../store');

const SLA_HOURS = { Critical: 4, High: 8, Medium: 24, Low: 48 };
const validStatus = ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function getQueryFilter(user) {
  if (['admin', 'technician'].includes(user.role)) return {};
  return { createdBy: user.id };
}

exports.createTicket = async (req, res) => {
  try {
    const { title, category, priority, description, system = 'Hospital IT System' } = req.body;
    if (!title || !category || !priority || !description) return res.status(400).json({ message: 'Title, category, priority and description are required.' });
    
    const now = new Date();
    const ticket = new Ticket({
      id: nextId('TKT'),
      title,
      category,
      priority,
      description,
      system,
      status: 'Open',
      assignedTo: '',
      resolutionNote: '',
      createdBy: req.user.id,
      createdByName: req.user.name,
      createdAt: now,
      updatedAt: now,
      slaDueAt: addHours(now, SLA_HOURS[priority] || 24),
      history: [{ at: now, by: req.user.name, action: 'Ticket Created', note: `${category} issue raised with ${priority} priority.` }]
    });
    
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    console.error("Create ticket error:", err);
    res.status(500).json({ message: 'Server error creating ticket.' });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const filter = getQueryFilter(req.user);
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error("Get tickets error:", err);
    res.status(500).json({ message: 'Server error retrieving tickets.' });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });
    
    if (!['admin', 'technician'].includes(req.user.role) && ticket.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed.' });
    }

    const { status, assignedTo, resolutionNote, note } = req.body;
    if (status && !validStatus.includes(status)) return res.status(400).json({ message: 'Invalid status.' });
    
    const changes = [];
    if (status && status !== ticket.status) { 
      ticket.status = status; 
      changes.push(`Status changed to ${status}`); 
    }
    if (assignedTo !== undefined && assignedTo !== ticket.assignedTo) { 
      ticket.assignedTo = assignedTo; 
      ticket.status = ticket.status === 'Open' ? 'Assigned' : ticket.status; 
      changes.push(`Assigned to ${assignedTo || 'Unassigned'}`); 
    }
    if (resolutionNote !== undefined && resolutionNote !== ticket.resolutionNote) { 
      ticket.resolutionNote = resolutionNote; 
      changes.push('Resolution note updated'); 
    }
    
    if (changes.length > 0 || note) {
      const actionStr = changes.join(', ') || 'Note Added';
      ticket.updatedAt = new Date();
      ticket.history.push({ at: ticket.updatedAt, by: req.user.name, action: actionStr, note: note || '' });
      await ticket.save();
    }
    res.json(ticket);
  } catch (err) {
    console.error("Update ticket error:", err);
    res.status(500).json({ message: 'Server error updating ticket.' });
  }
};

exports.analytics = async (req, res) => {
  try {
    const filter = getQueryFilter(req.user);
    const tickets = await Ticket.find(filter);
    
    const count = key => tickets.reduce((acc, t) => ({ ...acc, [t[key]]: (acc[t[key]] || 0) + 1 }), {});
    const overdue = tickets.filter(t => !['Resolved', 'Closed'].includes(t.status) && new Date(t.slaDueAt) < new Date()).length;
    
    res.json({ 
      total: tickets.length, 
      byStatus: count('status'), 
      byPriority: count('priority'), 
      byCategory: count('category'), 
      overdue 
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: 'Server error generating analytics.' });
  }
};

exports.report = async (req, res) => {
  try {
    const filter = getQueryFilter(req.user);
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    
    const header = ['Ticket ID','Title','Category','Priority','Status','Assigned To','Created By','SLA Due','Updated At'];
    const rows = tickets.map(t => [t.id, t.title, t.category, t.priority, t.status, t.assignedTo, t.createdByName, t.slaDueAt ? t.slaDueAt.toISOString() : '', t.updatedAt ? t.updatedAt.toISOString() : '']);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="hospital_helpdesk_report.csv"');
    res.send(csv);
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ message: 'Server error exporting report.' });
  }
};
