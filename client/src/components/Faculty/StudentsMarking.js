import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/Faculty/StudentsMarking.css'; // Ensure correct path to CSS file

const StudentsMarking = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const department = searchParams.get('department');
    const year = searchParams.get('year');
    const className = searchParams.get('className');

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Use navigate for navigation

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/students?department=${department}&year=${year}&className=${className}`);
                const studentsWithStatus = response.data.map(student => ({
                    ...student,
                    status: 'present' // Initialize status as 'present' for each student
                }));
                setStudents(studentsWithStatus);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, [department, year, className]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleCardClick = (index) => {
        // Define statuses: 'present', 'absent', 'onDuty'
        const statuses = ['present', 'absent', 'onDuty'];

        // Get the current student's status index
        const currentStatusIndex = statuses.indexOf(students[index].status);

        // Calculate the next status index, looping through statuses
        const nextStatusIndex = (currentStatusIndex + 1) % statuses.length;

        // Update the status of the clicked student
        const updatedStudents = students.map((student, i) => ({
            ...student,
            status: i === index ? statuses[nextStatusIndex] : student.status
        }));
        setStudents(updatedStudents);
    };

    const handleSubmit = () => {
        // All students are considered, as they all have a status
        // Redirect to StudentsAbsentees with all students' details
        navigate('/faculty/students-absentees', { state: { selectedStudents: students } });
    };

    return (
        <div>
            <h1>Students Marking</h1>
            <div className="students-container">
                {students.map((student, index) => (
                    <div
                        key={student.roll_no}
                        className={`student-card ${student.status}`}
                        onClick={() => handleCardClick(index)}
                    >
                        <img src={student.profile_picture} alt="Profile" />
                        <p>{student.roll_no}</p>
                        <p>{student.name}</p>
                    </div>
                ))}
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default StudentsMarking;
