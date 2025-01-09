// src/pages/attendance.jsx
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';  // Import the XLSX library
import Swal from 'sweetalert2';
import '../styles/Attendance.css';
import { Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material'; // Import MUI components

function getTargetLocation() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('chrome')) {
    return {
      latitude:  27.1407174,
      longitude: 78.0309542,
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
const maxDistance = 50; // in meters (50 meters)

const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
};

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Unable to retrieve your location.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    }
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const fetchStudentData = async () => {
    if (!year || !month || !date) return;

    setLoading(true);

    try {
      // Fetch student names
      const studentListResponse = await fetch(
        `https://college-fde10-default-rtdb.firebaseio.com/student_list.json`
      );
      const studentListData = await studentListResponse.json();

      // Fetch attendance data for the selected date
      const attendanceResponse = await fetch(
        `https://college-fde10-default-rtdb.firebaseio.com/attendance/${year}/${month}/${date}.json`
      );
      const attendanceData = await attendanceResponse.json();

      const combinedData = Object.keys(studentListData).map((studentId) => ({
        id: studentId,
        name: studentListData[studentId]?.name || `Student ${studentId}`,
        status: attendanceData?.[studentId]?.status || 'N/A',
      }));

      setStudents(combinedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [year, month, date]);

  const updateStatus = async (studentId, newStatus) => {
    if (!userLocation) {
      Swal.fire({
        title: 'Error',
        text: 'Unable to determine your location. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
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
        text: `You are ${Math.round(distance)} meters away from the target location. Attendance can only be marked within ${maxDistance} meters.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const url = `https://college-fde10-default-rtdb.firebaseio.com/attendance/${year}/${month}/${date}/${studentId}.json`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the local state
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === studentId ? { ...student, status: newStatus } : student
          )
        );
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const exportToExcel = () => {
    const formattedData = students.map((student, index) => ({
      SrNo: index + 1, // Add serial number here
      Name: student.name,
      Status: student.status,
      Year: year,
      Month: month,
      Date: date,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `Attendance_${year}-${month}-${date}.xlsx`);
  };

  const getButtonStyle = (status) => {
    switch (status) {
      case 'Present':
        return { backgroundColor: 'green', color: '#fff' };
      case 'Absent':
        return { backgroundColor: 'red', color: '#fff' };
      default:
        return { backgroundColor: 'grey', color: '#fff' };
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#3f51b5' }}>Attendance</h2>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <FormControl style={{ marginRight: '10px', width: '30%' }}>
          <InputLabel>Year</InputLabel>
          <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ marginRight: '10px', width: '30%' }}>
          <InputLabel>Month</InputLabel>
          <Select value={month} onChange={(e) => setMonth(e.target.value)}>
            <MenuItem value="">Month</MenuItem>
            {months.map((m, index) => (
              <MenuItem key={index} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ width: '30%' }}>
          <InputLabel>Date</InputLabel>
          <Select value={date} onChange={(e) => setDate(e.target.value)}>
            <MenuItem value="">Date</MenuItem>
            {month &&
              Array.from({ length: new Date(year, months.indexOf(month) + 1, 0).getDate() }, (_, i) => i + 1)
                .filter((d) => new Date(year, months.indexOf(month), d).getDay() !== 0) // Exclude Sundays
                .map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
      </div>

      <Button
        variant="contained"
        onClick={exportToExcel}
        style={{ marginBottom: '20px', backgroundColor: '#4CAF50', color: '#fff', fontWeight: 'bold' }}
      >
        Export to Excel
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Sr. No.</th> {/* Add Sr. No. column */}
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Student Name</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td> {/* Display serial number */}
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.name}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.status}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <Button
                      variant="contained"
                      style={getButtonStyle(student.status)}
                      onClick={() =>
                        updateStatus(
                          student.id,
                          student.status === 'Present' ? 'Absent' : 'Present'
                        )
                      }
                    >
                      {student.status === 'Present' ? 'Present ' : 'Absent'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;




// import React, { useState, useEffect } from 'react';
// import Swal from 'sweetalert2';
// import { Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material'; // Import MUI components
// import * as XLSX from 'xlsx';
// import '../styles/Attendance.css';

// // Define your component
// const StuAttendance = () => {
//   const [attendance, setAttendance] = useState([]); // Store attendance data for Student with id 'OFg7ivkOKVsAzxEEQP7'
//   const [year, setYear] = useState(new Date().getFullYear()); // Default year
//   const [month, setMonth] = useState(''); // Default month
//   const [loading, setLoading] = useState(false); // Loading state

//   // List of months for the dropdown
//   const months = [
//     'January', 'February', 'March', 'April', 'May',
//     'June', 'July', 'August', 'September', 'October', 'November', 'December',
//   ];

//   // Student ID
//   const studentId = "OFg7ivkOKVsAzxEEQP7";

//   // Function to fetch attendance for Student 1 based on selected year and month
//   const fetchStudentAttendance = async () => {
//     if (!year || !month) return;

//     setLoading(true);

//     try {
//       // Fetch attendance data for the specific student
//       const response = await fetch(
//         `https://college-fde10-default-rtdb.firebaseio.com/attendance/${year}/${month}/${studentId}.json`
//       );
//       const data = await response.json();
//       setAttendance(data || {}); // Store data for Student 1
//     } catch (error) {
//       console.error('Error fetching attendance data:', error);
//       Swal.fire({
//         title: 'Error',
//         text: 'Unable to fetch attendance data for Student 1.',
//         icon: 'error',
//         confirmButtonText: 'OK',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch student attendance when year or month changes
//   useEffect(() => {
//     fetchStudentAttendance();
//   }, [year, month]);

//   // Export attendance to Excel
//   const exportToExcel = () => {
//     const formattedData = Object.keys(attendance).map((date) => ({
//       Date: new Date(date).getDate(), // Extract day of the month
//       Status: attendance[date]?.status || 'N/A',
//     }));

//     const ws = XLSX.utils.json_to_sheet(formattedData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
//     XLSX.writeFile(wb, `Student_Attendance_${studentId}_${year}-${month}.xlsx`);
//   };

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#3f51b5' }}>Student 1 - Attendance</h2>

//       <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
//         <FormControl style={{ marginRight: '10px', width: '30%' }}>
//           <InputLabel>Year</InputLabel>
//           <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
//             {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
//               <MenuItem key={y} value={y}>
//                 {y}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <FormControl style={{ width: '30%' }}>
//           <InputLabel>Month</InputLabel>
//           <Select value={month} onChange={(e) => setMonth(e.target.value)}>
//             <MenuItem value="">Month</MenuItem>
//             {months.map((m, index) => (
//               <MenuItem key={index} value={m}>
//                 {m}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </div>

//       <Button
//         variant="contained"
//         onClick={exportToExcel}
//         style={{ marginBottom: '20px', backgroundColor: '#4CAF50', color: '#fff', fontWeight: 'bold' }}
//       >
//         Export to Excel
//       </Button>

//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <div style={{ overflowX: 'auto' }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr>
//                 <th style={{ padding: '8px', border: '1px solid #ddd' }}>Date</th>
//                 <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.keys(attendance).map((date) => (
//                 <tr key={date}>
//                   <td style={{ padding: '8px', border: '1px solid #ddd' }}>
//                     {new Date(date).getDate()} {/* Show day only */}
//                   </td>
//                   <td style={{ padding: '8px', border: '1px solid #ddd' }}>
//                     {attendance[date]?.status || 'N/A'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StuAttendance;
