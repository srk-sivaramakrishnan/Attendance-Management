import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaHome, FaUser, FaCheckSquare, FaUsers, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import '../../css/Faculty/FacultyDashboard.css';

const FacultyDashboard = () => {
  const { id } = useParams();
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/faculty/details/${id}`);
        setFaculty(response.data);
      } catch (error) {
        console.error('Error fetching faculty details:', error);
      }
    };
    fetchFacultyDetails();
  }, [id]);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        {faculty && (
          <>
            <img src={`http://localhost:5000${faculty.profile_picture}`} alt="Profile" className="profile-picture" />
            <h2>{faculty.name}</h2>
          </>
        )}
        <ul>
          <li><Link to={`/faculty/dashboard/${id}`}><FaHome className="icon" /> Home</Link></li>
          <li><Link to={`/faculty/profile/${id}`}><FaUser className="icon" /> Profile</Link></li>
          <li><Link to={`/faculty/attendance-marking/${id}`}><FaCheckSquare className="icon" /> Attendance Marking</Link></li>
          <li><Link to={`/faculty/students/${id}`}><FaUsers className="icon" /> Student Details</Link></li>
          <li><Link to={`/faculty/reports/${id}`}><FaChartBar className="icon" /> Reports</Link></li>
          <li><Link to={`/faculty/logout`}><FaSignOutAlt className="icon" /> Logout</Link></li>
        </ul>
      </div>
      <div className="content">
        {/* Content for each section will be rendere here */}
      </div>
    </div>
  );
};

export default FacultyDashboard;
