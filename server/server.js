const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();
const { promisify } = require('util');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'shapna0327.', // Replace with your MySQL password
  database: 'attendance_system' // Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to Database Successfully');
});

// =============================== ADMIN SERVER CODE STARTS ==================================
// Login endpoint for admin
app.post('/:role/login', (req, res) => {
  const { role } = req.params;
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND role = ?';
  connection.query(query, [username, role], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const user = results[0];
    if (password === user.password) {
      res.json({ success: true, message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful` });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Endpoint to add a single student
app.post('/api/students', (req, res) => {
  const {
    name, rollNo, registerNo, dob, class: studentClass, department, year,
    classAdvisor, email, phoneNumber, address, bloodGroup, dayScholar, password
  } = req.body;

  const query = `
    INSERT INTO students (
      name, roll_no, register_no, dob, class, department, year, class_advisor,
      email, phone_no, address, blood_group, accommodation, password
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [
    name, rollNo, registerNo, dob, studentClass, department, year, classAdvisor,
    email, phoneNumber, address, bloodGroup, dayScholar, password
  ], (err) => {
    if (err) {
      console.error('Error inserting student:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }
    res.json({ success: true, message: 'Student added successfully!' });
  });
});

// Endpoint to handle bulk upload of students from CSV
app.post('/api/students/bulk', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }

  const filePath = req.file.path;
  const students = [];

  // Read CSV file and parse data
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      students.push([
        row.name, row.dob, row.rollNo, row.registerNo, row.phoneNumber, row.address,
        row.bloodGroup, row.department, row.year, row.dayScholar, row.email,
        row.classAdvisor, row.password, row.class // Add class field
      ]);
    })
    .on('end', () => {
      // Insert parsed data into MySQL database
      const query = `
        INSERT INTO students (
          name, dob, roll_no, register_no, phone_no, address, blood_group, department,
          year, accommodation, email, class_advisor, password, class
        ) VALUES ?
      `;

      connection.query(query, [students], (err) => {
        if (err) {
          console.error('Error inserting students:', err);
          res.status(500).json({ success: false, message: 'Internal server error' });
          return;
        }

        res.json({ success: true, message: 'Students added successfully!' });
      });

      // Delete the temporary file after processing
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

// Endpoint to get student counts by department
app.get('/api/students/departments', (req, res) => {
  const query = `
    SELECT department, COUNT(*) as count
    FROM students
    GROUP BY department
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }
    
    res.json({ success: true, departments: results });
  });
});

// Endpoint to get student counts by year
app.get('/api/students/years', (req, res) => {
  const query = `
    SELECT year, COUNT(*) as count
    FROM students
    GROUP BY year
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }
    
    res.json({ success: true, years: results });
  });
});

// Endpoint to get total number of students
app.get('/api/students/total', (req, res) => {
  const query = `
    SELECT COUNT(*) as total
    FROM students
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    res.json({ success: true, total: results[0].total });
  });
});


// Add Faculty Endpoints
app.post('/api/faculty', (req, res) => {
  const {
    name, facultyId, dob, department, email, phoneNo, address,
    bloodGroup, designation, password
  } = req.body;

  const query = `
    INSERT INTO faculty (
      name, faculty_id, dob, department, email, phone_no, address, blood_group, designation, password
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [
    name, facultyId, dob, department, email, phoneNo, address, bloodGroup, designation, password
  ], (err) => {
    if (err) {
      console.error('Error inserting faculty:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }
    res.json({ success: true, message: 'Faculty added successfully!' });
  });
});

app.post('/api/faculty/bulk', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }

  const filePath = req.file.path;
  const faculty = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      faculty.push([
        row.name, row.facultyId, row.dob, row.department, row.email,
        row.phoneNo, row.address, row.bloodGroup, row.designation, row.password
      ]);
    })
    .on('end', () => {
      const query = `
        INSERT INTO faculty (
          name, faculty_id, dob, department, email, phone_no, address, blood_group, designation, password
        ) VALUES ?
      `;

      connection.query(query, [faculty], (err) => {
        if (err) {
          console.error('Error inserting faculty:', err);
          res.status(500).json({ success: false, message: 'Internal server error' });
          return;
        }
        res.json({ success: true, message: 'Faculty added successfully!' });
      });

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

app.get('/api/faculty', (req, res) => {
  const query = 'SELECT * FROM faculty';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving faculty:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }
    res.json({ success: true, faculty: results });
  });
});

//update faculty
app.put('/api/faculty/:id', (req, res) => {
  const { id } = req.params;
  const {
    name, facultyId, dob, department, email, phoneNo, address,
    bloodGroup, designation, password
  } = req.body;

  const query = `
    UPDATE faculty SET
      name = ?, faculty_id = ?, dob = ?, department = ?, email = ?, phone_no = ?, address = ?, blood_group = ?, designation = ?, password = ?
    WHERE id = ?
  `;

  connection.query(query, [
    name, facultyId, dob, department, email, phoneNo, address, bloodGroup, designation, password, id
  ], (err) => {
    if (err) {
      console.error('Error updating faculty:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }
    res.json({ success: true, message: 'Faculty updated successfully!' });
  });
});

app.delete('/api/faculty/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM faculty WHERE id = ?';

  connection.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting faculty:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }
    res.json({ success: true, message: 'Faculty deleted successfully!' });
  });
});


// =============================== ADMIN SERVER CODE ENDS ==================================

// ========================================== FACULTY SERVER CODE STARTS ===============================================

// Endpoint to handle faculty login and return faculty ID
/// Faculty login route
app.post('/api/faculty/login', (req, res) => {
  const { faculty_id, password } = req.body;
  const query = 'SELECT * FROM faculty WHERE faculty_id = ?';

  connection.query(query, [faculty_id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    const faculty = results[0];

    if (password === faculty.password) {
      return res.status(200).json({ success: true, message: 'Login successful', id: faculty.id });
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  });
});

// Faculty details route
app.get('/api/faculty/details/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM faculty WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.status(200).json(results[0]);
  });
});

// Endpoint to fetch faculty details by ID
app.get('/api/faculty/details/:id', (req, res) => {
  const facultyId = req.params.id;
  const query = 'SELECT * FROM faculty WHERE id = ?';

  connection.query(query, [facultyId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ success: false, message: 'Faculty not found' });
      return;
    }

    res.json(results[0]);
  });
});

// Faculty Profile picture upload endpoint
app.post('/api/upload/profile-picture', upload.single('profilePicture'), (req, res) => {
  const { facultyId } = req.body;
  const profilePicturePath = `/uploads/${req.file.filename}`;

  const query = 'UPDATE faculty SET profile_picture = ? WHERE id = ?';
  connection.query(query, [profilePicturePath, facultyId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    res.json({ success: true, message: 'Profile picture uploaded successfully', filePath: profilePicturePath });
  });
});

// Endpoint to fetch students
app.get('/api/students', (req, res) => {
  const { department, year, className } = req.query;

  if (!department || !year || !className) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const query = 'SELECT profile_picture, roll_no, name FROM students WHERE department = ? AND year = ? AND class = ?';
  connection.query(query, [department, year, className], (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

// Endpoint to save attendance
// Promisify MySQL queries
const queryAsync = promisify(connection.query).bind(connection);

// API endpoint to handle attendance saving
app.post('/api/attendance1', async (req, res) => {
  const { period, date, subject, class_taken } = req.body;

  const query = `INSERT INTO attendance1 (period, date, subject, class_taken) VALUES (?, ?, ?, ?)`;
  
  try {
    const result = await queryAsync(query, [period, date, subject, class_taken]);
    console.log('Attendance saved successfully');
    res.status(200).json({ success: true, message: 'Attendance saved successfully' });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//          Attendance2
app.post('/api/attendance2', (req, res) => {
  const { presentStudents, absentees, onDutyStudents } = req.body;
  if (!Array.isArray(presentStudents) || !Array.isArray(absentees) || !Array.isArray(onDutyStudents)) {
    return res.status(400).json({ success: false, message: 'Invalid data format' });
  }
  const allStudents = [...presentStudents, ...absentees, ...onDutyStudents];
  const values = allStudents.map(student => [student.roll_no, student.name, student.status]);
  const query = 'INSERT INTO attendance2 (roll_no, name, status) VALUES ?';

  connection.query(query, [values], (err, results) => {
    if (err) {
      console.error('Error inserting students:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    res.json({ success: true, message: 'Students attendance recorded successfully' });
  });
});

// ==================================== Student Componenets Starts ======================================

// Student login route
app.get('/api/student/details/:id', (req, res) => {
  const studentId = req.params.id;
  const query = 'SELECT * FROM students WHERE id = ?';

  connection.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching student details:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = results[0];
    return res.status(200).json({ success: true, data: student });
  });
});

// Student Profile
app.get('/api/student/details/:id', (req, res) => {
  const studentId = req.params.id;
  const query = 'SELECT * FROM students WHERE id = ?';

  connection.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching student details:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = results[0];
    return res.status(200).json({ success: true, data: student });
  });
});

// Server-side endpoint for student profile picture upload
app.post('/api/upload/profile-picture', upload.single('profilePicture'), (req, res) => {
  const { studentId } = req.body;
  const profilePicturePath = `/uploads/${req.file.filename}`;

  const query = 'UPDATE students SET profile_picture = ? WHERE id = ?';
  connection.query(query, [profilePicturePath, studentId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    res.json({ success: true, message: 'Profile picture uploaded successfully', filePath: profilePicturePath });
  });
});

//Start serverss
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});