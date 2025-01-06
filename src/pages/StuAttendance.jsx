// src/pages/StuAttendance.jsx
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const StuAttendance = () => {
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase Realtime Database URLs
  const FIREBASE_URL = 'https://college-fde10-default-rtdb.firebaseio.com/attendance';
  const STUDENT_LIST_URL = 'https://college-fde10-default-rtdb.firebaseio.com/student_list.json';
  const API_KEY = "AIzaSyDv__yjGrbW9IoA4bh3ieTbbuyGgwxUhZo";
  const CALENDAR_ID = "en.indian#holiday@group.v.calendar.google.com";

  // Student ID for the specific student
  const studentId = "student123"; // Replace this with the actual student ID

  // Fetch student details from Firebase Realtime Database for a specific student
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(STUDENT_LIST_URL);
        const studentData = response.data[studentId];
        if (studentData) {
          setStudent(studentData);
        } else {
          console.error("No such student found!");
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  // Fetch attendance from Firebase for the specific student
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(FIREBASE_URL + ".json");
        if (response.data) {
          setAttendance(response.data);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, []);

  // Store attendance in localStorage
  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);

  // Handle date click (Mark Present or Absent)
  const handleDateClick = (date) => {
    const day = date.getDay();
    if (day === 0) {
      alert("Sunday is a holiday!");
      return;
    }

    const dateKey = date.toISOString().split("T")[0];
    setAttendance((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey] === "Present" ? "Absent" : "Present",
    }));

    // Save updated attendance to Firebase
    axios
      .put(`${FIREBASE_URL}/${dateKey}.json`, { status: attendance[dateKey] })
      .catch((error) => console.error("Error saving attendance:", error));
  };

  // Add CSS classes based on attendance status
  const tileClassName = ({ date }) => {
    const dateKey = date.toISOString().split("T")[0];
    if (date.getDay() === 0) {
      return "holiday";
    }
    return attendance[dateKey] === "Present" ? "present" : "absent";
  };

  if (loading) {
    return <div>Loading student details...</div>;
  }

  return (
    <div>
      <h2>Student Attendance</h2>
      {student && (
        <div>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Roll No:</strong> {student.rollNo}</p>
          <p><strong>Class:</strong> {student.className}</p>
          <p><strong>Student ID:</strong> {studentId}</p> {/* Displaying the student ID */}
        </div>
      )}
      <Calendar
        onClickDay={handleDateClick}
        value={selectedDate}
        tileClassName={tileClassName}
      />
      <div className="legend">
        <span className="present">● Present</span>
        <span className="absent">● Absent</span>
        <span className="holiday">● Holiday</span>
      </div>
    </div>
  );
};

export default StuAttendance;
