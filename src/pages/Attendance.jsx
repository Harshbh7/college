// src/pages/attendance.jsx
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import '../styles/Attendance.css';
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import { Download, CheckCircle, Cancel } from '@mui/icons-material';

function getTargetLocation() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('chrome')) {
    return { latitude: 27.1407174, longitude: 78.0309542 };
  } else if (userAgent.includes('edge')) {
    return { latitude: 27.222439, longitude: 78.052361 };
  }
  return { latitude: 27.1766701, longitude: 78.0080745 };
}

const targetLocation = getTargetLocation();
const maxDistance = 5000;

const DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December',
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation(pos.coords),
        () => Swal.fire({ title: 'Error', text: 'Unable to retrieve your location.', icon: 'error' })
      );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!year || !month || !date) return;
      setLoading(true);
      try {
        const studentRes = await fetch(`https://college-fde10-default-rtdb.firebaseio.com/student_list.json`);
        const studentData = await studentRes.json();

        const attendanceRes = await fetch(
          `https://college-fde10-default-rtdb.firebaseio.com/attendance/${year}/${month}/${date}.json`
        );
        const attendanceData = await attendanceRes.json();

        const combined = Object.keys(studentData || {}).map((id) => ({
          id,
          name: studentData[id]?.name || `Student ${id}`,
          status: attendanceData?.[id]?.status || 'N/A',
        }));

        setStudents(combined);
      } catch (err) {
        console.error('Error:', err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month, date]);

  const updateStatus = async (id, newStatus) => {
    if (!userLocation) {
      Swal.fire({ title: 'Error', text: 'Unable to determine your location.', icon: 'error' });
      return;
    }

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      targetLocation.latitude,
      targetLocation.longitude
    );

    if (distance > maxDistance) {
      Swal.fire({
        title: 'Too Far to Mark Attendance',
        text: `You're ${Math.round(distance)}m away. Limit: ${maxDistance}m.`,
        icon: 'warning',
      });
      return;
    }

    try {
      const url = `https://college-fde10-default-rtdb.firebaseio.com/attendance/${year}/${month}/${date}/${id}.json`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const exportToExcel = () => {
    const formatted = students.map((s, i) => ({
      SrNo: i + 1,
      Name: s.name,
      Status: s.status,
      Year: year,
      Month: month,
      Date: date,
    }));
    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `Attendance_${year}-${month}-${date}.xlsx`);
  };

  const getButtonColor = (status) => {
    if (status === 'Present') return 'success';
    if (status === 'Absent') return 'error';
    return 'inherit';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom color="primary">
            Attendance Management
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select value={month} onChange={(e) => setMonth(e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {months.map((m, i) => (
                  <MenuItem key={i} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Date</InputLabel>
              <Select value={date} onChange={(e) => setDate(e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {month &&
                  Array.from({ length: new Date(year, months.indexOf(month) + 1, 0).getDate() }, (_, i) => i + 1)
                    .filter((d) => new Date(year, months.indexOf(month), d).getDay() !== 0)
                    .map((d) => (
                      <MenuItem key={d} value={d}>{d}</MenuItem>
                    ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            startIcon={<Download />}
            color="success"
            sx={{ mb: 2 }}
            onClick={exportToExcel}
          >
            Export to Excel
          </Button>

          {loading ? (
            <Box sx={{ textAlign: 'center', mt: 3 }}><CircularProgress /></Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Sr. No.</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((s, i) => (
                    <TableRow key={s.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={getButtonColor(s.status)}
                          startIcon={s.status === 'Present' ? <CheckCircle /> : <Cancel />}
                          onClick={() =>
                            updateStatus(s.id, s.status === 'Present' ? 'Absent' : 'Present')
                          }
                        >
                          {s.status === 'Present' ? 'Mark Absent' : 'Mark Present'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Attendance;




// import React, { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import {
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import "../styles/Attendance.css";

// const StudentDetails = () => {
//   const [studentDetails, setStudentDetails] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
//   const [month, setMonth] = useState(""); // Default to no month selected

//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   // Function to get the number of days in a month
//   const getDaysInMonth = (month, year) => {
//     // Month is 0-indexed, so subtract 1 from the month number
//     return new Date(year, month, 0).getDate();
//   };

//   // Fetch student details
//   const fetchStudentDetails = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "https://college-fde10-default-rtdb.firebaseio.com/student_list/-OFg7ivkOKVsAzxEEQP7.json"
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch data.");
//       }

//       const data = await response.json();

//       if (data) {
//         setStudentDetails(data);
//       } else {
//         Swal.fire({
//           title: "Error",
//           text: "No data found for the student.",
//           icon: "error",
//           confirmButtonText: "OK",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching student details:", error);
//       Swal.fire({
//         title: "Error",
//         text: "Failed to fetch student details.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch attendance status for each date (1-31) for the selected month and year
//   const fetchAttendanceData = async () => {
//     if (month && year) {
//       setLoading(true);
//       try {
//         let statusData = [];
//         const daysInMonth = getDaysInMonth(months.indexOf(month) + 1, year); // Get the number of days in the selected month

//         for (let date = 1; date <= daysInMonth; date++) {
//           // Check if the date is a Sunday (0 = Sunday)
//           const dateObj = new Date(`${month} ${date}, ${year}`);
//           const dayOfWeek = dateObj.getDay(); // Get day of the week (0-6, Sunday = 0)

//           if (dayOfWeek === 0) {
//             // Skip Sundays
//             continue;
//           }

//           const response = await fetch(
//             `https://college-fde10-default-rtdb.firebaseio.com/attendance/${year}/${month}/${date}/-OFg7ivkOKVsAzxEEQP7/status.json`
//           );

//           if (!response.ok) {
//             throw new Error(`Failed to fetch attendance for date ${date}.`);
//           }

//           const data = await response.json();

//           if (data) {
//             statusData.push({ date, status: data });
//           } else {
//             statusData.push({ date, status: "No data" });
//           }
//         }

//         setAttendanceData(statusData);
//       } catch (error) {
//         console.error("Error fetching attendance data:", error);
//         Swal.fire({
//           title: "Error",
//           text: "Failed to fetch attendance data.",
//           icon: "error",
//           confirmButtonText: "OK",
//         });
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchStudentDetails();
//   }, []);

//   useEffect(() => {
//     if (month && year) {
//       fetchAttendanceData();
//     }
//   }, [month, year]);

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#3f51b5" }}>
//         Student Details
//       </h2>

//       {loading ? (
//         <div style={{ textAlign: "center" }}>
//           <CircularProgress />
//         </div>
//       ) : studentDetails ? (
//         <div style={{ margin: "0 auto", maxWidth: "600px", textAlign: "left" }}>
//           <p>
//             <strong>Name:</strong> {studentDetails.name}
//           </p>
//           <p>
//             <strong>Father's Name:</strong> {studentDetails.fathername}
//           </p>
//           <p>
//             <strong>Mother's Name:</strong> {studentDetails.mothername || "N/A"}
//           </p>
//           <p>
//             <strong>Roll No:</strong> {studentDetails.rollNo}
//           </p>
//           <p>
//             <strong>Enrollment No:</strong> {studentDetails.en}
//           </p>
//           <p>
//             <strong>WRN:</strong> {studentDetails.wrn || "N/A"}
//           </p>
//           <p>
//             <strong>Gender:</strong> {studentDetails.gender}
//           </p>
//           <p>
//             <strong>Mobile No:</strong> {studentDetails.mobile}
//           </p>
//           <p>
//             <strong>Address:</strong> {studentDetails.address}
//           </p>
//         </div>
//       ) : (
//         <p style={{ textAlign: "center" }}>No student details available.</p>
//       )}

//       {/* Dropdowns for Year and Month */}
//       <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px", marginTop: "20px" }}>
//         <FormControl style={{ minWidth: 150 }}>
//           <InputLabel>Year</InputLabel>
//           <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
//             {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
//               <MenuItem key={y} value={y}>
//                 {y}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <FormControl style={{ minWidth: 150 }}>
//           <InputLabel>Month</InputLabel>
//           <Select value={month} onChange={(e) => setMonth(e.target.value)}>
//             <MenuItem value="">None</MenuItem>
//             {months.map((m, index) => (
//               <MenuItem key={index} value={m}>
//                 {m}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </div>

//       {/* Display Attendance in Table Format */}
//       {attendanceData.length > 0 && (
//         <Table style={{ marginTop: "30px", width: "100%" }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {attendanceData.map((attendance, index) => (
//               <TableRow key={index}>
//                 <TableCell>{attendance.date}</TableCell>
//                 <TableCell>{attendance.status}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default StudentDetails;





