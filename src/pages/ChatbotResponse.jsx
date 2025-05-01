// src/components/ChatbotResponse.jsx
import React from 'react';
import { Box, Fab } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Chatbot from './Chatbot';

const ChatbotResponse = ({ showChatbot, setShowChatbot }) => {
  return (
    <Box sx={{ position: 'fixed', bottom: 16, left: 16, zIndex: 1500 }}>
      {/* Floating Button */}
      <Fab color="primary" aria-label="chat" onClick={() => setShowChatbot(prev => !prev)}>
        <PersonIcon />
      </Fab>

      {/* Chatbot Window */}
      {showChatbot && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 80,
            left: 16,
            width: 350,
            height: 500,
            bgcolor: 'white',
            boxShadow: 6,
            borderRadius: 2,
            zIndex: 1500,
            overflow: 'hidden',
          }}
        >
          <Chatbot />
        </Box>
      )}
    </Box>
  );
};

export default ChatbotResponse;
