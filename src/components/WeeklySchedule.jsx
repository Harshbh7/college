// src/components/WeekltSchedule.jsx
import React, { useState } from 'react';

const CollegePresentRegister = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendance, setAttendance] = useState({});
  const [selectedAttendance, setSelectedAttendance] = useState({});

  // Sample Courses with date and time options
  const Courses = [
    "Network Security",
    ".NET Visual Studio",
    "Computer Graphics",
    "System Analysis & Design",
    "System Design & Algorithm",
    "Lab Practical",
  ];

  // Sample students
  const students = [
    { name: "John Doe" },
    { name: "Jane Smith" },
    { name: "Alice Johnson" },
    { name: "Bob Brown" },
  ];

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleAttendanceChange = (studentName, isPresent) => {
    setSelectedAttendance({
      ...selectedAttendance,
      [studentName]: isPresent ? 'Present' : 'Absent',
    });

    setAttendance({
      ...attendance,
      [studentName]: {
        ...attendance[studentName],
        [selectedSubject]: isPresent,
      },
    });
  };

  const getCurrentDateTime = () => {
    const date = new Date();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>College Present Register</h2>
      
      {/* Date and Time */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <p><strong>Date and Time: </strong>{getCurrentDateTime()}</p>
      </div>
      
      {/* Subject Dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="subject" style={{ marginRight: "10px" }}>Select Subject: </label>
        <select
          id="subject"
          value={selectedSubject}
          onChange={handleSubjectChange}
          style={{ padding: "5px", fontSize: "16px" }}
        >
          <option value="">Select a subject</option>
          {Courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Table */}
      {selectedSubject && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Student Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.name}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{student.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button
                    onClick={() => handleAttendanceChange(student.name, true)}
                    style={{
                      backgroundColor: selectedAttendance[student.name] === 'Present' ? "#4CAF50" : "#e0e0e0",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(student.name, false)}
                    style={{
                      backgroundColor: selectedAttendance[student.name] === 'Absent' ? "#f44336" : "#e0e0e0",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CollegePresentRegister;
