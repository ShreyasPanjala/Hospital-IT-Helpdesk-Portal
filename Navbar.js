import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <h2>🏥 Hospital IT Portal</h2>

      <div>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/create-ticket">New Ticket</Link>
        <Link to="/">Logout</Link>
      </div>
    </div>
  );
}

export default Navbar;
