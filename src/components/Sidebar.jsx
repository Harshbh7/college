// src/components/Sidebar.jsx
import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', path: '/' },
    { text: 'Courses', path: '/courses' },
    { text: 'Exams', path: '/exams' },
    { text: 'Students', path: role === 'admin' ? '/students' : '/student1' }, // Role-based path
    { text: 'Attendance', path: '/attendance', visible: role === 'admin' }, // Show only if admin
    { text: 'Chat', path: '/chat' },
  ];

  return (
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
        {menuItems.map(
          (item) =>
            item.visible !== false && ( // Check if item should be visible
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
            )
        )}
      </List>
    </Box>
  );
};

export default Sidebar;
