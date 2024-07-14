import React from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const StudentsAbsentees = () => {
    const location = useLocation();
    const { selectedStudents } = location.state;

    const absentees = selectedStudents.filter(student => student.status === 'absent');
    const onDutyStudents = selectedStudents.filter(student => student.status === 'onDuty');
    const presentStudents = selectedStudents.filter(student => student.status === 'present');

    const handleSubmitAttendance = async () => {
        try {
            const attendanceData = {
                presentStudents: presentStudents.map(student => ({
                    roll_no: student.roll_no,
                    name: student.name,
                    status: 'present'
                })),
                absentees: absentees.map(student => ({
                    roll_no: student.roll_no,
                    name: student.name,
                    status: 'absent'
                })),
                onDutyStudents: onDutyStudents.map(student => ({
                    roll_no: student.roll_no,
                    name: student.name,
                    status: 'onDuty'
                }))
            };

            await axios.post('http://localhost:5000/api/attendance2', attendanceData);
            alert('Attendance stored successfully');
            // navigate('/some-other-route'); // Replace with your desired route after submission
        } catch (error) {
            console.error('Error storing attendance:', error);
            alert('Error storing attendance');
        }
    };

    return (
        <div>
            <h1>Absentees</h1>
            <ul>
                {absentees.map(student => (
                    <li key={student.roll_no}>{student.roll_no} - {student.name}</li>
                ))}
            </ul>

            <h1>Students on Duty</h1>
            <ul>
                {onDutyStudents.map(student => (
                    <li key={student.roll_no}>{student.roll_no} - {student.name}</li>
                ))}
            </ul>

            <h1>Present Students</h1>
            <ul>
                {presentStudents.map(student => (
                    <li key={student.roll_no}>{student.roll_no} - {student.name}</li>
                ))}
            </ul>

            <button onClick={handleSubmitAttendance}>Submit Attendance</button>
        </div>
    );
};

export default StudentsAbsentees;
