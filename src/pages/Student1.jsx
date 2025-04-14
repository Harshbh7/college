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
  const [Student1, setStudent1] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  const API_URL = `${DATABASE_URL}/student_list.json`;

  // Fetch Student1 from API
  const fetchStudent1 = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      const data = response.data || {};
      const formattedData = Object.keys(data)
        .map((key) => ({
          ...data[key],
          id: key,
        }))
        .sort((a, b) => parseInt(a.sr) - parseInt(b.sr)); // Sort by `sr`
      setStudent1(formattedData);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch Student1", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent1();
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

      {/* Table (Desktop View) */}
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
              {Student1.map((student) => (
                <TableRow key={student.id} className="table-row">
                  <TableCell>{student.sr}</TableCell>
                  <TableCell>{student.en}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.wrn}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.fathername}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.mobile}</TableCell>
                  <TableCell>{student.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Mobile View (Key-Value Format)
        <div className="mobile-card-container">
          {Student1.map((student) => (
            <div key={student.id} className="student-card">
              <Typography variant="h6" className="student-title">📌 {student.name}</Typography>
              <div className="student-info">
                <p><strong>SR No:</strong> {student.sr}</p>
                <p><strong>EN No:</strong> {student.en}</p>
                <p><strong>Roll No:</strong> {student.rollNo}</p>
                <p><strong>WRN:</strong> {student.wrn}</p>
                <p><strong>Father's Name:</strong> {student.fathername}</p>
                <p><strong>Gender:</strong> {student.gender}</p>
                <p><strong>Mobile No:</strong> {student.mobile}</p>
                <p><strong>Address:</strong> {student.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Student1;
