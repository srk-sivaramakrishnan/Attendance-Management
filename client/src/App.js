import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManageStudents from './components/Admin/ManageStudents';
import AddStudent from './components/Admin/AddStudent';
import MoreStudents from './components/Admin/MoreStudents'; 
import RemoveStudent from './components/Admin/RemoveStudent';
import UpdateStudentProfile from './components/Admin/UpdateStudentProfile';
import AddFaculty from './components/Admin/AddFaculty';
import MoreFaculty from './components/Admin/MoreFaculty';
// import FacultyLogin from './components/Faculty/FacultyLogin';
// import FacultyDashboard from './components/Faculty/FacultyDashboard';
// import FacultyProfile from './components/Faculty/FacultyProfile';
// import AttendanceMarking from './components/Faculty/AttendanceMarking';
// import StudentsMarking from './components/Faculty/StudentsMarking';
// import StudentsAbsentees from './components/Faculty/StudentsAbsentees';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-students" element={<ManageStudents />} />
        <Route path="/admin/manage-students/add-students" element={<AddStudent />} />
        <Route path="/admin/manage-students/more-students" element={<MoreStudents />} />
        <Route path="/admin/manage-students/remove" element={<RemoveStudent />} />
        <Route path="/admin/manage-students/update" element={<UpdateStudentProfile />} />
        <Route path="/admin/manage-faculty/add-faculty" element={<AddFaculty />} />
        <Route path="/admin/manage-faculty/more-faculty" element={<MoreFaculty />} />
        {/* <Route path="/faculty/login" element={<FacultyLogin />} />
        <Route path="/faculty/dashboard/:id" element={<FacultyDashboard />} />
        <Route path="/faculty/profile/:id" element={<FacultyProfile />} />
        <Route path="/faculty/attendance-marking/:id" element={<AttendanceMarking />} />
        <Route path="/faculty/students-absentees" element={<StudentsAbsentees />} />
        <Route path="/faculty/students-marking" element={<StudentsMarking/>} /> */}
      </Routes>
    </Router>
  );
}

export default App;



