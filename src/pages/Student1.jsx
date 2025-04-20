// src/pages/Student1.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  AppBar,
  Toolbar,
  useMediaQuery
} from "@mui/material";
import "../styles/Student1.css";

const Student1 = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const API_URL = `https://college-fde10-default-rtdb.firebaseio.com/student_list.json`;

  const maskString = (str) => {
    if (!str) return ""; // handles null or undefined
    const strValue = String(str); // ensure it's a string
    if (strValue.length <= 2) return strValue;
    return strValue.slice(0, 2) + "*".repeat(strValue.length - 2);
  };
  

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      const data = response.data || {};
      const formattedData = Object.keys(data)
        .map((key) => ({
          ...data[key],
          id: key,
        }))
        .sort((a, b) => parseInt(a.sr) - parseInt(b.sr));
      setStudents(formattedData);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch student list", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <div className="student1-container">
      {/* Header */}
      <AppBar position="static" className="custom-header">
        <Toolbar>
          <Typography variant="h5" className="header-title">
            🎓 Student Management System
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Title */}
      <Typography variant="h4" align="center" className="title">
        📜 Student List
      </Typography>

      {/* Desktop Table View */}
      {!isMobile ? (
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell>SR. No.</TableCell>
                <TableCell>EN. No.</TableCell>
                <TableCell>Roll No.</TableCell>
                <TableCell>WRN</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Father's Name</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Mobile No.</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="table-row">
                  <TableCell>{student.sr}</TableCell>
                  <TableCell>{maskString(student.en)}</TableCell>
                  <TableCell>{maskString(student.rollNo)}</TableCell>
                  <TableCell>{maskString(student.wrn)}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{maskString(student.fathername)}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{maskString(student.mobile)}</TableCell>
                  <TableCell>{maskString(student.address)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Mobile View
        <div className="mobile-card-container">
          {students.map((student) => (
            <div key={student.id} className="student-card">
              <Typography variant="h6" className="student-title">
                📌 {student.name}
              </Typography>
              <div className="student-info">
                <p><strong>SR No:</strong> {student.sr}</p>
                <p><strong>EN No:</strong> {maskString(student.en)}</p>
                <p><strong>Roll No:</strong> {maskString(student.rollNo)}</p>
                <p><strong>WRN:</strong> {maskString(student.wrn)}</p>
                <p><strong>Father's Name:</strong> {maskString(student.fathername)}</p>
                <p><strong>Gender:</strong> {student.gender}</p>
                <p><strong>Mobile No:</strong> {maskString(student.mobile)}</p>
                <p><strong>Address:</strong> {maskString(student.address)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Student1;
