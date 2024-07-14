
-- Create the attendance_system database if it doesn't exist
CREATE DATABASE IF NOT EXISTS attendance_system;

-- Use the attendance_system database
USE attendance_system;

-- Table for users (admins, faculty, students)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'faculty', 'student') NOT NULL
);

-- Sample data for users
INSERT INTO users (username, password, role) VALUES
('admin', 'password', 'admin');


-- Table for students 
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    roll_no VARCHAR(20) NOT NULL,
    register_no VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    class VARCHAR(20) NOT NULL,
    department VARCHAR(50) NOT NULL,
    year VARCHAR(20) NOT NULL,
    class_advisor VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_no VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    accommodation VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL, -- Store hashed passwords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE students ADD COLUMN profile_picture VARCHAR(255);

-- Sample query to fetch all student
SELECT * FROM students;
Drop table students;


-- Table for Faculty 
CREATE TABLE faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    faculty_id VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    department VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_no VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    designation VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL -- Store hashed passwords
);

ALTER TABLE faculty ADD COLUMN profile_picture VARCHAR(255);

-- Sample query to fetch all faculty
SELECT * FROM faculty;
Drop table faculty;

-- Table for Attendance
CREATE TABLE attendance1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    period INT NOT NULL,
    date DATE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    class_taken VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance2 (
  roll_no VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  status ENUM('present', 'absent', 'onDuty') NOT NULL,
  PRIMARY KEY (roll_no)
);

-- Sample query to fetch all faculty
SELECT * FROM attendance2;
Drop table attendance2;

-- Table for Absentees
CREATE TABLE absentees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



