// // src/pages/attendance.jsx
// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';  // Import the XLSX library
// import Swal from 'sweetalert2';
// import '../styles/Attendance.css';
// import { Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material'; // Import MUI components

// function getTargetLocation() {
//   const userAgent = navigator.userAgent.toLowerCase();
//   if (userAgent.includes('chrome')) {
//     return {
//       latitude:  27.1407174,
//       longitude: 78.0309542,
//     };
//   } else if (userAgent.includes('edge')) {
//     return {
//       latitude: 27.22241912607724,
//       longitude: 78.05234643696139,
//     };
//   }
//   return {
//     latitude: 27.1766701,
//     longitude: 78.0080745,
//   };
// }

// const targetLocation = getTargetLocation();
// const maxDistance = 50; // in meters (50 meters)

// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371000; // Earth radius in meters
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // returns distance in meters
// };

// const Attendance = () => {
//   const [students, setStudents] = useState([]);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState('');
//   const [date, setDate] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [userLocation, setUserLocation] = useState(null);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setUserLocation({ latitude, longitude });
//         },
//         (error) => {
//           Swal.fire({
//             title: 'Error',
//             text: 'Unable to retrieve your location.',
//             icon: 'error',
//             confirmButtonText: 'OK',
//           });
//         }
//       );
//     }
//   }, []);

//   const months = [
//     'January', 'February', 'March', 'April', 'May',
//     'June', 'July', 'August', 'September', 'October', 'November', 'December',
//   ];

//   const fetchStudentData = async () => {
//     if (!year || !month || !date) return;

//     setLoading(true);

//     try {
//       // Fetch student names
//       const studentListResponse = await fetch(
//         `https://college-fde10-default-rtdb.firebaseio.com/student_list.json`
//       );
//       const studentListData = await studentListResponse.json();

//       // Fetch attendance data for the selected date
//       const attendanceResponse = await fetch(
//         `https://college-fde10-default-rtdb.firebaseio.com/attendance/${year}/${month}/${date}.json`
//       );
//       const attendanceData = await attendanceResponse.json();

//       const combinedData = Object.keys(studentListData).map((studentId) => ({
//         id: studentId,
//         name: studentListData[studentId]?.name || `Student ${studentId}`,
//         status: attendanceData?.[studentId]?.status || 'N/A',
//       }));

//       setStudents(combinedData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudentData();
//   }, [year, month, date]);

//   const updateStatus = async (studentId, newStatus) => {
//     if (!userLocation) {
//       Swal.fire({
//         title: 'Error',
//         text: 'Unable to determine your location. Please try again later.',
//         icon: 'error',
//         confirmButtonText: 'OK',
//       });
//       return;
//     }

//     const distance = calculateDistance(
//       userLocation.latitude,
//       userLocation.longitude,
//       targetLocation.latitude,
//       targetLocation.longitude
//     );

//     if (distance > maxDistance) {
//       Swal.fire({
//         title: 'Too Far to Mark Attendance',
//         text: `You are ${Math.round(distance)} meters away from the target location. Attendance can only be marked within ${maxDistance} meters.`,
//         icon: 'warning',
//         confirmButtonText: 'OK',
//       });
//       return;
//     }

//     try {
//       const url = `https://college-fde10-default-rtdb.firebaseio.com/attendance/${year}/${month}/${date}/${studentId}.json`;
//       const response = await fetch(url, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (response.ok) {
//         // Update the local state
//         setStudents((prevStudents) =>
//           prevStudents.map((student) =>
//             student.id === studentId ? { ...student, status: newStatus } : student
//           )
//         );
//       } else {
//         console.error('Failed to update status');
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//     }
//   };

//   const exportToExcel = () => {
//     const formattedData = students.map((student, index) => ({
//       SrNo: index + 1, // Add serial number here
//       Name: student.name,
//       Status: student.status,
//       Year: year,
//       Month: month,
//       Date: date,
//     }));

//     const ws = XLSX.utils.json_to_sheet(formattedData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
//     XLSX.writeFile(wb, `Attendance_${year}-${month}-${date}.xlsx`);
//   };

//   const getButtonStyle = (status) => {
//     switch (status) {
//       case 'Present':
//         return { backgroundColor: 'green', color: '#fff' };
//       case 'Absent':
//         return { backgroundColor: 'red', color: '#fff' };
//       default:
//         return { backgroundColor: 'grey', color: '#fff' };
//     }
//   };

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#3f51b5' }}>Attendance</h2>

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

//         <FormControl style={{ marginRight: '10px', width: '30%' }}>
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

//         <FormControl style={{ width: '30%' }}>
//           <InputLabel>Date</InputLabel>
//           <Select value={date} onChange={(e) => setDate(e.target.value)}>
//             <MenuItem value="">Date</MenuItem>
//             {month &&
//               Array.from({ length: new Date(year, months.indexOf(month) + 1, 0).getDate() }, (_, i) => i + 1)
//                 .filter((d) => new Date(year, months.indexOf(month), d).getDay() !== 0) // Exclude Sundays
//                 .map((d) => (
//                   <MenuItem key={d} value={d}>
//                     {d}
//                   </MenuItem>
//                 ))}
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
//                 <th style={{ padding: '8px', border: '1px solid #ddd' }}>Sr. No.</th> {/* Add Sr. No. column */}
//                 <th style={{ padding: '8px', border: '1px solid #ddd' }}>Student Name</th>
//                 <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
//                 <th style={{ padding: '8px', border: '1px solid #ddd' }}>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((student, index) => (
//                 <tr key={student.id}>
//                   <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td> {/* Display serial number */}
//                   <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.name}</td>
//                   <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.status}</td>
//                   <td style={{ padding: '8px', border: '1px solid #ddd' }}>
//                     <Button
//                       variant="contained"
//                       style={getButtonStyle(student.status)}
//                       onClick={() =>
//                         updateStatus(
//                           student.id,
//                           student.status === 'Present' ? 'Absent' : 'Present'
//                         )
//                       }
//                     >
//                       {student.status === 'Present' ? 'Present ' : 'Absent'}
//                     </Button>
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

// export default Attendance;




// // import React, { useState, useEffect } from "react";
// // import Swal from "sweetalert2";
// // import {
// //   CircularProgress,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableRow,
// // } from "@mui/material";
// // import "../styles/Attendance.css";

// // const StudentDetails = () => {
// //   const [studentDetails, setStudentDetails] = useState(null);
// //   const [attendanceData, setAttendanceData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
// //   const [month, setMonth] = useState(""); // Default to no month selected

// //   const months = [
// //     "January",
// //     "February",
// //     "March",
// //     "April",
// //     "May",
// //     "June",
// //     "July",
// //     "August",
// //     "September",
// //     "October",
// //     "November",
// //     "December",
// //   ];

// //   // Function to get the number of days in a month
// //   const getDaysInMonth = (month, year) => {
// //     // Month is 0-indexed, so subtract 1 from the month number
// //     return new Date(year, month, 0).getDate();
// //   };

// //   // Fetch student details
// //   const fetchStudentDetails = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await fetch(
// //         "https://college-fde10-default-rtdb.firebaseio.com/student_list/-OFg7ivkOKVsAzxEEQP7.json"
// //       );

// //       if (!response.ok) {
// //         throw new Error("Failed to fetch data.");
// //       }

// //       const data = await response.json();

// //       if (data) {
// //         setStudentDetails(data);
// //       } else {
// //         Swal.fire({
// //           title: "Error",
// //           text: "No data found for the student.",
// //           icon: "error",
// //           confirmButtonText: "OK",
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Error fetching student details:", error);
// //       Swal.fire({
// //         title: "Error",
// //         text: "Failed to fetch student details.",
// //         icon: "error",
// //         confirmButtonText: "OK",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Fetch attendance status for each date (1-31) for the selected month and year
// //   const fetchAttendanceData = async () => {
// //     if (month && year) {
// //       setLoading(true);
// //       try {
// //         let statusData = [];
// //         const daysInMonth = getDaysInMonth(months.indexOf(month) + 1, year); // Get the number of days in the selected month

// //         for (let date = 1; date <= daysInMonth; date++) {
// //           // Check if the date is a Sunday (0 = Sunday)
// //           const dateObj = new Date(`${month} ${date}, ${year}`);
// //           const dayOfWeek = dateObj.getDay(); // Get day of the week (0-6, Sunday = 0)

// //           if (dayOfWeek === 0) {
// //             // Skip Sundays
// //             continue;
// //           }

// //           const response = await fetch(
// //             `https://college-fde10-default-rtdb.firebaseio.com/attendance/${year}/${month}/${date}/-OFg7ivkOKVsAzxEEQP7/status.json`
// //           );

// //           if (!response.ok) {
// //             throw new Error(`Failed to fetch attendance for date ${date}.`);
// //           }

// //           const data = await response.json();

// //           if (data) {
// //             statusData.push({ date, status: data });
// //           } else {
// //             statusData.push({ date, status: "No data" });
// //           }
// //         }

// //         setAttendanceData(statusData);
// //       } catch (error) {
// //         console.error("Error fetching attendance data:", error);
// //         Swal.fire({
// //           title: "Error",
// //           text: "Failed to fetch attendance data.",
// //           icon: "error",
// //           confirmButtonText: "OK",
// //         });
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //   };

// //   useEffect(() => {
// //     fetchStudentDetails();
// //   }, []);

// //   useEffect(() => {
// //     if (month && year) {
// //       fetchAttendanceData();
// //     }
// //   }, [month, year]);

// //   return (
// //     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
// //       <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#3f51b5" }}>
// //         Student Details
// //       </h2>

// //       {loading ? (
// //         <div style={{ textAlign: "center" }}>
// //           <CircularProgress />
// //         </div>
// //       ) : studentDetails ? (
// //         <div style={{ margin: "0 auto", maxWidth: "600px", textAlign: "left" }}>
// //           <p>
// //             <strong>Name:</strong> {studentDetails.name}
// //           </p>
// //           <p>
// //             <strong>Father's Name:</strong> {studentDetails.fathername}
// //           </p>
// //           <p>
// //             <strong>Mother's Name:</strong> {studentDetails.mothername || "N/A"}
// //           </p>
// //           <p>
// //             <strong>Roll No:</strong> {studentDetails.rollNo}
// //           </p>
// //           <p>
// //             <strong>Enrollment No:</strong> {studentDetails.en}
// //           </p>
// //           <p>
// //             <strong>WRN:</strong> {studentDetails.wrn || "N/A"}
// //           </p>
// //           <p>
// //             <strong>Gender:</strong> {studentDetails.gender}
// //           </p>
// //           <p>
// //             <strong>Mobile No:</strong> {studentDetails.mobile}
// //           </p>
// //           <p>
// //             <strong>Address:</strong> {studentDetails.address}
// //           </p>
// //         </div>
// //       ) : (
// //         <p style={{ textAlign: "center" }}>No student details available.</p>
// //       )}

// //       {/* Dropdowns for Year and Month */}
// //       <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px", marginTop: "20px" }}>
// //         <FormControl style={{ minWidth: 150 }}>
// //           <InputLabel>Year</InputLabel>
// //           <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
// //             {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
// //               <MenuItem key={y} value={y}>
// //                 {y}
// //               </MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl>

// //         <FormControl style={{ minWidth: 150 }}>
// //           <InputLabel>Month</InputLabel>
// //           <Select value={month} onChange={(e) => setMonth(e.target.value)}>
// //             <MenuItem value="">None</MenuItem>
// //             {months.map((m, index) => (
// //               <MenuItem key={index} value={m}>
// //                 {m}
// //               </MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl>
// //       </div>

// //       {/* Display Attendance in Table Format */}
// //       {attendanceData.length > 0 && (
// //         <Table style={{ marginTop: "30px", width: "100%" }}>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>Date</TableCell>
// //               <TableCell>Status</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {attendanceData.map((attendance, index) => (
// //               <TableRow key={index}>
// //                 <TableCell>{attendance.date}</TableCell>
// //                 <TableCell>{attendance.status}</TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       )}
// //     </div>
// //   );
// // };

// // export default StudentDetails;




// src/pages/attendance.jsx
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; // Import the XLSX library
import Swal from 'sweetalert2';
import '../styles/Attendance.css';
import { Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material'; // Import MUI components

function getTargetLocation() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('chrome')) {
    return {
      latitude:  27.1766701,
      longitude: 78.0080745
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
const maxDistance = 5000; // in meters (50 meters)

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

  const updateStatus = async (studentId, newStatus, studentName) => {
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
        body: JSON.stringify({ 
          status: newStatus,
          name: studentName // Save the student's name along with the status
        }),
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
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Sr. No.</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.name}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.status}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <Button
                      style={getButtonStyle(student.status)}
                      onClick={() =>
                        updateStatus(
                          student.id,
                          student.status === 'Present' ? 'Absent' : 'Present',
                          student.name
                        )
                      }
                    >
                      {student.status === 'Present' ? 'Mark Absent' : 'Mark Present'}
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

