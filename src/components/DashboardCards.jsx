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
    console.log("User Role:", role);
  }, [role]);
  
 

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await axios.get(
          `https://college-fde10-default-rtdb.firebaseio.com/student_list.json`
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
    { label: 'Courses', count: 6, icon: <Book fontSize="large" />, path: '/courses' },
    { label: 'Classes', count: 6, icon: <Class fontSize="large" />, path: '/classes' },
    {
      label: 'Students',
      count: studentCount,
      icon: <People fontSize="large" />,
      path: role?.toLowerCase() === 'admin' ? '/students' : '/student1',
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  

  return (
    <Grid 
      container 
      spacing={2} 
      sx={{ 
        justifyContent: 'center', 
        px: { xs: '1rem', sm: '2rem' },
        flexDirection: { xs: 'column', sm: 'row' } 
      }}
    >
      {cards.map((card, index) => (
        <Grid
          item
          xs={12} 
          sm={6}  
          md={4}  
          key={index}
        >
          <Paper
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: { xs: '1rem', sm: '1.5rem' }, 
              cursor: 'pointer',
              borderRadius: '0.5rem',
              boxShadow: 2,
              width: { 
                xs: 'calc(100vw - 4rem)',  // Full width minus padding for small screens
                sm: 'calc(50vw - 10rem)',   // Adjust width dynamically
                md: '20rem' 
              }, 
              maxWidth: '20rem', // Prevents excessive stretching
              height: { xs: '4rem', sm: '5rem', md: '6rem' },
              transition: 'transform 0.2s, box-shadow 0.3s',
              '&:hover': {
                boxShadow: { xs: 2, sm: 5 },
                transform: { sm: 'scale(1.05)' },
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
                color: 'white',
                borderRadius: '50%',
                p: { xs: '0.5rem', sm: '0.75rem' }, 
                mr: '0.75rem',
                minWidth: { xs: '2rem', sm: '3rem' },
                minHeight: { xs: '2rem', sm: '3rem' },
              }}
            >
              {card.icon}
            </Box>
            <Box sx={{ textAlign: 'left', flexGrow: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.2rem' } }}
              >
                {card.count}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ color: '#555', fontSize: { xs: '0.75rem', sm: '0.9rem' } }}
              >
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
