import React from "react";

function Dashboard() {
  return (
    <div className="container">
      <h1>Hospital IT Helpdesk Dashboard</h1>

      <div className="dashboard-grid">

        <div className="stat-card blue">
          <h2>25</h2>
          <p>Open Tickets</p>
        </div>

        <div className="stat-card orange">
          <h2>14</h2>
          <p>In Progress</p>
        </div>

        <div className="stat-card green">
          <h2>122</h2>
          <p>Resolved</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
