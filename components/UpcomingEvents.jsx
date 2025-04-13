// src/components/UpcomingEvents.jsx
import React from 'react';
import { Paper, List, ListItem, ListItemText, Typography } from '@mui/material';

const events = [
  { title: 'Network Security', time: '10:00 - 11:00', color: '#FF8A80' },
  { title: '.NET Visual Studio', time: '11:00 - 12:00', color: '#FFD180' },
  { title: 'Computer Graphics', time: '12:00 - 01:00', color: '#80D8FF' },
  { title: 'Lunch', time: '12:00 - 01:00', color: '#FFD180' },
  { title: 'System Analysis & Design', time: '01:00 - 02:00', color: '#CCFF90' },
  { title: 'System Design & Algorithm', time: '02:00 - 03:00', color: '#FF8A80' },
  { title: 'Lab Practicle', time: '03:00 - 04:00', color: '#80D8FF' },
];

const UpcomingEvents = () => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" mb={2}>
      Courses Time-Table
    </Typography>
    <List>
      {events.map((event, index) => (
        <ListItem key={index} sx={{ borderLeft: `5px solid ${event.color}`, pl: 2 }}>
          <ListItemText primary={event.title} secondary={event.time} />
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default UpcomingEvents;
