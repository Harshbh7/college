// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Avatar, Grid, TextField, Button, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false); // State to track if we are in edit mode
  const [userProfile, setUserProfile] = useState({
    photoUrl: "https://via.placeholder.com/150", // Replace with user's actual photo URL
    name: "John Doe",
    fatherName: "Richard Doe",
    dob: "1995-05-15",
    enrollmentNo: "EN12345678",
    wrn: "WRN87654321",
    mobile: "+1 123 456 7890",
    address: "123 Elm Street, Springfield, USA",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false); // Exit edit mode after saving
    // Here, you can add logic to save the profile changes, e.g., update the database.
    console.log("Profile saved", userProfile);
  };

  const handleEdit = () => {
    setIsEditing(true); // Enter edit mode
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Card sx={{ maxWidth: 600, width: "100%", padding: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar
            src={userProfile.photoUrl}
            alt={userProfile.name}
            sx={{ width: 120, height: 120 }}
          />
        </Box>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" align="center" gutterBottom>
                {userProfile.name}
                {!isEditing && (
                  <IconButton onClick={handleEdit} sx={{ ml: 2 }}>
                    <EditIcon />
                  </IconButton>
                )}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>Father's Name:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="fatherName"
                  value={userProfile.fatherName}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile.fatherName}</Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>Date of Birth:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  type="date"
                  name="dob"
                  value={userProfile.dob}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile.dob}</Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>Enrollment No:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="enrollmentNo"
                  value={userProfile.enrollmentNo}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile.enrollmentNo}</Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>WRN:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="wrn"
                  value={userProfile.wrn}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile.wrn}</Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>Mobile No:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="mobile"
                  value={userProfile.mobile}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile.mobile}</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>Address:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="address"
                  value={userProfile.address}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile.address}</Typography>
              )}
            </Grid>
          </Grid>
          {isEditing && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button variant="contained" onClick={handleSave}>
                Save Changes
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
