import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
} from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load Gemini Model
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        setUserInput(event.results[0][0].transcript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
  };

  const handleVoiceInput = () => {
    recognitionRef.current?.start();
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setChatHistory(prev => [...prev, { sender: "user", text: userInput }]);
    const input = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      let responseText = "Sorry, something went wrong.";

      const result = await geminiModel.generateContent(input);
      responseText = await result.response.text();

      setChatHistory(prev => [...prev, { sender: "bot", text: responseText }]);
      speak(responseText);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory(prev => [...prev, { sender: "bot", text: "Error fetching response from Gemini." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        p: 3,
        width: "100%",
        maxWidth: 700,
        m: "auto",
        borderRadius: 5,
        background: "#f7f7f7",
        boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ mb: 3 }} />

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ maxHeight: 400, overflowY: "auto", mb: 3, pr: 1 }}>
        {chatHistory.map((chat, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: chat.sender === "user" ? "flex-end" : "flex-start",
              alignItems: "center",
              mb: 2,
              gap: 2,
            }}
          >
            {chat.sender === "bot" && (
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <SmartToyIcon />
              </Avatar>
            )}
            <Box
              sx={{
                backgroundColor: chat.sender === "user" ? "#1976d2" : "#e0e0e0",
                color: chat.sender === "user" ? "#fff" : "#000",
                padding: "12px 18px",
                borderRadius: 3,
                maxWidth: "70%",
                wordWrap: "break-word",
                boxShadow: chat.sender === "user"
                  ? "0px 3px 6px rgba(25, 118, 210, 0.3)"
                  : "0px 3px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="body2">{chat.text}</Typography>
            </Box>
            {chat.sender === "user" && (
              <Avatar sx={{ bgcolor: "#4caf50" }}>
                <PersonIcon />
              </Avatar>
            )}
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Avatar sx={{ bgcolor: "#1976d2" }}>
              <SmartToyIcon />
            </Avatar>
            <Box
              sx={{
                backgroundColor: "#e0e0e0",
                padding: "10px 15px",
                borderRadius: 3,
                maxWidth: "70%",
              }}
            >
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                Thinking...
              </Typography>
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          sx={{
            borderRadius: 2,
            backgroundColor: "#fff",
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Tooltip title="Speak your message">
          <IconButton onClick={handleVoiceInput} color="primary">
            <MicIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSend}
        sx={{
          mt: 2,
          borderRadius: 3,
          padding: "12px 18px",
          boxShadow: "0px 3px 6px rgba(25, 118, 210, 0.3)",
        }}
        disabled={isLoading}
        endIcon={isLoading && <CircularProgress size={20} color="inherit" />}
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </Paper>
  );
};

export default Chatbot;
