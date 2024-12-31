// src/components/Calendar.jsx
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Modal,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

// Helper function to get the month's dates
const getMonthDates = (year, month) => {
  const startOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = startOfMonth.getDay();

  const dates = Array.from({ length: daysInMonth }).map((_, index) => {
    const date = new Date(startOfMonth);
    date.setDate(startOfMonth.getDate() + index);
    return {
      date,
      weekday: date.getDay(),
    };
  });

  return { dates, firstDayOfWeek };
};

const Calendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);

  const API_KEY = "AIzaSyDv__yjGrbW9IoA4bh3ieTbbuyGgwxUhZo";
  const CALENDAR_ID = "en.indian#holiday@group.v.calendar.google.com";

  // Fetch holidays from Google Calendar API
  useEffect(() => {
    const fetchHolidays = async () => {
      const startDate = new Date(selectedYear, selectedMonth, 1).toISOString();
      const endDate = new Date(selectedYear, selectedMonth + 1, 0).toISOString();

      const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${startDate}&timeMax=${endDate}&singleEvents=true&orderBy=startTime`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const holidayEvents = data.items.map((event) => ({
          title: event.summary,
          date: new Date(event.start.date),
        }));
        setHolidays(holidayEvents);
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      }
    };

    fetchHolidays();
  }, [selectedMonth, selectedYear]);

  const { dates, firstDayOfWeek } = getMonthDates(selectedYear, selectedMonth);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setOpen(true);
  };

  const isHoliday = (date) => {
    return holidays.some(
      (holiday) => holiday.date.toDateString() === date.toDateString()
    );
  };

  const handleClose = () => setOpen(false);

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" mb={2}>
        Calendar
      </Typography>

      {/* Month and Year Selectors */}
      <Box sx={{ display: 'flex', marginBottom: 2 }}>
        <FormControl sx={{ marginRight: 2 }} size="small">
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            label="Month"
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <MenuItem key={index} value={index}>
                {new Date(0, index).toLocaleString('en-US', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            label="Year"
          >
            {Array.from({ length: 10 }, (_, i) => 2020 + i).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <IconButton onClick={() => setSelectedMonth(selectedMonth - 1)}>
          <ArrowBack />
        </IconButton>
        <IconButton onClick={() => setSelectedMonth(selectedMonth + 1)}>
          <ArrowForward />
        </IconButton>
      </Box>

      {/* Days of the Week Header */}
      <Grid container spacing={1}>
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
          <Grid
            item
            xs
            key={index}
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: day === 'Sunday' ? 'red' : 'inherit',
            }}
          >
            {day}
          </Grid>
        ))}
      </Grid>

      {/* Calendar Dates */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {/* Empty cells before the first day */}
        {Array.from({ length: firstDayOfWeek }).map((_, index) => (
          <Box key={index} sx={{ border: '1px solid #ddd', minHeight: 80 }} />
        ))}

        {/* Calendar Dates */}
        {dates.map(({ date, weekday }, index) => {
          const isToday = date.toDateString() === new Date().toDateString(); // Check if it's today
          return (
            <Box
              key={index}
              onClick={() => handleDateClick(date)}
              sx={{
                border: '1px solid #dddd',
                minHeight: 80,
                minWidth: 100,
                bgcolor: isToday
                  ? '#E3F2FD' // Highlight for today
                  : weekday === 0 || isHoliday(date)
                    ? '#FFEBEE'
                    : '#FFF',
                color: isToday
                  ? 'blue' // Text color for today
                  : weekday === 0 || isHoliday(date)
                    ? 'red'
                    : 'inherit',
                textAlign: 'center',
                cursor: 'pointer',
                padding: 1,
                fontWeight: isToday ? 'bold' : 'inherit', // Bold text for today
              }}
            >
              <Typography variant="body1">{date.getDate()}</Typography>
              {isHoliday(date) && (
                <Typography variant="caption" sx={{ color: 'red' }}>
                  Holiday
                </Typography>
              )}
            </Box>
          );
        })}

      </Box>

      {/* Modal for Selected Date */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            padding: 4,
            borderRadius: 1,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6">
            {selectedDate
              ? `Details for ${selectedDate.toLocaleDateString()}`
              : 'No Date Selected'}
          </Typography>
          {isHoliday(selectedDate) ? (
            holidays
              .filter(
                (holiday) =>
                  holiday.date.toDateString() === selectedDate.toDateString()
              )
              .map((holiday, index) => (
                <Typography key={index} sx={{ marginTop: 2 }}>
                  {holiday.title}
                </Typography>
              ))
          ) : (
            <Typography sx={{ marginTop: 2 }}>No events on this day.</Typography>
          )}
        </Box>
      </Modal>
    </Paper>
  );
};

export default Calendar;
