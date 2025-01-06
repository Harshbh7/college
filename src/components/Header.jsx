import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
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
      {/* Profile Avatar */}
      <Tooltip title="Profile Options">
        <IconButton
          onClick={handleAvatarClick}
          sx={{
            marginLeft: 'auto', // Pushes avatar to the right side
            marginRight: {
              xs: '0%', // For mobile screens (extra small, up to 600px)
              sm: '18%', // For larger screens (tablet and desktop)
            },
          }}
        >
          <Avatar alt="Profile" src="/profile.jpg" />
        </IconButton>
      </Tooltip>

      {/* Avatar Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onLogout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;
