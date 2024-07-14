import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../css/Faculty/FacultyProfile.css';

const FacultyProfile = () => {
  const { id } = useParams(); // Get the faculty ID from the URL
  const [facultyDetails, setFacultyDetails] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/faculty/details/${id}`); // Use the dynamic ID
        setFacultyDetails(response.data);
      } catch (error) {
        console.error('Error fetching faculty details:', error);
        setError('Failed to load faculty details');
      }
    };

    fetchFacultyDetails();
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
    formData.append('facultyId', id); // Use the dynamic ID

    try {
      const response = await axios.post('http://localhost:5000/api/upload/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert('Profile picture uploaded successfully');
        setFacultyDetails({ ...facultyDetails, profile_picture: response.data.filePath });
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

  return (
    <div className="profile">
      <h2>Faculty Profile</h2>
      <div className="profile-picture">
        {facultyDetails.profile_picture ? (
          <img src={`http://localhost:5000${facultyDetails.profile_picture}`} alt="Profile" />
        ) : (
          <p>No profile picture</p>
        )}
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <div className="profile-details">
        <p><strong>ID:</strong> {facultyDetails.id}</p>
        <p><strong>Name:</strong> {facultyDetails.name}</p>
        <p><strong>Email:</strong> {facultyDetails.email}</p>
        <p><strong>Department:</strong> {facultyDetails.department}</p>
        <p><strong>Designation:</strong> {facultyDetails.designation}</p>
        <p><strong>Phone No:</strong> {facultyDetails.phone_no}</p>
        <p><strong>Address:</strong> {facultyDetails.address}</p>
        <p><strong>Date of Birth:</strong> {facultyDetails.dob ? facultyDetails.dob.split('T')[0] : ''}</p> {/* Check if dob exists */}
        <p><strong>Blood Group:</strong> {facultyDetails.blood_group}</p>
      </div>
    </div>
  );
};

export default FacultyProfile;
