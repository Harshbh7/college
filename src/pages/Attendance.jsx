// src/pages/attendance.jsx
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
  TextField,
  Box,
  CircularProgress,
  MenuItem,
  Select,
} from '@mui/material';
import axios from 'axios';

// Firebase URL
const FIREBASE_URL = "https://college-fde10-default-rtdb.firebaseio.com/student_list.json";

// Helper function to get month dates in dd/mm/yyyy format
const getDatesForMonth = (month, year) => {
  const dates = [];
  for (let day = 1; day <= 31; day++) {
    const date = new Date(year, month, day);
    if (date.getMonth() !== month) break; // Ensure valid date
    if (date.getDay() !== 0) { // Exclude Sundays (optional)
      const formattedDate = date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }); // dd/mm/yyyy format
      dates.push(formattedDate);
    }
  }
  return dates;
};

const Attendance = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [datesForMonth, setDatesForMonth] = useState(getDatesForMonth(month, year));
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(FIREBASE_URL);
        const data = response.data || {};

        // Transform Firebase data into a usable format
        const transformedStudents = Object.keys(data).map((key) => ({
          id: key,
          sr: data[key].sr,
          name: data[key].name,
        }));

        // Set students
        setStudents(transformedStudents);

        // Initialize attendance state
        const initialAttendance = transformedStudents.reduce((acc, student) => {
          acc[student.name] = datesForMonth.reduce((dayAcc, date) => {
            dayAcc[date] = ''; // Default empty attendance
            return dayAcc;
          }, {});
          return acc;
        }, {});

        setAttendance(initialAttendance);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [datesForMonth]);

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value, 10);
    setMonth(selectedMonth);
    setDatesForMonth(getDatesForMonth(selectedMonth, year));
  };

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value, 10);
    setYear(selectedYear);
    setDatesForMonth(getDatesForMonth(month, selectedYear));
  };

  const handleAttendanceChange = (student, date, status) => {
    setAttendance((prev) => ({
      ...prev,
      [student]: {
        ...prev[student],
        [date]: status,
      },
    }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'P':
      case 'p':
        return { backgroundColor: 'green', color: 'white' };
      case 'A':
      case 'a':
        return { backgroundColor: 'red', color: 'white' };
      case 'L':
      case 'l':
        return { backgroundColor: 'yellow', color: 'black' };
      default:
        return {};
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <h1>Attendance Sheet</h1>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <Select
          value={month}
          onChange={handleMonthChange}
          sx={{ width: 150 }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <MenuItem key={i} value={i}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={year}
          onChange={handleYearChange}
          sx={{ width: 150 }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <MenuItem key={i} value={2023 + i}>
              {2023 + i}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr</TableCell>
              <TableCell>Student</TableCell>
              {datesForMonth.map((date) => (
                <TableCell key={date}>{date}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.sr}</TableCell>
                <TableCell>{student.name}</TableCell>
                {datesForMonth.map((date) => (
                  <TableCell key={date}>
                    <TextField
                      value={attendance[student.name]?.[date] || ''}
                      onChange={(e) =>
                        handleAttendanceChange(student.name, date, e.target.value)
                      }
                      sx={getStatusStyle(attendance[student.name]?.[date])}
                      inputProps={{ maxLength: 1 }}
                      placeholder="P/A/L"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Attendance;
