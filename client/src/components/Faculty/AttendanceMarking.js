import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AttendanceMarking = () => {
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [className, setClassName] = useState('');
  const [period, setPeriod] = useState('');
  const [date, setDate] = useState('');
  const [subject, setSubject] = useState('');
  const [classTaken, setClassTaken] = useState('');

  const navigate = useNavigate();

  const handleSave = () => {
    axios.post('http://localhost:5000/api/attendance1', {
      period,
      date,
      subject,
      class_taken: classTaken
    })
    .then(response => {
      alert('Attendance saved successfully!');
      navigate(`/faculty/students-marking?department=${department}&year=${year}&className=${className}`);
    })
    .catch(error => {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    });
  };

  return (
    <div>
      <h1>Attendance Marking</h1>
      <form>
        <div>
          <label>Department:</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Select</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="MECH">MECH</option>
            <option value="AIDS">AIDS</option>
            <option value="ECE">ECE</option>
            <option value="CSBS">CSBS</option>
          </select>
        </div>

        <div>
          <label>Year:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="Final Year">Final Year</option>
          </select>
        </div>

        <div>
          <label>Class:</label>
          <select value={className} onChange={(e) => setClassName(e.target.value)}>
            <option value="">Select</option>
            <option value="CSE-A">CSE-A</option>
            <option value="CSE-B">CSE-B</option>
            <option value="IT">IT</option>
            <option value="MECH">MECH</option>
            <option value="CSBS">CSBS</option>
            <option value="AIDS-A">AIDS-A</option>
            <option value="AIDS-B">AIDS-B</option>
            <option value="ECE-A">ECE-A</option>
            <option value="ECE-B">ECE-B</option>
          </select>
        </div>

        <div>
          <label>Period:</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>

        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <label>Subject:</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <div>
          <label>Class Taken:</label>
          <input type="text" value={classTaken} onChange={(e) => setClassTaken(e.target.value)} />
        </div>

        <button type="button" onClick={handleSave}>Save</button>
      </form>
    </div>
  );
};

export default AttendanceMarking;
