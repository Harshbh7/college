// src/pages/attendance.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import the xlsx library
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const FIREBASE_URL = 'https://college-fde10-default-rtdb.firebaseio.com/attendance';
const STUDENT_LIST_URL = 'https://college-fde10-default-rtdb.firebaseio.com/student_list.json';

// Function to detect browser and adjust targetLocation
function getTargetLocation() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('chrome')) {
    return {
      latitude: 27.1766701,// home
      longitude: 78.0080745,//home
    };
  } else if (userAgent.includes('edge')) {
    return {
      latitude: 27.22241912607724,
      longitude: 78.05234643696139,
    };
  }
  return {
    latitude: 27.1766701,
    longitude: 78.0080745,
  };
}

const targetLocation = getTargetLocation();
const maxDistance = 50;

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // returns distance in meters
}

const Attendance = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default current month
  const [year, setYear] = useState(new Date().getFullYear()); // Default current year
  const [date, setDate] = useState(new Date().getDate()); // Default current date
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);

  const generateDateOptions = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const workingDays = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month - 1, i);
      if (date.getDay() !== 0) {
        workingDays.push(i);
      }
    }

    return workingDays;
  };

  const generateYearOptions = () => Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setRole(user.email === 'harshbh8112@gmail.com' ? 'admin' : 'student');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(STUDENT_LIST_URL);
        const studentArray = Object.keys(data || {}).map((key) => ({
          id: key,
          sr: data[key].sr,
          name: data[key].name,
        }));
        setStudents(studentArray);

        const initialAttendance = studentArray.reduce((acc, student) => {
          acc[student.id] = {};
          return acc;
        }, {});

        setAttendance(initialAttendance);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const attendancePath = `/${year}/${month}/${date}.json`;
        const { data } = await axios.get(`${FIREBASE_URL}${attendancePath}`);
        if (data) {
          setAttendance(data);
        }
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
      }
    };

    if (year && month && date) {
      fetchAttendanceData();
    }
  }, [year, month, date]);

  const handleAttendanceChange = (studentId, status) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;
        const distance = calculateDistance(
          targetLocation.latitude,
          targetLocation.longitude,
          userLatitude,
          userLongitude
        );

        if (distance <= maxDistance) {
          setAttendance((prev) => ({
            ...prev,
            [studentId]: {
              ...prev[studentId],
              [`${year}-${month}-${date}`]: {
                status,
                year,
                month,
                date,
                time: new Date().toLocaleTimeString(),
                latitude: userLatitude,
                longitude: userLongitude,
              },
            },
          }));
          Swal.fire('Success', 'Attendance marked as Present!', 'success');
        } else {
          Swal.fire('Error', 'You are not within the allowed distance!', 'error');
        }
      },
      (error) => {
        let errorMessage = 'An error occurred.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Permission denied. Enable location access.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location unavailable. Check settings.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Request timed out. Try again.';
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    );
  };

  const saveAttendanceToFirebase = async () => {
    try {
      for (let studentId in attendance) {
        const attendanceData = attendance[studentId][`${year}-${month}-${date}`];
        if (attendanceData) {
          const attendancePath = `attendance/${year}/${monthNames[month - 1]}/${date}/${studentId}.json`;
          await axios.patch(`https://college-fde10-default-rtdb.firebaseio.com/${attendancePath}`, attendanceData);
        }
      }
      Swal.fire('Success', 'Attendance saved successfully!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to save attendance.', 'error');
    }
  };

  const exportToExcel = () => {
    const formattedData = students.map((student) => {
      const studentAttendance = attendance[student.id] || {};
      return {
        ID: student.sr,
        Name: student.name,
        Status: studentAttendance[`${year}-${month}-${date}`]?.status || 'Absent',
        Year: year,
        Month: monthNames[month - 1],
        Date: date,
        Time: studentAttendance[`${year}-${month}-${date}`]?.time || '',
        Latitude: studentAttendance[`${year}-${month}-${date}`]?.latitude || '',
        Longitude: studentAttendance[`${year}-${month}-${date}`]?.longitude || '',
      };
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `Attendance_${year}-${monthNames[month - 1]}-${date}.xlsx`);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <h1>Attendance</h1>
      <>
        {role === 'admin' && (
          <FormControl style={{ marginRight: '10px' }}>
            <InputLabel>Date</InputLabel>
            <Select value={date} onChange={handleDateChange}>
              {generateDateOptions().map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <FormControl style={{ marginRight: '10px' }}>
          <InputLabel>Month</InputLabel>
          <Select value={month} onChange={handleMonthChange}>
            {monthNames.map((name, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Year</InputLabel>
          <Select value={year} onChange={handleYearChange}>
            {generateYearOptions().map((yearOption) => (
              <MenuItem key={yearOption} value={yearOption}>
                {yearOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>

      <Box
  sx={{
    overflowX: 'auto',
    marginTop: 2,
    '& table': {
      minWidth: 650,
    },
    '& th, & td': {
      whiteSpace: 'nowrap',
    },
    '@media (max-width: 600px)': {
      '& table': {
        display: 'block', // Make table act like a block
      },
      '& thead': {
        display: 'none', // Hide table headers on small screens
      },
      '& tbody': {
        display: 'block', // Display table rows as block
      },
      '& tr': {
        display: 'block', // Make each row a block
        borderBottom: '1px solid #ddd',
        marginBottom: '16px',
      },
      '& td': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px',
        fontSize: '14px',
      },
      '& td::before': {
        content: 'attr(data-label)', // Use attribute as a label
        fontWeight: 'bold',
        flex: '1 0 40%',
      },
      // Hide 'Sr.' and 'Status' columns on small screens
      '& td:nth-of-type(1), & td:nth-of-type(3)': {
        display: 'none',
      },
      '& .action-buttons': {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      },
    },
    '@media (min-width: 601px)': {
      // Make sure columns are visible on larger screens
      '& td:nth-of-type(1), & td:nth-of-type(3)': {
        display: 'table-cell', // Show 'Sr.' and 'Status' on larger screens
      },
    },
  }}
>
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Sr.</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {students.map((student, index) => {
          const studentAttendance = attendance[student.id] || {};
          const currentStatus = studentAttendance[`${year}-${month}-${date}`]?.status || 'Absent';

          return (
            <TableRow key={student.id}>
              <TableCell data-label="Sr.">{index + 1}</TableCell>
              <TableCell data-label="Name">{student.name}</TableCell>
              <TableCell data-label="Status">{currentStatus}</TableCell>
              <TableCell data-label="Action">
                <Box className="action-buttons">
                  <Button
                    onClick={() => handleAttendanceChange(student.id, 'Present')}
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Present
                  </Button>
                  <Button
                    onClick={() => handleAttendanceChange(student.id, 'Absent')}
                    variant="contained"
                    color="secondary"
                    size="small"
                  >
                    Absent
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
</Box>



      {role === 'admin' && (
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" color="success" onClick={saveAttendanceToFirebase}>
            Save Attendance
          </Button>
          <Button variant="contained" color="info" onClick={exportToExcel}>
            Export to Excel
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Attendance;
