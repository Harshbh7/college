// src/components/DashboardCards.jsx
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Book, Class, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios via `npm install axios`

const DashboardCards = () => {
  const [studentCount, setStudentCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch student data from the API
    const fetchStudentCount = async () => {
      try {
        const response = await axios.get(
          'https://college-fde10-default-rtdb.firebaseio.com/student_list.json'
        );
        const data = response.data;
        if (data) {
          setStudentCount(Object.keys(data).length); // Count the number of students
        }
      } catch (error) {
        console.error('Error fetching student count:', error);
      }
    };

    fetchStudentCount();
  }, []);

  const cards = [
    { label: 'Courses', count: 6, icon: <Book />, path: '/courses' },
    { label: 'Classes', count: 6, icon: <Class />, path: '/classes' },
    { label: 'Students', count: studentCount, icon: <People />, path: '/students' }, // Use dynamic student count
  ];

  const handleCardClick = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Paper
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              cursor: 'pointer', // Make the card appear clickable
              '&:hover': {
                boxShadow: 3, // Add hover effect for better UX
              },
            }}
            onClick={() => handleCardClick(card.path)} // Navigate on click
          >
            <Box sx={{ mr: 2 }}>{card.icon}</Box>
            <Box>
              <Typography variant="h6">{card.count}</Typography>
              <Typography variant="body2">{card.label}</Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
