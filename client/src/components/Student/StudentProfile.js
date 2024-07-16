import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../css/Student/StudentProfile.css'; // Ensure this path is correct

const StudentProfile = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const [studentDetails, setStudentDetails] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/student/details/${id}`); // Use the dynamic ID
        setStudentDetails(response.data.data); // Adjust according to the response structure
      } catch (error) {
        console.error('Error fetching student details:', error);
        setError('Failed to load student details');
      }
    };

    fetchStudentDetails();
  }, [id]);

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!profilePicture) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', profilePicture);
    formData.append('studentId', id); // Use the dynamic ID

    try {
      const response = await axios.post('http://localhost:5000/api/upload/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert('Profile picture uploaded successfully');
        setStudentDetails({ ...studentDetails, profile_picture: response.data.filePath });
      } else {
        alert('Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!studentDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-profile">
      <h2>Student Profile</h2>
      <div className="profile-details">
        <img src={`http://localhost:5000${studentDetails.profile_picture}`} alt="Profile" className="profile-picture" />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <h3>Name: {studentDetails.name}</h3>
        <p>Roll Number: {studentDetails.roll_no}</p>
        <p>Register Number: {studentDetails.register_no}</p>
        <p><strong>Date of Birth:</strong> {studentDetails.dob ? studentDetails.dob.split('T')[0] : ''}</p>
        <p>Class: {studentDetails.class}</p>
        <p>Department: {studentDetails.department}</p>
        <p>Year: {studentDetails.year}</p>
        <p>Class Advisor: {studentDetails.class_advisor}</p>
        <p>Email: {studentDetails.email}</p>
        <p>Phone Number: {studentDetails.phone_no}</p>
        <p>Address: {studentDetails.address}</p>
        <p>Blood Group: {studentDetails.blood_group}</p>
        <p>Accommodation: {studentDetails.accommodation}</p>
        <p><strong>Attendance Percentage:</strong> {studentDetails.attendance_percentage.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default StudentProfile;
