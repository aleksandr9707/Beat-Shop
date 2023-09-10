import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('/api/users/signup', formData);
        console.log("Server Response:", response.data); // Debug: Log the success response
    } catch (err) {
        console.error('Signup error', err.response.data);
        if (err.response && err.response.data.message === 'USER ALREADY EXISTS!') {
          window.alert('USER ALREADY EXISTS!');
      } else {
            console.error("Unexpected Error:", err); // Debug: Log other errors to see details
        }
    }
};


  return (
    <form onSubmit={handleSubmit}>
      <input
       name="name"
       value={formData.name}
       onChange={handleChange}
       placeholder="Name"
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
