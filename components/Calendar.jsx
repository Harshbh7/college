// src/components/Calendar.jsx
import React, { useState, useEffect } from "react";
import {
  Paper, Typography, Box, Grid, Select, MenuItem, FormControl, InputLabel,
  IconButton, Modal, Card, CardContent, useMediaQuery, Button, TextField
} from "@mui/material";
import { ArrowBack, ArrowForward, Delete, Edit } from "@mui/icons-material";
import { getDatabase, ref, onValue, push, update, remove } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { isAdmin } from "../utils/auth";
import axios from "axios";

const getMonthDates = (year, month) => {
  const startOfMonth = new Date(year, month, 1);// src/components/Calendar.jsx

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = startOfMonth.getDay();
  const dates = Array.from({ length: daysInMonth }).map((_, index) => {
    const date = new Date(startOfMonth);
    date.setDate(startOfMonth.getDate() + index);
    return { date, weekday: date.getDay() };
  });
  return { dates, firstDayOfWeek };
};

const Calendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [open, setOpen] = useState(false);
  const [user] = useAuthState(auth);
  const isMobile = useMediaQuery("(max-width: 425px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const db = getDatabase();

  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [eventData, setEventData] = useState({ title: "", date: "", startTime: "", endTime: "" });
  const [editingKey, setEditingKey] = useState(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
        const CALENDAR_ID = "en.indian%23holiday@group.v.calendar.google.com";
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), 0, 1).toISOString();
        const endDate = new Date(currentDate.getFullYear(), 11, 31).toISOString();

        const response = await axios.get(
          `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
          {
            params: {
              key: API_KEY,
              timeMin: startDate,
              timeMax: endDate,
              orderBy: "startTime",
              singleEvents: true,
            },
          }
        );

        const holidaysData = response.data.items.map((event) => ({
          title: event.summary,
          date: new Date(event.start.dateTime || event.start.date).toISOString(),
        }));

        setHolidays(holidaysData);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };

    const fetchEventsFromFirebase = () => {
      const eventsRef = ref(db, "calendarEvents");
      onValue(eventsRef, (snapshot) => {
        const eventsData = snapshot.val();
        const eventsArray = eventsData
          ? Object.keys(eventsData).map((key) => ({
              ...eventsData[key],
              key,
            }))
          : [];
        setEvents(eventsArray);
      });
    };

    fetchHolidays();
    fetchEventsFromFirebase();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const found = [...holidays, ...events].find(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );
    setSelectedHoliday(found || null);
    setOpen(true);
  };

  const isHoliday = (date) =>
    [...holidays, ...events].some((event) => new Date(event.date).toDateString() === date.toDateString());

  const isSunday = (date) => date.getDay() === 0;

  const handleClose = () => setOpen(false);

  const handleMonthChange = (direction) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const handleAddOrEdit = () => {
    const eventsRef = ref(db, "calendarEvents");
    const eventPayload = {
      title: eventData.title,
      date: new Date(eventData.date).toISOString(),
      startTime: eventData.startTime,
      endTime: eventData.endTime,
    };

    if (editingKey) {
      update(ref(db, `calendarEvents/${editingKey}`), eventPayload);
    } else {
      push(eventsRef, eventPayload);
    }

    setEventDialogOpen(false);
    setEventData({ title: "", date: "", startTime: "", endTime: "" });
    setEditingKey(null);
  };

  const handleEdit = () => {
    setEditingKey(selectedHoliday.key);
    setEventData({
      title: selectedHoliday.title,
      date: new Date(selectedHoliday.date).toISOString().slice(0, 10),
      startTime: selectedHoliday.startTime || "",
      endTime: selectedHoliday.endTime || "",
    });
    setOpen(false);
    setEventDialogOpen(true);
  };

  const handleDelete = () => {
    remove(ref(db, `calendarEvents/${selectedHoliday.key}`));
    setOpen(false);
  };

  const { dates, firstDayOfWeek } = getMonthDates(selectedYear, selectedMonth);

  return (
    <Paper sx={{ padding: 2, width: isMobile ? "100%" : isTablet ? "90%" : "80%", mx: "auto" }}>
      <Typography variant="h6" mb={2}>College Calendar</Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ flex: 1 }}>
          <InputLabel>Month</InputLabel>
          <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {Array.from({ length: 12 }).map((_, index) => (
              <MenuItem key={index} value={index}>
                {new Date(0, index).toLocaleString("en-US", { month: "long" })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ flex: 1 }}>
          <InputLabel>Year</InputLabel>
          <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {Array.from({ length: 10 }, (_, i) => 2024 + i).map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <IconButton onClick={() => handleMonthChange(-1)}><ArrowBack /></IconButton>
        <IconButton onClick={() => handleMonthChange(1)}><ArrowForward /></IconButton>
      </Box>

      <Grid container spacing={1}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Grid item xs key={day} textAlign="center" fontWeight="bold" color={day === "Sun" ? "red" : "inherit"}>
            {day}
          </Grid>
        ))}
      </Grid>

      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
        {Array.from({ length: firstDayOfWeek }).map((_, i) => <Box key={i} sx={{ minHeight: 60 }} />)}

        {dates.map(({ date }, index) => {
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <Box
              key={index}
              onClick={() => handleDateClick(date)}
              sx={{
                minHeight: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                bgcolor: isToday
                  ? "#E3F2FD"
                  : isSunday(date)
                  ? "#FFEBEE"
                  : isHoliday(date)
                  ? "#FFF3CD"
                  : "#FFF",
                color: isSunday(date) ? "red" : isToday ? "blue" : "inherit",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">{date.getDate()}</Typography>
            </Box>
          );
        })}
      </Box>

      {/* Event Modal */}
      <Modal open={open} onClose={handleClose}>
        <Card sx={{ padding: 3, margin: "auto", mt: 10, maxWidth: 300 }}>
          <CardContent>
            <Typography variant="h6">
              {selectedHoliday ? selectedHoliday.title : "No Events"}
            </Typography>
            <Typography>{selectedDate?.toDateString()}</Typography>
            {selectedHoliday?.startTime && <Typography>Start: {selectedHoliday.startTime}</Typography>}
            {selectedHoliday?.endTime && <Typography>End: {selectedHoliday.endTime}</Typography>}

            {isAdmin(user) && selectedHoliday && (
              <Box mt={2} display="flex" justifyContent="space-between">
                <Button variant="outlined" startIcon={<Edit />} onClick={handleEdit}>Edit</Button>
                <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDelete}>Delete</Button>
              </Box>
            )}
            {isAdmin(user) && !selectedHoliday && (
              <Button variant="contained" onClick={() => {
                setEventData({
                  title: "",
                  date: selectedDate.toISOString().slice(0, 10),
                  startTime: "",
                  endTime: "",
                });
                setEventDialogOpen(true);
                setOpen(false);
              }} fullWidth>Add Event</Button>
            )}
          </CardContent>
        </Card>
      </Modal>

      {/* Add/Edit Event Dialog */}
      <Modal open={eventDialogOpen} onClose={() => setEventDialogOpen(false)}>
        <Card sx={{ padding: 3, margin: "auto", mt: 10, maxWidth: 400 }}>
          <Typography variant="h6">{editingKey ? "Edit Event" : "Add Event"}</Typography>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
          />
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={eventData.date}
            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
          />
          <TextField
            label="Start Time"
            type="time"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={eventData.startTime}
            onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
          />
          <TextField
            label="End Time"
            type="time"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={eventData.endTime}
            onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddOrEdit} fullWidth>
            {editingKey ? "Update" : "Add"} Event
          </Button>
        </Card>
      </Modal>
    </Paper>
  );
};

export default Calendar;
