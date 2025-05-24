// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { 
  Box, Typography, List, ListItem, ListItemButton, ListItemText, IconButton, Drawer, useMediaQuery, Divider 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)');

  const menuItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'Courses', path: role === 'admin' ? '/coursesAdmin' : '/courses', icon: <BookIcon /> },
    { text: 'Exams', path: '/exams', icon: <AssignmentIcon /> },
    { text: 'Students', path: role === 'admin' ? '/students' : '/student1', icon: <PeopleIcon /> },
    { text: 'Attendance', path: role === 'admin' ? '/attendance' : '/stuAttendance', icon: <EventIcon /> },
    { text: 'Chat', path: '/chat', icon: <ChatIcon /> },
  ];

  return (
    <>
      {isMobile && !isDrawerOpen && (
        <IconButton
          edge="start"
          aria-label="menu"
          onClick={() => setIsDrawerOpen(true)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1201,
            color: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            flexShrink: 0,
            bgcolor: '#1976D2',
            color: '#fff',
            boxShadow: '2px 0 15px rgba(0,0,0,0.3)',
            borderRadius: '0 10px 10px 0',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold" sx={{ letterSpacing: 1 }}>
            Dashboard
          </Typography>
          <IconButton onClick={() => setIsDrawerOpen(false)} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.4)', mb: 2 }} />
        <List sx={{ width: '100%' }}>
          {menuItems.map((item) => (
            <ListItem disablePadding key={item.text} sx={{ width: '100%' }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  margin: '4px 10px',
                  '&.Mui-selected': {
                    bgcolor: '#1565C0',
                    color: '#FFFFFF',
                    borderLeft: '4px solid #fff',
                  },
                  '&:hover': {
                    bgcolor: '#1E88E5',
                    transform: 'scale(1.05)',
                    transition: '0.2s ease-in-out',
                  },
                }}
                onClick={() => setIsDrawerOpen(false)}
              >
                {item.icon}
                <ListItemText primary={item.text} sx={{ textAlign: 'center', ml: 1 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {!isMobile && (
        <Box
          sx={{
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            flexShrink: 0,
            height: '100vh',
            bgcolor: '#1976D2',
            color: '#fff',
            p: 3,
            boxShadow: '2px 0 15px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, letterSpacing: 1 }}>
            Dashboard
          </Typography>
          <Divider sx={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.4)', mb: 2 }} />
          <List sx={{ width: '100%' }}>
            {menuItems.map((item) => (
              <ListItem disablePadding key={item.text} sx={{ width: '100%' }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    width: '100%',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    margin: '4px 10px',
                    '&.Mui-selected': {
                      bgcolor: '#1565C0',
                      color: '#FFFFFF',
                      borderLeft: '4px solid #fff',
                    },
                    '&:hover': {
                      bgcolor: '#1E88E5',
                      transform: 'scale(1.05)',
                      transition: '0.2s ease-in-out',
                    },
                  }}
                >
                  {item.icon}
                  <ListItemText primary={item.text} sx={{ textAlign: 'center', ml: 1 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </>
  );
};

export default Sidebar;
