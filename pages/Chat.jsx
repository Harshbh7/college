// src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import {Box,TextField,Button,Typography,List,ListItem,ListItemText,Avatar,Paper,Grid,ListItemAvatar,IconButton,Popover,Tooltip,Menu,MenuItem,} from "@mui/material";
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
import "../styles/Chat.css";

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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);


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
    return formattedDate !== lastDisplayedDate ? formattedDate : null;
  };

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
        const newMessages = snapshot.exists() ? snapshot.val() : {};
        setMessages(newMessages);

        const messageEntries = Object.entries(newMessages);
        if (messageEntries.length > 0) {
          const [lastMessageId, lastMessage] = messageEntries[messageEntries.length - 1];

          if (lastMessage.sender !== user.uid) {
            showNotification(selectedPerson.name, lastMessage.content);
          }
        }
      });

      return () => unsubscribe(); 
    }
  }, [selectedPerson, user]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

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

  const showNotification = (senderName, messageContent) => {
    if (Notification.permission === "granted") {
      new Notification(`New message from ${senderName}`, {
        body: messageContent.length > 50 ? messageContent.substring(0, 50) + "..." : messageContent,
        icon: "/chat-icon.png", // Optional: Add your app icon
      });
    }
  };

  const renderMessageContent = (msg) => {
    if (!msg.content) return "Invalid message";

    const isFileType = ["image", "video", "audio", "document", "zip"].includes(msg.type);

    const handleDownload = () => {
      const link = document.createElement("a");
      link.href = msg.content;
      link.download = msg.fileName || `file_${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const isURL = (text) => {
      const urlPattern = /(https?:\/\/[^\s]+)/g;
      return urlPattern.test(text);
    };

    const getLinkPreview = async (url) => {
      try {
        const response = await fetch(`https://api.linkpreview.net/?key=YOUR_API_KEY&q=${url}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching link preview:", error);
        return null;
      }
    };


    if (msg.type === "text" && isURL(msg.content)) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <a href={msg.content} target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", wordBreak: "break-word" }}>
            {msg.content}
          </a>
          <LinkPreview url={msg.content} />
        </div>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "left", gap: "5px" }}>
        {msg.type === "text" ? (
          <p>{msg.content}</p>
        ) : msg.type === "image" ? (
          <>
            <img
              src={msg.content}
              alt="Image"
              style={{ width: "200px", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }}
              onClick={handleDownload}
            />
            <span style={{ fontSize: "12px", color: "#555" }}>{msg.fileName || "Image File"}</span>
          </>
        ) : msg.type === "video" ? (
          <>
            <video
              src={msg.content}
              controls
              style={{ width: "200px", maxHeight: "200px", borderRadius: "8px", cursor: "pointer" }}
              onClick={handleDownload}
            />
            <span style={{ fontSize: "12px", color: "#555" }}>{msg.fileName || "Video File"}</span>
          </>
        ) : msg.type === "audio" ? (
          <>
            <audio src={msg.content} controls style={{ cursor: "pointer" }} onClick={handleDownload} />
            <span style={{ fontSize: "12px", color: "#555" }}>{msg.fileName || "Audio File"}</span>
          </>
        ) : isFileType ? (
          <>
            <a
              href={msg.content}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#1976d2", cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                handleDownload();
              }}
            >
              <DescriptionIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              {msg.fileName || "Download File"}
            </a>
            <span style={{ fontSize: "12px", color: "#555" }}>{msg.fileName || "File"}</span>
          </>
        ) : (
          "Unsupported file type"
        )}
      </div>
    );
  };

  

  const LinkPreview = ({ url }) => {
    const [previewData, setPreviewData] = React.useState(null);

    React.useEffect(() => {
      const fetchPreview = async () => {
        try {
          const response = await fetch(`https://api.linkpreview.net/?key=b5d2e874bf03a52a473b8759b9931cb6&q=${url}`);
          const data = await response.json();
          setPreviewData(data);
        } catch (error) {
          console.error("Error fetching preview:", error);
        }
      };
      fetchPreview();
    }, [url]);

    if (!previewData) return null;

    return (
      <a href={previewData.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#333" }}>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", width: "250px" }}>
          <img src={previewData.image} alt="Preview" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
          <div style={{ padding: "10px" }}>
            <p style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}>{previewData.title}</p>
            <p style={{ fontSize: "12px", color: "#777", margin: 0 }}>{previewData.description}</p>
          </div>
        </div>
      </a>
    );
  };


  

  const handleContextMenu = (event, msgId) => {
    event.preventDefault();
    console.log("Right-clicked message ID:", msgId);
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
    setSelectedMessageId(msgId);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleEmojiClick = (event) => {
    if (isMobile) return; // Prevent opening emoji picker on mobile
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
      {(!isMobile || !selectedPerson) && (
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            bgcolor: "#f9fafb",
            borderRight: "1px solid #ccc",
            height: "100%",
            overflowY: "auto",
            boxShadow: "2px 0px 8px rgba(0,0,0,0.1)",
            borderRadius: { xs: 0, md: "10px" },
            display: selectedPerson && isMobile ? "none" : "block",
          }}
        >
          <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", color: "#1976d2" }}>
            People
          </Typography>
          <List sx={{ p: 1 }}>
            {people.map((person) => (
              <ListItem
                button
                key={person.id}
                selected={selectedPerson?.id === person.id}
                onClick={() => setSelectedPerson(person)}
                sx={{
                  borderRadius: "8px",
                  mb: 1,
                  transition: "background 0.3s",
                  "&:hover": { bgcolor: "#e3f2fd" },
                  "&.Mui-selected": { bgcolor: "#1976d2", color: "#fff" },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={person?.avatar || "/default-avatar.png"}
                    alt={person?.name || "User"}
                    sx={{
                      mr: 2,
                      width: { xs: 50, md: 40 },
                      height: { xs: 50, md: 40 },
                      border: "2px solid #1976d2",
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={person.name}
                  primaryTypographyProps={{
                    sx: { fontSize: { xs: "1.2rem", md: "1rem" }, fontWeight: "bold" },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      )}

      {/* Chat Section */}
      {selectedPerson && (
        <Grid
          item
          xs={12}
          md={9}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            maxHeight: { xs: "82vh", md: "100%" } // Max height for mobile view
          }}
        >

          {selectedPerson ? (
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#fff" }}>
              <Typography variant="h6" sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar src={selectedPerson.avatar} alt={selectedPerson.name} />
                {selectedPerson.name}
              </Typography>

              {/* Messages */}
              <Paper
                sx={{
                  flexGrow: 1,
                  p: 2,
                  overflowY: "auto",
                  maxHeight: "calc(100vh - 250px)",
                  bgcolor: "#f4f6f8",
                  borderRadius: 3,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <List>
                  {messages &&
                    Object.entries(messages).map(([msgId, msg], index, array) => {
                      const prevMsg = array[index - 1] ? array[index - 1][1] : null;
                      const currentDate = formatMessageDate(msg.timestamp);
                      const prevDate = prevMsg ? formatMessageDate(prevMsg.timestamp) : null;

                      // Show date header only if it’s different from the previous message's date
                      const showDateHeader = currentDate && currentDate !== prevDate;

                      return (
                        <React.Fragment key={msgId}>
                          {showDateHeader && (
                            <Typography
                              variant="caption"
                              sx={{
                                textAlign: "center",
                                display: "block",
                                my: 2,
                                py: 0.5,
                                bgcolor: "#e0e0e0",
                                color: "#424242",
                                borderRadius: 2,
                                width: "fit-content",
                                mx: "auto",
                                px: 2,
                                fontWeight: "bold",
                              }}
                            >
                              {currentDate}
                            </Typography>
                          )}

                          <ListItem
                            sx={{
                              display: "flex",
                              flexDirection: msg.sender === user.uid ? "row-reverse" : "row",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                            onContextMenu={(e) => handleContextMenu(e, msgId)}
                          >
                            {/* Fetch User Profile Image Dynamically */}
                            <Avatar
                              src={
                                msg.sender === user.uid
                                  ? user.profileImage || "/default-avatar.png" // Sender's Profile Image
                                  : msg.receiverProfileImage || "/default-avatar.png" // Receiver's Profile Image
                              }
                              alt="User Avatar"
                              sx={{
                                width: 40,
                                height: 40,
                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                              }}
                            />

                            {/* Message Bubble */}
                            <Box
                              sx={{
                                textAlign: msg.sender === user.uid ? "right" : "left",
                                bgcolor: msg.sender === user.uid ? "#D1E9FF" : "#ffffff",
                                p: 1.5,
                                borderRadius: "15px",
                                maxWidth: "60%",
                                wordWrap: "break-word",
                                color: "black", // ✅ Ensuring black text color
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              }}
                            >
                              <Typography variant="body1" sx={{ color: "black" }}>
                                {renderMessageContent(msg)}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "block",
                                  opacity: 0.7,
                                  mt: 0.5,
                                  color: "black",
                                }}
                              >
                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </Typography>
                            </Box>
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }} >
                <IconButton onClick={handleEmojiClick} className="emoji-icon-button">
                  <InsertEmoticonIcon />
                </IconButton>
                <Popover open={Boolean(emojiAnchorEl)} anchorEl={emojiAnchorEl} onClose={handleCloseEmojiPicker} className="emoji-picker-container">
                  <Picker onEmojiSelect={handleEmojiSelect} className="emoji-icon-button" />
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
      )}
    </Grid>
  );
};

export default Chat;