import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Fab } from '@mui/material';
import Header from './components/Header';
import DashboardCards from './components/DashboardCards';
import WeeklySchedule from './components/WeeklySchedule';
import Calendar from './components/Calendar';
import UpcomingEvents from './components/UpcomingEvents';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Sidebar from './components/Sidebar';
import ProfilePage from './pages/ProfilePage';
import ACALogo from './assets/ACALogo.png';
import PersonIcon from '@mui/icons-material/Person';
import Chatbot from './components/Chatbot';

// Lazy-loaded components
const Attendance = lazy(() => import('./pages/Attendance'));
const StuAttendance = lazy(() => import('./pages/StuAttendance'));
const Courses = lazy(() => import('./pages/Courses'));
const Exams = lazy(() => import('./pages/Exams'));
const Students = lazy(() => import('./pages/Students'));
const Student1 = lazy(() => import('./pages/Student1'));
const Chat = lazy(() => import('./pages/Chat'));

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(splashTimeout);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        const userRole = user?.email === 'harshbh8112@gmail.com' ? 'admin' : 'student';
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
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
        <img src={ACALogo} alt="Loading..." style={{ width: 200, height: 200 }} />
      </Box>
    );
  }

  return (
    <Router>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />
        {isAuthenticated && <Sidebar role={role} />}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {isAuthenticated && <Header onLogout={handleLogout} />}
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: '#F5F5F5',
              overflow: 'auto',
              p: isAuthenticated ? 3 : 0,
              mt: isAuthenticated ? '64px' : 0,
            }}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {isAuthenticated ? (
                  <>
                    {role === 'admin' ? (
                      <>
                        <Route
                          path="/"
                          element={
                            <>
                              <DashboardCards role={role} />
                              <WeeklySchedule />
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: { xs: 'column', md: 'row' },
                                  gap: 2,
                                }}
                              >
                                <Calendar sx={{ flex: 1 }} />
                                <UpcomingEvents sx={{ flex: 1 }} />
                              </Box>
                            </>
                          }
                        />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/exams" element={<Exams />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/attendance" element={<Attendance />} />
                        <Route path="/chat" element={<Chat role={role} />} />
                      </>
                    ) : (
                      <>
                        <Route
                          path="/"
                          element={
                            <>
                              <DashboardCards role={role} />
                              <WeeklySchedule />
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: { xs: 'column', sm: 'row' },
                                  gap: 2,
                                  mt: 3,
                                }}
                              >
                                <Calendar sx={{ flex: 1 }} />
                                <UpcomingEvents sx={{ flex: 1 }} />
                              </Box>
                            </>
                          }
                        />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/exams" element={<Exams />} />
                        <Route path="/student1" element={<Student1 />} />
                        <Route path="/stuattendance" element={<StuAttendance />} />
                        <Route path="/chat" element={<Chat />} />
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

        {/* Floating Chatbot */}
        {isAuthenticated && (
          <>
            <Box
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 1500,
              }}
            >
              <Fab
                color="primary"
                aria-label="chat"
                onClick={() => setShowChatbot((prev) => !prev)}
              >
                <PersonIcon />
              </Fab>
            </Box>

            {showChatbot && (
  <Box
    sx={{
      position: 'fixed',
      bottom: 80,
      right: 16,
      width: {
        xs: '90vw',  // 320px - 600px
        sm: 350,     // 600px - 900px
        md: 400,     // 900px and up
      },
      height: {
        xs: '70vh',
        sm: 500,
      },
      bgcolor: 'white',
      boxShadow: 6,
      borderRadius: 2,
      zIndex: 1500,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Chatbot />
  </Box>
)}

          </>
        )}
      </Box>
    </Router>
  );
};

export default App;
