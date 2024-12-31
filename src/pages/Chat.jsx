// src/pages/Chat.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  Grid,
  Divider,
  ListItemAvatar,
} from '@mui/material';

const Chat = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState('');

  const people = [
    { id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Diana', avatar: 'https://i.pravatar.cc/150?img=4' },
  ];

  const handleSend = () => {
    if (message.trim() && selectedPerson) {
      setMessages((prev) => ({
        ...prev,
        [selectedPerson.id]: [
          ...(prev[selectedPerson.id] || []),
          { text: message, sender: 'You', isSelf: true },
        ],
      }));
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
  };

  return (
    <Grid container sx={{ height: '100%' }}>
      {/* People List */}
      <Grid
        item
        xs={3}
        sx={{
          bgcolor: '#f5f5f5',
          borderRight: '1px solid #ccc',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          People
        </Typography>
        <List>
          {people.map((person) => (
            <ListItem
              button
              key={person.id}
              selected={selectedPerson?.id === person.id}
              onClick={() => handleSelectPerson(person)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: '#1976d2',
                  color: '#fff',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar src={person.avatar} alt={person.name} />
              </ListItemAvatar>
              <ListItemText primary={person.name} />
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Chat Section */}
      <Grid item xs={9}>
        {selectedPerson ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              bgcolor: '#fff',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderBottom: '1px solid #ccc',
              }}
            >
              <Avatar src={selectedPerson.avatar} alt={selectedPerson.name} />
              {selectedPerson.name}
            </Typography>

            <Paper
              sx={{
                flexGrow: 1,
                p: 2,
                overflowY: 'auto',
                bgcolor: '#f9f9f9',
                border: '1px solid #ccc',
              }}
            >
              <List>
                {(messages[selectedPerson.id] || []).map((msg, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: msg.isSelf ? 'row-reverse' : 'row',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Avatar
                      src={msg.isSelf ? 'https://i.pravatar.cc/150?img=5' : selectedPerson.avatar}
                      alt={msg.isSelf ? 'You' : selectedPerson.name}
                    />
                    <ListItemText
                      primary={msg.text}
                      sx={{
                        textAlign: msg.isSelf ? 'right' : 'left',
                        bgcolor: msg.isSelf ? '#E3F2FD' : '#FFFFFF',
                        p: 1,
                        borderRadius: 2,
                        maxWidth: '70%',
                        boxShadow: 1,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button variant="contained" color="primary" onClick={handleSend}>
                Send
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography
            variant="h6"
            sx={{
              p: 2,
              textAlign: 'center',
              color: '#888',
            }}
          >
            Select a person to start chatting
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Chat;
