import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/Faculty/FacultyLogin.css'

const FacultyLogin = () => {
  const [formData, setFormData] = useState({
    faculty_id: '',
    password: ''
  });

  const { faculty_id, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/faculty/login', formData);
      if (response.data.success) {
        alert('Login successful');
        navigate(`/faculty/dashboard/${response.data.id}`);
      } else {
        alert('Login failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to login');
    }
  };

  return (
    <div className="login-container">
      <h2>Faculty Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Faculty ID:</label>
          <input type="text" name="faculty_id" value={faculty_id} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default FacultyLogin;
