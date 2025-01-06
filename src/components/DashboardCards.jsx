// src/components/DashboardCards.jsx
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Book, Class, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardCards = ({ role }) => {
  const [studentCount, setStudentCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await axios.get(
          'https://college-fde10-default-rtdb.firebaseio.com/student_list.json'
        );
        const data = response.data;
        if (data) {
          setStudentCount(Object.keys(data).length);
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
    {
      label: 'Students',
      count: studentCount,
      icon: <People />,
      path: role === 'admin' ? '/student1' : '/students', // Adjust path based on role
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
      {cards.map((card, index) => (
        <Grid
          item
          xs={12} // 100% width on small screens
          sm={6}  // 50% width on small/medium screens
          md={4}  // 33% width on medium/large screens
          key={index}
        >
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              p: 2,
              cursor: 'pointer',
              borderRadius: '8px',
              '&:hover': {
                boxShadow: 3,
              },
            }}
            onClick={() => handleCardClick(card.path)}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#1976D2',
                borderRadius: '50%',
                p: 2,
                mr: 2,
                minWidth: '50px',
                minHeight: '50px',
              }}
            >
              {card.icon}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {card.count}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                {card.label}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;

