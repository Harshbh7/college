// src/pages/StuAttendance.jsx
// src/pages/StuAttendance.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Grid,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { auth } from "../firebaseConfig";
import { ref, onValue, set } from "firebase/database";
import { database } from "../firebaseConfig";
import axios from "axios";

const StuAttendance = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().toLocaleString("default", { month: "long" }));
  const [daysInMonth, setDaysInMonth] = useState(0);

  const isSmallScreen = useMediaQuery("(max-width:425px)");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

  const getCurrentDate = () => {
    const today = new Date();
    return {
      day: today.getDate(),
      month: months[today.getMonth()],
      year: today.getFullYear(),
    };
  };

  const fetchStudentDetails = async (email) => {
    setLoading(true);
    try {
      const response = await axios.get(`${DATABASE_URL}student_list.json`);
      if (!response.data) throw new Error("Failed to fetch student details.");

      const data = response.data;
      const matchedStudent = Object.entries(data).find(
        ([_, student]) => student.email === email
      );

      if (matchedStudent) {
        const [id, details] = matchedStudent;
        setStudentDetails({ id, ...details });
      } else {
        Swal.fire({
          title: "Error",
          text: "No student found with this email ID.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = () => {
    if (month && year && studentDetails?.id) {
      setLoading(true);
      const numDays = getDaysInMonth(months.indexOf(month) + 1, year);
      setDaysInMonth(numDays);

      const attendanceRef = ref(database, `attendance/${year}/${month}`);

      onValue(attendanceRef, (snapshot) => {
        const data = snapshot.val() || {};
        const attendance = [];

        for (let date = 1; date <= numDays; date++) {
          const dateObj = new Date(year, months.indexOf(month), date);
          if (dateObj.getDay() === 0) continue; // Skip Sundays

          const status = data[date]?.[studentDetails.id]?.status || "N/A";
          attendance.push({ date, status });
        }

        setAttendanceData(attendance);
        setLoading(false);
      });
    }
  };

  const saveAttendanceToFirebase = async (index, status) => {
    const { date } = attendanceData[index];
    try {
      const attendanceRef = ref(
        database,
        `attendance/${year}/${month}/${date}/${studentDetails.id}/status`
      );
      await set(attendanceRef, status);
      Swal.fire({
        title: "Success",
        text: `Attendance updated for ${date}.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const predefinedCoordinates = { lat: 27.1407174, lng: 78.0309542 };

  const markAttendanceWithLocation = (index, status) => {
    const { date } = attendanceData[index];

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const isWithinRange =
            Math.abs(latitude - predefinedCoordinates.lat) <= 0.001 &&
            Math.abs(longitude - predefinedCoordinates.lng) <= 0.001;

          if (isWithinRange) {
            const updatedData = [...attendanceData];
            updatedData[index].status = status;
            setAttendanceData(updatedData);
            saveAttendanceToFirebase(index, status);
          } else {
            Swal.fire({
              title: "Error",
              text: "You are not at the required location to mark attendance.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to get location. Please enable location services.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      );
    } else {
      Swal.fire({
        title: "Error",
        text: "Geolocation is not supported by your browser.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    const loggedInEmail = auth.currentUser?.email;
    if (loggedInEmail) fetchStudentDetails(loggedInEmail);
  }, []);

  useEffect(() => {
    if (month && year && studentDetails) fetchAttendanceData();
  }, [month, year, studentDetails]);

  const current = getCurrentDate();

  return (
    <Box sx={{ px: isSmallScreen ? 1 : 4, py: 4 }}>
      <Typography variant="h5" align="center" color="primary" gutterBottom>
        Student Attendance
      </Typography>

      {studentDetails && (
        <Paper elevation={3} sx={{ mx: "auto", p: 3, mb: 4, borderRadius: 3, maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>Student Details</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography><strong>Name:</strong> {studentDetails?.name}</Typography>
          <Typography><strong>Father's Name:</strong> {studentDetails?.fathername}</Typography>
          <Typography><strong>Roll No:</strong> {studentDetails?.rollNo}</Typography>
          <Typography><strong>Email:</strong> {studentDetails?.email}</Typography>
        </Paper>
      )}

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {Array.from({ length: 10 }, (_, i) =>
                new Date().getFullYear() - i
              ).map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select value={month} onChange={(e) => setMonth(e.target.value)}>
              {months.map((m, index) => (
                <MenuItem key={index} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : attendanceData.length > 0 ? (
        <Paper elevation={2} sx={{ overflowX: "auto", borderRadius: 2 }}>
          <Table size={isSmallScreen ? "small" : "medium"}>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((attendance, index) => {
                const isToday =
                  current.month === month &&
                  current.year === year &&
                  current.day === attendance.date;
                return (
                  <TableRow key={index}>
                    <TableCell>{attendance.date}</TableCell>
                    <TableCell>
                      {attendance.status === "Present" ? (
                        <Chip label="Present" color="success" icon={<CheckCircle />} />
                      ) : attendance.status === "Absent" ? (
                        <Chip label="Absent" color="error" icon={<Cancel />} />
                      ) : (
                        <Chip label="N/A" color="default" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Grid container spacing={1} wrap="wrap">
                        <Grid item>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            disabled={!isToday}
                            onClick={() => markAttendanceWithLocation(index, "Present")}
                          >
                            Present
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            disabled={!isToday}
                            onClick={() => markAttendanceWithLocation(index, "Absent")}
                          >
                            Absent
                          </Button>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <Typography align="center" sx={{ mt: 4 }}>
          No attendance data available.
        </Typography>
      )}
    </Box>
  );
};

export default StuAttendance;
