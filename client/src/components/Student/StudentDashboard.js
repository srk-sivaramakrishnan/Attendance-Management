import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaHome, FaUser, FaCheckSquare, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import '../../css/Student/StudentDashboard.css'; // Ensure you have the correct path to your CSS file

const StudentDashboard = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/student/details/${id}`);
        setStudent(response.data.data); // Access the 'data' property
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };
    fetchStudentDetails();
  }, [id]);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        {student && (
          <>
            <img src={`http://localhost:5000${student.profile_picture}`} alt="Profile" className="profile-picture" />
            <h2>{student.name}</h2>
          </>
        )}
        <ul>
          <li><Link to={`/student/dashboard/${id}`}><FaHome className="icon" /> Home</Link></li>
          <li><Link to={`/student/profile/${id}`}><FaUser className="icon" /> Profile</Link></li>
          <li><Link to={`/student/attendance/${id}`}><FaCheckSquare className="icon" /> Attendance</Link></li>
          <li><Link to={`/student/reports/${id}`}><FaChartBar className="icon" /> Reports</Link></li>
          <li><Link to={`/student/logout`}><FaSignOutAlt className="icon" /> Logout</Link></li>
        </ul>
      </div>
      <div className="content">
        {/* Content for each section will be rendered here */}
      </div>
    </div>
  );
};

export default StudentDashboard;
