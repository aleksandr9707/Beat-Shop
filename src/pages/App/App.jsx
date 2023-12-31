import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from '../Home/Home';
import SignupForm from '../../components/SignupForm/SignupForm'; 
import NavBar from '../../components/NavBar/NavBar'; 
import LoginForm from '../../components/LoginForm/LoginForm'; 
import Beats from '../Beats/Beats';
import { getUser } from '../../utilities/users-service'; 

function App() {
  const [user, setUser] = useState(getUser());

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <div className="App">
      <NavBar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/beats" element={<Beats user={user} />} /> {/* Pass user prop */}
        <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupForm />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginForm onLogin={handleLogin} />} />
      </Routes>

    </div>
  );
}

export default App;
