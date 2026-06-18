import { Link } from 'react-router-dom';

export default function TicketTable({ tickets }) {
  return <div className="table-responsive card shadow-sm"><table className="table table-hover mb-0 align-middle">
    <thead className="table-primary"><tr><th>ID</th><th>Issue</th><th>Category</th><th>Priority</th><th>Status</th><th>Technician</th><th>SLA Due</th><th></th></tr></thead>
    <tbody>{tickets.map(t => <tr key={t.id}>
      <td className="small fw-semibold">{t.id}</td><td>{t.title}</td><td>{t.category}</td>
      <td><span className={`badge priority-${t.priority}`}>{t.priority}</span></td>
      <td><span className="badge bg-secondary">{t.status}</span></td>
      <td>{t.assignedTo || 'Not assigned'}</td><td>{new Date(t.slaDueAt).toLocaleString()}</td>
      <td><Link className="btn btn-sm btn-outline-primary" to={`/tickets/${t.id}`}>Open</Link></td>
    </tr>)}{tickets.length === 0 && <tr><td colSpan="8" className="text-center p-4 text-muted">No tickets found.</td></tr>}</tbody>
  </table></div>;
}
