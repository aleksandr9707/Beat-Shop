import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'

export default function NavBar({ user }) {
  function handleLogout() {
    localStorage.removeItem('user');
    window.location.href = "/";
  }

  return (
    <div className="topnav">
      <Link className="active" to="/">Home</Link>
      <Link to="/beats">Beats</Link> {/* Move the "Beats" link outside of the conditional rendering */}
      {user ? (
        <>
          <span>Welcome, {user.email}!</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/signup">Sign Up</Link>
          <Link to="/login">Login</Link>
        </>
      )}
      <input type="text" placeholder="Search..." />
    </div>
  );
}
