import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    password: ''
  });

  const { student_id, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/student/login', formData);
      if (response.data.success) {
        alert('Login successful');
        navigate(`/student/dashboard/${response.data.id}`);
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
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Roll No:</label>
          <input type="text" name="student_id" value={student_id} onChange={handleChange} required />
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

export default StudentLogin;
