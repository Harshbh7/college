// src/components/Header.jsx
// src/components/Header.jsx
import React, { useState } from 'react';
import { Box, TextField, IconButton, Badge, Avatar, Tooltip, Menu, MenuItem } from '@mui/material';
import { Search, Notifications, Message, Settings, HelpOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Header = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile'); // Navigate to the ProfilePage
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        bgcolor: '#1976D2',
        color: '#FFFFFF',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1100,
        height: '64px',
        minHeight: '64px',
      }}
    >
      {/* Search Bar */}
      <TextField
        placeholder="Search..."
        variant="outlined"
        size="small"
        sx={{
          bgcolor: '#FFFFFF',
          borderRadius: 1,
          width: '40%',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: '#90CAF9',
            },
          },
        }}
        InputProps={{
          endAdornment: <Search sx={{ color: '#1976D2' }} />,
        }}
      />

      {/* Icons Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          marginRight: '20%',
        }}
      >
        {/* Notifications Icon */}
        <Tooltip title="Notifications">
          <IconButton>
            <Badge badgeContent={4} color="error">
              <Notifications sx={{ color: '#FFFFFF' }} />
            </Badge>
          </IconButton>
        </Tooltip>
        {/* Messages Icon */}
        <Tooltip title="Messages">
          <IconButton>
            <Badge badgeContent={2} color="error">
              <Message sx={{ color: '#FFFFFF' }} />
            </Badge>
          </IconButton>
        </Tooltip>
        {/* Settings Icon */}
        <Tooltip title="Settings">
          <IconButton>
            <Settings sx={{ color: '#FFFFFF' }} />
          </IconButton>
        </Tooltip>
        {/* Help Icon */}
        <Tooltip title="Help">
          <IconButton>
            <HelpOutline sx={{ color: '#FFFFFF' }} />
          </IconButton>
        </Tooltip>
        {/* Profile Avatar */}
        <Tooltip title="Profile Options">
          <IconButton onClick={handleAvatarClick}>
            <Avatar alt="Profile" src="/profile.jpg" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Avatar Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem> {/* Update the onClick handler */}
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); onLogout(); }}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;

