// // src/App.jsx
// import React, { useState, useEffect, Suspense, lazy } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Box, CssBaseline } from '@mui/material';
// import Header from './components/Header';
// import DashboardCards from './components/DashboardCards';
// import WeeklySchedule from './components/WeeklySchedule';
// import Calendar from './components/Calendar';
// import UpcomingEvents from './components/UpcomingEvents';
// import Signup from './pages/Signup';
// import Login from './pages/Login';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './firebaseConfig';
// import Sidebar from './components/Sidebar';
// import ProfilePage from './pages/ProfilePage';

// // Lazy-loaded components
// const Attendance = lazy(() => import('./pages/Attendance'));
// const StuAttendance = lazy(() => import('./pages/StuAttendance'));
// const Courses = lazy(() => import('./pages/Courses'));
// const Exams = lazy(() => import('./pages/Exams'));
// const Students = lazy(() => import('./pages/Students'));
// const Student1 = lazy(() => import('./pages/Student1'));
// const Chat = lazy(() => import('./pages/Chat'));

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setIsAuthenticated(true);
//         const userRole = user?.email === 'harshbh8112@gmail.com' ? 'admin' : 'student';
//         setRole(userRole);
//       } else {
//         setIsAuthenticated(false);
//         setRole(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   return (
//     <Router>
//       <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
//         <CssBaseline />
//         {isAuthenticated && <Sidebar role={role} />}
//         <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//           {isAuthenticated && <Header onLogout={handleLogout} />}
//           <Box
//             sx={{
//               flexGrow: 1,
//               bgcolor: '#F5F5F5',
//               overflow: 'auto',
//               p: isAuthenticated ? 3 : 0,
//               mt: isAuthenticated ? '64px' : 0,
//             }}
//           >
//             <Suspense fallback={<div>Loading...</div>}>
//               <Routes>
//                 {isAuthenticated ? (
//                   <>
//                     {role === 'admin' ? (
//                       <>
//                         <Route
//                           path="/"
//                           element={
//                             <>
//                               <DashboardCards />
//                               <WeeklySchedule />
//                               <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
//                                 <Calendar />
//                                 <UpcomingEvents />
//                               </Box>
//                             </>
//                           }
//                         />
//                         <Route path="/courses" element={<Courses />} />
//                         <Route path="/exams" element={<Exams />} />
//                         <Route path="/students" element={<Students />} />
//                         <Route path="/attendance" element={<Attendance />} />
//                         <Route path="/chat" element={<Chat />} />
//                       </>
//                     ) : (
//                       <>
//                         <Route
//                           path="/"
//                           element={
//                             <>
//                               <DashboardCards />
//                               <WeeklySchedule />
//                               <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
//                                 <Calendar />
//                                 <UpcomingEvents />
//                               </Box>
//                             </>
//                           }
//                         />
//                         <Route path="/courses" element={<Courses />} />
//                         <Route path="/exams" element={<Exams />} />
//                         <Route path="/student1" element={<Student1 />} />
//                         {/* <Route path="/attendance" element={<Attendance />} /> */}
//                         <Route path="/stuattendance" element={<StuAttendance />} />
//                         <Route path="/chat" element={<Chat />} />
//                       </>
//                     )}
//                     <Route path="/profile" element={<ProfilePage />} />
//                     <Route path="*" element={<Navigate to="/" />} />
//                   </>
//                 ) : (
//                   <>
//                     <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
//                     <Route path="/signup" element={<Signup />} />
//                     <Route path="*" element={<Navigate to="/login" />} />
//                   </>
//                 )}
//               </Routes>
//             </Suspense>
//           </Box>
//         </Box>
//       </Box>
//     </Router>
//   );
// };

// export default App;


// Frontened/src/App.jsx
import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, database } from "./firebaseConfig";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/ProfilePage";
import DashboardCards from "./components/DashboardCards";
import WeeklySchedule from "./components/WeeklySchedule";
import Calendar from "./components/Calendar";
import UpcomingEvents from "./components/UpcomingEvents";
import theme from "./theme";

// Lazy-loaded components
const Attendance = lazy(() => import("./pages/Attendance"));
const StuAttendance = lazy(() => import("./pages/StuAttendance"));
const Courses = lazy(() => import("./pages/Courses"));
const Exams = lazy(() => import("./pages/Exams"));
const Students = lazy(() => import("./pages/Students"));
const Student1 = lazy(() => import("./pages/Student1"));
const Chat = lazy(() => import("./pages/Chat"));
// const Chat = lazy(() => import("./components/Chat"));

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [students, setStudents] = useState([]);

  // Fetch students from database
  useEffect(() => {
    const studentsRef = ref(database, "student_list");
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentsArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setStudents(studentsArray);
      }
    });
  }, []);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        const userRole = user.email === "harshbh8112@gmail.com" ? "admin" : "student";
        setRole(userRole);
      } else {
        setIsAuthenticated(false);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
          <CssBaseline />
          {isAuthenticated && <Sidebar role={role} />}
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            {isAuthenticated && <Header onLogout={handleLogout} />}
            <Box
              sx={{
                flexGrow: 1,
                bgcolor: "#F5F5F5",
                overflow: "auto",
                p: isAuthenticated ? 3 : 0,
                mt: isAuthenticated ? "64px" : 0,
              }}
            >
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  {isAuthenticated ? (
                    <>
                      {role === "admin" ? (
                        <>
                          <Route
                            path="/"
                            element={
                              <>
                                <DashboardCards />
                                <WeeklySchedule />
                                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                                  <Calendar />
                                  <UpcomingEvents />
                                </Box>
                              </>
                            }
                          />
                          <Route path="/courses" element={<Courses />} />
                          <Route path="/exams" element={<Exams />} />
                          <Route path="/students" element={<Students />} />
                          <Route path="/attendance" element={<Attendance />} />
                          <Route path="/chat" element={<Chat students={students} />} />
                        </>
                      ) : (
                        <>
                          <Route
                            path="/"
                            element={
                              <>
                                <DashboardCards />
                                <WeeklySchedule />
                                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                                  <Calendar />
                                  <UpcomingEvents />
                                </Box>
                              </>
                            }
                          />
                          <Route path="/courses" element={<Courses />} />
                          <Route path="/exams" element={<Exams />} />
                          <Route path="/student1" element={<Student1 />} />
                          <Route path="/stuattendance" element={<StuAttendance />} />
                          <Route path="/chat" element={<Chat students={students} />} />
                        </>
                      )}
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </>
                  ) : (
                    <>
                      <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="*" element={<Navigate to="/login" />} />
                    </>
                  )}
                </Routes>
              </Suspense>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
