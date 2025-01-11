// //src/pages/StuAttendance
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
//   Button,
// } from "@mui/material";
// import "../styles/Attendance.css";

// const StuAttendance = () => {
//   const [studentDetails, setStudentDetails] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState("");
//   const [statusUpdated, setStatusUpdated] = useState(false);

//   const allowedLocation = { latitude: 27.1407174, longitude: 78.0309542 }; // Allowed location (latitude, longitude)
//   const distanceThreshold = 50; // in meters

//   const months = [
//     "January", "February", "March", "April", "May", "June", "July", "August",
//     "September", "October", "November", "December",
//   ];

//   const todayDate = new Date().getDate();
//   const todayMonth = new Date().getMonth();
//   const todayYear = new Date().getFullYear();

//   const getDaysInMonth = (month, year) => {
//     return new Date(year, month, 0).getDate();
//   };

//   const fetchStudentDetails = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "https://college-fde10-default-rtdb.firebaseio.com/student_list/2odTWwKeZHWeo3CmLQtFjAb1AEV2.json"
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

//   const fetchAttendanceData = async () => {
//     if (month && year) {
//       setLoading(true);
//       try {
//         let statusData = [];
//         const daysInMonth = getDaysInMonth(months.indexOf(month) + 1, year);

//         for (let date = 1; date <= daysInMonth; date++) {
//           const dateObj = new Date(`${month} ${date}, ${year}`);
//           const dayOfWeek = dateObj.getDay();

//           if (dayOfWeek === 0) {
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

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of Earth in km
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c * 1000; // Distance in meters
//     return distance;
//   };

//   const checkLocationAndUpdateStatus = async (status, date) => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           const distance = calculateDistance(
//             latitude,
//             longitude,
//             allowedLocation.latitude,
//             allowedLocation.longitude
//           );

//           if (distance <= distanceThreshold) {
//             await updateStatus(status, date);
//           } else {
//             Swal.fire({
//               title: "Location Error",
//               text: "You are not within the allowed range to mark attendance.",
//               icon: "error",
//               confirmButtonText: "OK",
//             });
//           }
//         },
//         (error) => {
//           Swal.fire({
//             title: "Geolocation Error",
//             text: "Unable to retrieve your location.",
//             icon: "error",
//             confirmButtonText: "OK",
//           });
//         }
//       );
//     } else {
//       Swal.fire({
//         title: "Geolocation Error",
//         text: "Geolocation is not supported by your browser.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   const updateStatus = async (status, date) => {
//     setLoading(true);
//     try {
//       setAttendanceData((prevData) =>
//         prevData.map((attendance) =>
//           attendance.date === date ? { ...attendance, status } : attendance
//         )
//       );

//       const response = await fetch(
//         `https://college-fde10-default-rtdb.firebaseio.com/attendance/${todayYear}/${months[todayMonth]}/${date}/-OFg7ivkOKVsAzxEEQP7/status.json`,
//         {
//           method: "PUT",
//           body: JSON.stringify(status),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update status.");
//       }

//       Swal.fire({
//         title: "Success",
//         text: `Attendance status for ${status} updated successfully!`,
//         icon: "success",
//         confirmButtonText: "OK",
//       });

//       setStatusUpdated(true);
//       fetchAttendanceData();
//     } catch (error) {
//       console.error("Error updating status:", error);
//       Swal.fire({
//         title: "Error",
//         text: "Failed to update status.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     } finally {
//       setLoading(false);
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
//           <p><strong>Name:</strong> {studentDetails.name}</p>
//           <p><strong>Father's Name:</strong> {studentDetails.fathername}</p>
//           <p><strong>Mother's Name:</strong> {studentDetails.mothername || "N/A"}</p>
//           <p><strong>Roll No:</strong> {studentDetails.rollNo}</p>
//           <p><strong>Enrollment No:</strong> {studentDetails.en}</p>
//           <p><strong>WRN:</strong> {studentDetails.wrn || "N/A"}</p>
//           <p><strong>Gender:</strong> {studentDetails.gender}</p>
//           <p><strong>Mobile No:</strong> {studentDetails.mobile}</p>
//           <p><strong>Address:</strong> {studentDetails.address}</p>
//         </div>
//       ) : (
//         <p style={{ textAlign: "center" }}>No student details available.</p>
//       )}

//       {/* Year and Month Dropdowns */}
//       <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px", marginTop: "20px" }}>
//         <FormControl style={{ minWidth: 150 }}>
//           <InputLabel>Year</InputLabel>
//           <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
//             {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
//               <MenuItem key={y} value={y}>{y}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <FormControl style={{ minWidth: 150 }}>
//           <InputLabel>Month</InputLabel>
//           <Select value={month} onChange={(e) => setMonth(e.target.value)}>
//             <MenuItem value="">None</MenuItem>
//             {months.map((m, index) => (
//               <MenuItem key={index} value={m}>{m}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </div>

//       {/* Attendance Table */}
//       {attendanceData.length > 0 && (
//         <Table style={{ marginTop: "30px", width: "100%" }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {attendanceData.map((attendance, index) => (
//               <TableRow key={index}>
//                 <TableCell>{attendance.date}</TableCell>
//                 <TableCell>{attendance.status}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => checkLocationAndUpdateStatus("Present", attendance.date)}
//                     style={{ marginRight: "10px" }}
//                     disabled={month !== months[todayMonth] || attendance.date !== todayDate}
//                   >
//                     Present
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={() => checkLocationAndUpdateStatus("Absent", attendance.date)}
//                     disabled={month !== months[todayMonth] || attendance.date !== todayDate}
//                   >
//                     Absent
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default StuAttendance;


// // src/pages/StuAttendance.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  CircularProgress,
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
} from "@mui/material";
import { auth } from "../firebaseConfig";  // Assuming Firebase is used for authentication
import "../styles/Attendance.css";

const StuAttendance = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const todayDate = new Date().getDate();
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const fetchStudentDetails = async (email) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://college-fde10-default-rtdb.firebaseio.com/student_list.json"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch student details.");
      }

      const data = await response.json();
      const matchedStudent = Object.values(data).find(
        (student) => student.email === email
      );

      if (matchedStudent) {
        setStudentDetails(matchedStudent);
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
      Swal.fire({
        title: "Error",
        text: "Failed to fetch student details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    if (month && year) {
      setLoading(true);
      try {
        let statusData = [];
        const daysInMonth = getDaysInMonth(months.indexOf(month) + 1, year);

        for (let date = 1; date <= daysInMonth; date++) {
          const response = await fetch(
            `https://college-fde10-default-rtdb.firebaseio.com/attendance/${year}/${month}/${date}/status.json`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch attendance for date ${date}.`);
          }

          const data = await response.json();

          statusData.push({ date, status: data || "No data" });
        }

        setAttendanceData(statusData);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch attendance data.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const loggedInEmail = auth.currentUser?.email;  // Assuming Firebase auth is used
    if (loggedInEmail) {
      fetchStudentDetails(loggedInEmail); // Fetch student details based on logged-in email
    } else {
      Swal.fire({
        title: "Error",
        text: "No user logged in.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, []);

  useEffect(() => {
    if (month && year && studentDetails) {
      fetchAttendanceData();
    }
  }, [month, year, studentDetails]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#3f51b5" }}>
        Student Attendance
      </h2>

      {loading ? (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      ) : studentDetails ? (
        <>
          <div style={{ margin: "0 auto", maxWidth: "600px", textAlign: "left" }}>
            <p>
              <strong>Name:</strong> {studentDetails.name}
            </p>
            <p>
              <strong>Father's Name:</strong> {studentDetails.fathername}
            </p>
            <p>
              <strong>Roll No:</strong> {studentDetails.rollNo}
            </p>
            <p>
              <strong>Email:</strong> {studentDetails.email}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <FormControl style={{ minWidth: 150 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {Array.from({ length: 10 }, (_, i) =>
                  new Date().getFullYear() - i
                ).map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl style={{ minWidth: 150 }}>
              <InputLabel>Month</InputLabel>
              <Select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {months.map((m, index) => (
                  <MenuItem key={index} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {attendanceData.length > 0 && (
            <Table style={{ marginTop: "30px", width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((attendance, index) => (
                  <TableRow key={index}>
                    <TableCell>{attendance.date}</TableCell>
                    <TableCell>{attendance.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      ) : (
        <p style={{ textAlign: "center" }}>No details available.</p>
      )}
    </div>
  );
};

export default StuAttendance;


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
//   Button,
// } from "@mui/material";
// import { auth } from "../firebaseConfig"; // Assuming Firebase is used for authentication
// import "../styles/Attendance.css";

// const StuAttendance = () => {
//   const [studentDetails, setStudentDetails] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState("");
//   const [statusUpdated, setStatusUpdated] = useState(false);

//   const allowedLocation = { latitude: 27.1407174, longitude: 78.0309542 }; // Allowed location (latitude, longitude)
//   const distanceThreshold = 50; // in meters

//   const months = [
//     "January", "February", "March", "April", "May", "June", "July", "August",
//     "September", "October", "November", "December",
//   ];

//   const todayDate = new Date().getDate();
//   const todayMonth = new Date().getMonth();
//   const todayYear = new Date().getFullYear();

//   const getDaysInMonth = (month, year) => {
//     return new Date(year, month, 0).getDate();
//   };

//   const fetchStudentDetails = async (email) => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "https://college-fde10-default-rtdb.firebaseio.com/student_list.json"
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch student details.");
//       }

//       const data = await response.json();
//       const matchedStudent = Object.values(data).find(
//         (student) => student.email === email
//       );

//       if (matchedStudent) {
//         setStudentDetails(matchedStudent);
//       } else {
//         Swal.fire({
//           title: "Error",
//           text: "No student found with this email ID.",
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

//   const fetchAttendanceData = async () => {
//     if (month && year) {
//       setLoading(true);
//       try {
//         let statusData = [];
//         const daysInMonth = getDaysInMonth(months.indexOf(month) + 1, year);

//         for (let date = 1; date <= daysInMonth; date++) {
//           const dateObj = new Date(`${month} ${date}, ${year}`);
//           const dayOfWeek = dateObj.getDay();

//           if (dayOfWeek === 0) {
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

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of Earth in km
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c * 1000; // Distance in meters
//     return distance;
//   };

//   const checkLocationAndUpdateStatus = async (status, date) => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           const distance = calculateDistance(
//             latitude,
//             longitude,
//             allowedLocation.latitude,
//             allowedLocation.longitude
//           );

//           if (distance <= distanceThreshold) {
//             await updateStatus(status, date);
//           } else {
//             Swal.fire({
//               title: "Location Error",
//               text: "You are not within the allowed range to mark attendance.",
//               icon: "error",
//               confirmButtonText: "OK",
//             });
//           }
//         },
//         (error) => {
//           Swal.fire({
//             title: "Geolocation Error",
//             text: "Unable to retrieve your location.",
//             icon: "error",
//             confirmButtonText: "OK",
//           });
//         }
//       );
//     } else {
//       Swal.fire({
//         title: "Geolocation Error",
//         text: "Geolocation is not supported by your browser.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   const updateStatus = async (status, date) => {
//     setLoading(true);
//     try {
//       setAttendanceData((prevData) =>
//         prevData.map((attendance) =>
//           attendance.date === date ? { ...attendance, status } : attendance
//         )
//       );

//       const response = await fetch(
//         `https://college-fde10-default-rtdb.firebaseio.com/attendance/${todayYear}/${months[todayMonth]}/${date}/-OFg7ivkOKVsAzxEEQP7/status.json`,
//         {
//           method: "PUT",
//           body: JSON.stringify(status),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update status.");
//       }

//       Swal.fire({
//         title: "Success",
//         text: `Attendance status for ${status} updated successfully!`,
//         icon: "success",
//         confirmButtonText: "OK",
//       });

//       setStatusUpdated(true);
//       fetchAttendanceData();
//     } catch (error) {
//       console.error("Error updating status:", error);
//       Swal.fire({
//         title: "Error",
//         text: "Failed to update status.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudentDetails("student@example.com"); // Replace with the email of the logged-in student
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
//           <p><strong>Name:</strong> {studentDetails.name}</p>
//           <p><strong>Father's Name:</strong> {studentDetails.fathername}</p>
//           <p><strong>Mother's Name:</strong> {studentDetails.mothername || "N/A"}</p>
//           <p><strong>Roll No:</strong> {studentDetails.rollNo}</p>
//           <p><strong>Enrollment No:</strong> {studentDetails.en}</p>
//           <p><strong>WRN:</strong> {studentDetails.wrn || "N/A"}</p>
//           <p><strong>Gender:</strong> {studentDetails.gender}</p>
//           <p><strong>Mobile No:</strong> {studentDetails.mobile}</p>
//           <p><strong>Address:</strong> {studentDetails.address}</p>
//         </div>
//       ) : (
//         <p style={{ textAlign: "center" }}>No student details available.</p>
//       )}

//       {/* Year and Month Dropdowns */}
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
//             {months.map((m) => (
//               <MenuItem key={m} value={m}>
//                 {m}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </div>

//       {/* Attendance Table */}
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Date</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Action</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {attendanceData.map((attendance) => (
//             <TableRow key={attendance.date}>
//               <TableCell>{attendance.date}</TableCell>
//               <TableCell>{attendance.status}</TableCell>
//               <TableCell>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => checkLocationAndUpdateStatus("Present", attendance.date)}
//                 >
//                   Mark Present
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={() => checkLocationAndUpdateStatus("Absent", attendance.date)}
//                   style={{ marginLeft: "10px" }}
//                 >
//                   Mark Absent
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {statusUpdated && (
//         <div style={{ textAlign: "center", marginTop: "30px" }}>
//           <Button
//             variant="outlined"
//             color="primary"
//             onClick={() => setStatusUpdated(false)}
//           >
//             Close
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StuAttendance;

