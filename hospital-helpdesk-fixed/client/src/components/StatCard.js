export default function StatCard({ label, value }) {
  return <div className="col-md-3"><div className="card stat-card"><div className="card-body"><div className="text-muted small">{label}</div><h2>{value}</h2></div></div></div>;
}
