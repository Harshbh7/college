// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { 
  Box, Typography, List, ListItem, ListItemButton, ListItemText, IconButton, Drawer, useMediaQuery 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  // Detect if the screen width is less than 600px (mobile)
  const isMobile = useMediaQuery('(max-width:600px)');

  const menuItems = [
    { text: 'Dashboard', path: '/' },
    { text: 'Courses', path: '/courses' },
    { text: 'Exams', path: '/exams' },
    { text: 'Students', path: role === 'admin' ? '/students' : '/student1' },
    { text: 'Attendance', path: '/attendance' },
    { text: 'Chat', path: '/chat' },
  ];

  return (
    <>
      {/* Hamburger Icon for Mobile */}
{isMobile && !isDrawerOpen && (
  <IconButton
    edge="start"
    aria-label="menu"
    onClick={() => setIsDrawerOpen(true)}
    sx={{
      position: 'fixed',
      top: 16,
      left: 16,
      zIndex: 1201, // Ensures the button is above other content
      color: '#fff', // White color for the icon
    }}
  >
    <MenuIcon />
  </IconButton>
)}


      {/* Drawer for Sidebar */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            bgcolor: '#1976d2',
            color: '#fff',
            position: 'relative',
          },
        }}
      >
        {/* Close Icon */}
        <IconButton
          onClick={() => setIsDrawerOpen(false)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: '#fff',
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            p: 2,
            height: '100%',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Dashboard
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItem disablePadding key={item.text}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    '&.Mui-selected': {
                      bgcolor: '#1565C0',
                      color: '#FFFFFF',
                    },
                    '&:hover': {
                      bgcolor: '#1E88E5',
                    },
                  }}
                  onClick={() => setIsDrawerOpen(false)} // Close drawer on item click
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Permanent Sidebar for Desktop */}
      {!isMobile && (
        <Box
          sx={{
            width: 250,
            height: '100vh',
            bgcolor: '#1976d2',
            color: '#fff',
            p: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Dashboard
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItem disablePadding key={item.text}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    '&.Mui-selected': {
                      bgcolor: '#1565C0',
                      color: '#FFFFFF',
                    },
                    '&:hover': {
                      bgcolor: '#1E88E5',
                    },
                  }}
                >
                  <ListItemText primary={item.text} />
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
