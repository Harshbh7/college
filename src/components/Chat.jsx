
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { auth, database } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { ref, onValue, push } from "firebase/database";
import { generateChatId } from "../utils/generateChatId";

const Chat = ({ user, students }) => {
  const [currentRecipient, setCurrentRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  if (!user) {
    return <Typography variant="h6">User is not logged in.</Typography>;
  }

  // Fetch messages for the selected recipient using chat ID
  useEffect(() => {
    if (currentRecipient) {
      const chatId = generateChatId(user.uid, currentRecipient.id);
      const messagesRef = ref(database, `messages/${chatId}`);
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const messagesArray = data
          ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
          : [];
        setMessages(messagesArray);
      });
    }
  }, [currentRecipient, user.uid]);

  // Send message to the selected recipient
  const handleSendMessage = () => {
    if (!message.trim()) return;
    const chatId = generateChatId(user.uid, currentRecipient.id);
    const messageRef = ref(database, `messages/${chatId}`);
    const newMessage = {
      sender: user.uid,
      content: message,
      timestamp: Date.now(),
    };
    push(messageRef, newMessage);
    setMessage("");
  };

  return (
    <Box>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Chat App
          </Typography>
          <Typography variant="body2" sx={{ marginRight: 2 }}>
            {user.email}
          </Typography>
          <Button color="inherit" onClick={() => signOut(auth)}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box display="flex" height="100vh">
        <Box width="25%" bgcolor="#f4f4f4" borderRight="1px solid #ddd">
          <Typography variant="h6" sx={{ p: 2 }}>
            Students
          </Typography>
          <List>
            {students.map((student) => (
              <ListItem
                button
                key={student.id}
                selected={currentRecipient?.id === student.id}
                onClick={() => setCurrentRecipient(student)}
              >
                <ListItemText primary={student.name} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box flex={1} p={2}>
          {currentRecipient ? (
            <>
              <Typography variant="h6">
                Chat with {currentRecipient.name}
              </Typography>
              <Box
                sx={{
                  height: "70vh",
                  overflowY: "auto",
                  backgroundColor: "#e9ecef",
                  padding: 2,
                  borderRadius: 2,
                }}
              >
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: "flex",
                      justifyContent:
                        msg.sender === user.uid ? "flex-end" : "flex-start",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: msg.sender === user.uid
                          ? "#1976d2"
                          : "#f1f1f1",
                        color: msg.sender === user.uid ? "#fff" : "#000",
                        p: 1,
                        borderRadius: 2,
                      }}
                    >
                      {msg.content}
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box mt={2} display="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flexGrow: 1,
                    padding: "8px",
                    marginRight: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <Button variant="contained" onClick={handleSendMessage}>
                  Send
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body1">
              Select a student to start chatting.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
