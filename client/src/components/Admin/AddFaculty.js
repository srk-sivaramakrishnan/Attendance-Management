import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/Admin/AddFaculty.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AddFaculty = () => {
  const [formData, setFormData] = useState({
    name: '',
    facultyId: '',
    dob: '',
    department: '',
    email: '',
    phoneNo: '',
    address: '',
    bloodGroup: '',
    designation: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/faculty', formData);
      if (response.data.success) {
        alert('Faculty added successfully');
        // Clear form data after successful submission
        setFormData({
          name: '',
          facultyId: '',
          dob: '',
          department: '',
          email: '',
          phoneNo: '',
          address: '',
          bloodGroup: '',
          designation: '',
          password: '',
        });
      } else {
        alert('Failed to add faculty');
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert('Failed to add faculty');
    }
  };

  return (
    <div>
      <Link to="/admin/manage-faculty" className="back-link">
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </Link>
      <h2>Add Faculty</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Faculty ID:</label>
            <input type="text" name="facultyId" value={formData.facultyId} onChange={handleChange} required />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label>DOB:</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Department:</label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="MECH">MECH</option>
              <option value="AIDS">AIDS</option>
              <option value="ECE">ECE</option>
              <option value="CSBS">CSBS</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone No:</label>
            <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label>Blood Group:</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          <div className="form-group">
            <label>Designation:</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label>Address:</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required></textarea>
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
        </div>
        <div className="row">
          <div className="add-more-btn">
            <Link to="/admin/manage-faculty/more-faculty" style={{ textDecoration: 'underline' }}>Add More Faculty</Link>
          </div>
          <div className="add-faculty-btn">
            <button type="submit">Add Faculty</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFaculty;
