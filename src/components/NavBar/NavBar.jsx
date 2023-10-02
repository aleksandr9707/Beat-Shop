import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar({ user }) {
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query

  function handleLogout() {
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  function handleSearchInputChange(event) {
    setSearchQuery(event.target.value); // Update the searchQuery state when the input changes
  }

  function handleSearchSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting (you can customize this behavior)

    // You can perform a search action here using the searchQuery state
    console.log('Search Query:', searchQuery);

    // Optionally, you can redirect to a search results page using React Router
    // Example:
    // history.push(`/search?query=${encodeURIComponent(searchQuery)}`);
  }

  return (
    <div className="topnav">
      <Link className="active" to="/">
        Home
      </Link>
      <Link to="/beats">Beats</Link>
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
      {/* Add the search form */}
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
