// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";

const Header = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileImage, setProfileImage] = useState("/profile.jpg");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const response = await axios.get(
            `https://college-fde10-default-rtdb.firebaseio.com/student_list.json`
          );
          const studentsData = response.data;

          const studentKey = Object.keys(studentsData).find(
            (key) => studentsData[key].email === user.email
          );

          if (studentKey) {
            setProfileImage(studentsData[studentKey].photoUrl || "/profile.jpg");
          }

          // Listen for real-time updates to profile image
          const interval = setInterval(async () => {
            const updatedResponse = await axios.get(
              `https://college-fde10-default-rtdb.firebaseio.com/student_list.json`
            );
            const updatedData = updatedResponse.data;

            if (updatedData[studentKey]?.photoUrl) {
              setProfileImage(updatedData[studentKey].photoUrl);
            }
          }, 3000); // Check for changes every 3 seconds

          return () => clearInterval(interval); // Cleanup on unmount
        } catch (error) {
          console.error("Error fetching user photo:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        bgcolor: "#1976D2",
        color: "#FFFFFF",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1100,
        height: "64px",
        minHeight: "64px",
      }}
    >
      <Tooltip title="Profile Options">
        <IconButton
          onClick={handleAvatarClick}
          sx={{
            marginLeft: "auto",
            marginRight: {
              xs: "0%",
              sm: "18%",
            },
          }}
        >
          <Avatar alt="Profile" src={profileImage} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;
