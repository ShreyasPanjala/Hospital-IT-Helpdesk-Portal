import React from "react";

function Login() {
  return (
    <div className="login-container">
      <h1>Hospital Helpdesk</h1>

      <input
        type="email"
        placeholder="Email"
      />

      <input
        type="password"
        placeholder="Password"
      />

      <button className="btn btn-primary">
        Login
      </button>
    </div>
  );
}

export default Login;
