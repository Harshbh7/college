// Frontened/src/pages/Chat.jsx
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Avatar, Paper, Grid, ListItemAvatar } from "@mui/material";
import { database, ref, push, onValue } from "../firebaseConfig"; // Import Firebase DB
import { auth } from "../firebaseConfig";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const Chat = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);

  // Fetch students list
  useEffect(() => {
    const studentsRef = ref(database, "student_list");
    onValue(studentsRef, (snapshot) => {
      if (snapshot.exists()) {
        setStudents(Object.values(snapshot.val()));
      }
    });
  }, []);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (!selectedPerson) return;

    const chatId = [auth.currentUser.uid, selectedPerson.id].sort().join("_");
    const messagesRef = ref(database, `messages/${chatId}`);

    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        setMessages(Object.values(snapshot.val()));
      }
    });

    socket.on("receiveMessage", (newMessage) => {
      if (newMessage.sender === selectedPerson.id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedPerson]);

  const handleSend = async () => {
    if (!message.trim() || !selectedPerson) return;

    const chatId = [auth.currentUser.uid, selectedPerson.id].sort().join("_");
    const messagesRef = ref(database, `messages/${chatId}`);

    const newMessage = {
      text: message,
      sender: auth.currentUser.uid,
      receiver: selectedPerson.id,
      timestamp: Date.now(),
    };

    try {
      const newMessageRef = await push(messagesRef, newMessage);
      const messageId = newMessageRef.key;

      socket.emit("sendMessage", { ...newMessage, messageId });

      setMessages((prev) => [...prev, { ...newMessage, messageId }]);
      setMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Grid container sx={{ height: "100%" }}>
      {/* Left Sidebar: People List */}
      <Grid item xs={3} sx={{ bgcolor: "#f5f5f5", borderRight: "1px solid #ccc", height: "100%", overflowY: "auto" }}>
        <Typography variant="h6" sx={{ p: 2 }}>People</Typography>
        <List>
          {students.map((student, index) => (
            <ListItem
              button
              key={index}
              selected={selectedPerson?.id === student.id}
              onClick={() => setSelectedPerson(student)}
            >
              <ListItemAvatar>
                <Avatar src={student.photoUrl} alt={student.name} />
              </ListItemAvatar>
              <ListItemText primary={student.name} />
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Chat Window */}
      <Grid item xs={9}>
        {selectedPerson ? (
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: "1px solid #ccc" }}>
              Chat with {selectedPerson.name}
            </Typography>

            <Paper sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>
              <List>
                {messages.map((msg, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={msg.text} secondary={new Date(msg.timestamp).toLocaleTimeString()} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Box sx={{ display: "flex", p: 2 }}>
              <TextField fullWidth placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button variant="contained" onClick={handleSend}>Send</Button>
            </Box>
          </Box>
        ) : <Typography variant="h6" sx={{ p: 2 }}>Select a person to chat</Typography>}
      </Grid>
    </Grid>
  );
};

export default Chat;











// // src/pages/Chat.jsx
// import React, { useState, useEffect } from 'react';
// import { db, ref, set, get, push, child } from '../firebase';
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Avatar,
//   Paper,
//   Grid,
//   Divider,
//   ListItemAvatar,
// } from '@mui/material';

// const Chat = () => {
//   const [selectedPerson, setSelectedPerson] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [students, setStudents] = useState([]);

//   // Current user ID (this should be dynamic based on logged-in user)
//   const currentUser = 'student_id_1'; // Replace with current logged-in user ID

//   // Fetch students from Firebase Realtime Database
//   const fetchStudents = () => {
//     get(child(ref(db), 'students')).then((snapshot) => {
//       if (snapshot.exists()) {
//         setStudents(Object.values(snapshot.val()));
//       }
//     });
//   };

//   // Fetch messages between the current user and the selected person
//   const fetchMessages = (userId, otherUserId) => {
//     get(child(ref(db), `messages/${userId}/${otherUserId}`)).then((snapshot) => {
//       if (snapshot.exists()) {
//         setMessages(Object.values(snapshot.val()));
//       } else {
//         setMessages([]);
//       }
//     });
//   };

//   // Handle sending a new message
//   const handleSend = () => {
//     if (message.trim() && selectedPerson) {
//       const newMessage = {
//         sender: currentUser,
//         text: message,
//         timestamp: Date.now(),
//       };

//       // Push the new message to both users' chat in Firebase
//       push(ref(db, `messages/${currentUser}/${selectedPerson.id}`), newMessage);
//       push(ref(db, `messages/${selectedPerson.id}/${currentUser}`), newMessage);

//       setMessage('');
//     }
//   };

//   // Handle keypress for sending message on Enter key
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   // Handle selecting a person from the list
//   const handleSelectPerson = (person) => {
//     setSelectedPerson(person);
//     fetchMessages(currentUser, person.id);
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   return (
//     <Grid container sx={{ height: '100%' }}>
//       {/* People List */}
//       <Grid
//         item
//         xs={3}
//         sx={{
//           bgcolor: '#f5f5f5',
//           borderRight: '1px solid #ccc',
//           height: '100%',
//           overflowY: 'auto',
//         }}
//       >
//         <Typography variant="h6" sx={{ p: 2 }}>
//           People
//         </Typography>
//         <List>
//           {students.map((person) => (
//             <ListItem
//               button
//               key={person.id}
//               selected={selectedPerson?.id === person.id}
//               onClick={() => handleSelectPerson(person)}
//               sx={{
//                 '&.Mui-selected': {
//                   bgcolor: '#1976d2',
//                   color: '#fff',
//                 },
//               }}
//             >
//               <ListItemAvatar>
//                 <Avatar src={person.avatar} alt={person.name} />
//               </ListItemAvatar>
//               <ListItemText primary={person.name} />
//             </ListItem>
//           ))}
//         </List>
//       </Grid>

//       {/* Chat Section */}
//       <Grid item xs={9}>
//         {selectedPerson ? (
//           <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//             <Typography
//               variant="h6"
//               sx={{
//                 p: 2,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 2,
//                 borderBottom: '1px solid #ccc',
//               }}
//             >
//               <Avatar src={selectedPerson.avatar} alt={selectedPerson.name} />
//               {selectedPerson.name}
//             </Typography>

//             <Paper
//               sx={{
//                 flexGrow: 1,
//                 p: 2,
//                 overflowY: 'auto',
//                 bgcolor: '#f9f9f9',
//                 border: '1px solid #ccc',
//               }}
//             >
//               <List>
//                 {messages.map((msg, index) => (
//                   <ListItem
//                     key={index}
//                     sx={{
//                       display: msg.sender === currentUser ? 'row-reverse' : 'row',
//                       alignItems: 'center',
//                       gap: 1,
//                     }}
//                   >
//                     <Avatar
//                       src={msg.sender === currentUser ? 'https://i.pravatar.cc/150?img=5' : selectedPerson.avatar}
//                       alt={msg.sender === currentUser ? 'You' : selectedPerson.name}
//                     />
//                     <ListItemText
//                       primary={msg.text}
//                       sx={{
//                         textAlign: msg.sender === currentUser ? 'right' : 'left',
//                         bgcolor: msg.sender === currentUser ? '#E3F2FD' : '#FFFFFF',
//                         p: 1,
//                         borderRadius: 2,
//                         maxWidth: '70%',
//                         boxShadow: 1,
//                       }}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//             <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 placeholder="Type your message..."
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//               />
//               <Button variant="contained" color="primary" onClick={handleSend}>
//                 Send
//               </Button>
//             </Box>
//           </Box>
//         ) : (
//           <Typography
//             variant="h6"
//             sx={{
//               p: 2,
//               textAlign: 'center',
//               color: '#888',
//             }}
//           >
//             Select a person to start chatting
//           </Typography>
//         )}
//       </Grid>
//     </Grid>
//   );
// };

// export default Chat;
