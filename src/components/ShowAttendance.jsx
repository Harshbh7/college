// src/components/ShowAttendance.jsx
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
  Box,
} from '@mui/material';
import axios from 'axios';

const DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

const FIREBASE_URL = `https://college-fde10-default-rtdb.firebaseio.com/attendance.json`;
const STUDENT_LIST_URL = `https://college-fde10-default-rtdb.firebaseio.com/student_list.json`;

const ShowAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const [attendanceResponse, studentsResponse] = await Promise.all([
          axios.get(FIREBASE_URL),
          axios.get(STUDENT_LIST_URL),
        ]);

        const attendance = attendanceResponse.data || {};
        const studentsData = studentsResponse.data || {};

        // Transform students data
        const studentList = Object.keys(studentsData).map((key) => ({
          id: key,
          sr: studentsData[key].sr,
          name: studentsData[key].name,
        }));

        setStudents(studentList);

        // Flatten attendance data for easier rendering
        const flattenedAttendance = [];
        Object.keys(attendance).forEach((year) => {
          Object.keys(attendance[year]).forEach((month) => {
            Object.keys(attendance[year][month]).forEach((date) => {
              const dailyAttendance = attendance[year][month][date];
              Object.keys(dailyAttendance).forEach((studentId) => {
                const record = {
                  date: `${year}-${month.padStart(2, '0')}-${date.padStart(2, '0')}`,
                  studentId,
                  name: studentsData[studentId]?.name || 'Unknown',
                  status: dailyAttendance[studentId]?.status || 'N/A',
                };
                flattenedAttendance.push(record);
              });
            });
          });
        });

        setAttendanceData(flattenedAttendance);
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <h1>Show Attendance</h1>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((record, index) => (
              <TableRow key={`${record.studentId}-${record.date}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ShowAttendance;
