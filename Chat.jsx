import React, { useState, useEffect, useRef } from "react";
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
  ListItemAvatar,
  IconButton,
  Popover,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { database, ref, push, onValue } from "../firebaseConfig";
import { fetchUsers } from "../utils/fetchUsers";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import Picker from "@emoji-mart/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { remove } from "firebase/database";

const Chat = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [people, setPeople] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const messagesEndRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);


  const fileInputRefs = {
    image: useRef(null),
    video: useRef(null),
    audio: useRef(null),
    document: useRef(null),
    zip: useRef(null),
  };

  const formatMessageDate = (timestamp, lastDisplayedDate) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let formattedDate;

    if (messageDate.toDateString() === today.toDateString()) {
      formattedDate = "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      formattedDate = "Yesterday";
    } else {
      formattedDate = messageDate.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
    }

    // Only return a new date if it's different from the last displayed date
    return formattedDate !== lastDisplayedDate ? formattedDate : null;
  };


  // Delete message
  const handleDeleteMessage = () => {
    if (!selectedPerson || !user || !selectedMessageId) return;

    const chatId = [user.uid, selectedPerson.id].sort().join("_");
    const messageRef = ref(database, `messages/${chatId}/${selectedMessageId}`);

    remove(messageRef)
      .then(() => {
        setContextMenu(null);
        setSelectedMessageId(null);
        setMessages((prevMessages) => {
          const updatedMessages = { ...prevMessages };
          delete updatedMessages[selectedMessageId];
          return updatedMessages;
        });
      })
      .catch((error) => console.error("Error deleting message:", error));
  };



  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    fetchUsers(setPeople);
  }, []);

  useEffect(() => {
    if (selectedPerson && user) {
      const chatId = [user.uid, selectedPerson.id].sort().join("_");
      const messagesRef = ref(database, `messages/${chatId}`);

      const unsubscribe = onValue(messagesRef, (snapshot) => {
        setMessages(snapshot.exists() ? snapshot.val() : {});
      });

      return () => unsubscribe(); // Cleanup
    }
  }, [selectedPerson, user]);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (message.trim() && selectedPerson && user) {
      const chatId = [user.uid, selectedPerson.id].sort().join("_");
      push(ref(database, `messages/${chatId}`), {
        content: message,
        type: "text",
        sender: user.uid,
        receiver: selectedPerson.id,
        timestamp: Date.now(),
      });
      setMessage("");
    }
  };

  const handleUploadIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUploadPopup = () => {
    setAnchorEl(null);
  };

  const handleFileUpload = async (event, fileType) => {
    const file = event.target.files[0];
    if (!file || !selectedPerson || !user) return;

    const fileUrl = await uploadToCloudinary(file);
    if (!fileUrl) return;

    const chatId = [user.uid, selectedPerson.id].sort().join("_");
    push(ref(database, `messages/${chatId}`), {
      content: fileUrl,
      type: fileType,
      sender: user.uid,
      receiver: selectedPerson.id,
      timestamp: Date.now(),
      fileName: file.name, // Save the file name for documents & zip files
    });
  };

  // Function to handle different file types
  const renderMessageContent = (msg) => {
    switch (msg.type) {
      case "text":
        return msg.content;
      case "image":
        return <img src={msg.content} alt="Image" style={{ width: "200px", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }} />;
      case "video":
        return <video src={msg.content} controls style={{ width: "200px", maxHeight: "200px", borderRadius: "8px" }} />;
      case "audio":
        return <audio src={msg.content} controls />;
      case "document":
      case "zip":
        return (
          <a href={msg.content} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#1976d2" }}>
            <DescriptionIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            {msg.fileName || "Download File"}
          </a>
        );
      default:
        return "Unsupported file type";
    }
  };


  // Handle right-click to show context menu
  const handleContextMenu = (event, msgId) => {
    event.preventDefault();
    console.log("Right-clicked message ID:", msgId);
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setSelectedMessageId(msgId);
  };




  // Close context menu
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };



  const handleEmojiClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleCloseEmojiPicker = () => {
    setEmojiAnchorEl(null);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + (emoji.native || emoji.colons || ""));
  };


  return (
    <Grid container sx={{ height: "100%" }}>
      {/* User List */}
      <Grid item xs={3} sx={{ bgcolor: "#f5f5f5", borderRight: "1px solid #ccc", height: "100%", overflowY: "auto" }}>
        <Typography variant="h6" sx={{ p: 2 }}>People</Typography>
        <List>
          {people.map((person) => (
            <ListItem
              button key={person.id}
              selected={selectedPerson?.id === person.id}
              onClick={() => setSelectedPerson(person)}
              sx={{ "&.Mui-selected": { bgcolor: "#1976d2", color: "#fff" } }}
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
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#fff" }}>
            <Typography variant="h6" sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={selectedPerson.avatar} alt={selectedPerson.name} />
              {selectedPerson.name}
            </Typography>



            {/* Messages */}
            <Paper sx={{ flexGrow: 1, p: 2, overflowY: "auto", maxHeight: "calc(100vh - 250px)", bgcolor: "#f9f9f9" }}>
              <List>
                {messages && Object.entries(messages).map(([msgId, msg], index, array) => {
                  const prevMsg = array[index - 1] ? array[index - 1][1] : null;
                  const currentDate = formatMessageDate(msg.timestamp);
                  const prevDate = prevMsg ? formatMessageDate(prevMsg.timestamp) : null;

                  // Only show the date if it’s different from the previous message's date
                  const showDateHeader = currentDate && currentDate !== prevDate;

                  return (
                    <React.Fragment key={msgId}>
                      {showDateHeader && (
                        <Typography
                          variant="caption"
                          sx={{
                            textAlign: "center",
                            display: "block",
                            my: 1,
                            color: "#757575",
                          }}
                        >
                          {currentDate}
                        </Typography>
                      )}

                      <ListItem
                        sx={{
                          display: "flex",
                          flexDirection: msg.sender === user.uid ? "row-reverse" : "row",
                          alignItems: "flex-start",
                          gap: 1,
                        }}
                        onContextMenu={(e) => handleContextMenu(e, msgId)}
                      >
                        <ListItemText
                          primary={renderMessageContent(msg)}
                          secondary={new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                          sx={{
                            textAlign: msg.sender === user.uid ? "right" : "left",
                            bgcolor: "#E3F2FD",
                            p: 1,
                            borderRadius: 2,
                            maxWidth: "250px",
                            wordWrap: "break-word",
                          }}
                        />
                      </ListItem>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </List>


            </Paper>

            {/* Context Menu */}
            <Menu
              open={Boolean(contextMenu)}
              onClose={() => setContextMenu(null)}
              anchorReference="anchorPosition"
              anchorPosition={contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
            >

              <MenuItem onClick={handleDeleteMessage}>
                <DeleteIcon sx={{ mr: 1 }} /> Delete Message
              </MenuItem>
            </Menu>

            {/* Input & File Upload Popup */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
              <IconButton onClick={handleEmojiClick}>
                <InsertEmoticonIcon />
              </IconButton>
              <Popover open={Boolean(emojiAnchorEl)} anchorEl={emojiAnchorEl} onClose={handleCloseEmojiPicker}>
                <Picker onEmojiSelect={handleEmojiSelect} />
              </Popover>

              <IconButton onClick={handleUploadIconClick}>
                <AttachFileIcon />
              </IconButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseUploadPopup}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "left" }}
              >
                <Box sx={{ display: "flex", flexDirection: "row", p: 2, gap: 1 }}>
                  <IconButton onClick={() => fileInputRefs.image.current.click()}><ImageIcon /></IconButton>
                  <IconButton onClick={() => fileInputRefs.video.current.click()}><VideoLibraryIcon /></IconButton>
                  <IconButton onClick={() => fileInputRefs.audio.current.click()}><AudiotrackIcon /></IconButton>
                  <IconButton onClick={() => fileInputRefs.document.current.click()}><DescriptionIcon /></IconButton>
                  <IconButton onClick={() => fileInputRefs.zip.current.click()}><FolderZipIcon /></IconButton>
                </Box>
              </Popover>

              <input type="file" ref={fileInputRefs.image} style={{ display: "none" }} onChange={(e) => handleFileUpload(e, "image")} accept="image/*" />
              <input type="file" ref={fileInputRefs.video} style={{ display: "none" }} onChange={(e) => handleFileUpload(e, "video")} accept="video/*" />
              <input type="file" ref={fileInputRefs.audio} style={{ display: "none" }} onChange={(e) => handleFileUpload(e, "audio")} accept="audio/*" />
              <input type="file" ref={fileInputRefs.document} style={{ display: "none" }} onChange={(e) => handleFileUpload(e, "document")} accept=".pdf,.doc,.docx,.txt" />
              <input type="file" ref={fileInputRefs.zip} style={{ display: "none" }} onChange={(e) => handleFileUpload(e, "zip")} accept=".zip,.rar" />

              {Object.keys(fileInputRefs).map((type) => (
                <input
                  key={type}
                  ref={fileInputRefs[type]}
                  type="file"
                  accept={type === "image" ? "image/*" : type === "video" ? "video/*" : type === "audio" ? "audio/*" : "*"}
                  hidden
                  onChange={(e) => handleFileUpload(e, type)}
                />
              ))}

              <TextField fullWidth value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button variant="contained" onClick={handleSend}><SendIcon /></Button>
            </Box>
          </Box>
        ) : <Typography>Select a person to chat</Typography>}
      </Grid>
    </Grid>
  );
};

export default Chat;
