// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Avatar, Grid, TextField, Button, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { auth } from "../firebaseConfig"; // import firebase config
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // User profile data
  const [loading, setLoading] = useState(true); // Loading state to handle API call

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Listen for user authentication state
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Fetch user data from the database if user is logged in
            const response = await axios.get(
              `https://college-fde10-default-rtdb.firebaseio.com/student_data.json`
            );
            const studentsData = response.data;

            // Find the student matching the email of the logged-in user
            const loggedInUserEmail = user.email;
            const student = Object.values(studentsData).find(student => student.email === loggedInUserEmail);

            if (student) {
              setUserProfile(student); // Set the user data if found
            } else {
              alert("No profile found for this user.");
            }
          } else {
            alert("User is not logged in.");
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add logic to save the updated user data if needed
    console.log("Profile saved", userProfile);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Card sx={{ maxWidth: 600, width: "100%", padding: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar
            src={userProfile?.photoUrl || "https://via.placeholder.com/150"} // Default photo if none available
            alt={userProfile?.name || "User"}
            sx={{ width: 120, height: 120 }}
          />
        </Box>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" align="center" gutterBottom>
                {userProfile?.name}
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
                  name="fathername"
                  value={userProfile?.fathername || ""}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile?.fathername}</Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>Mother Name:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="mothername"
                  value={userProfile?.mothername || ""}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile?.mothername}</Typography>
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
                  value={userProfile?.dob || ""}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile?.dob}</Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>Enrollment No:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="en"
                  value={userProfile?.en || ""}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile?.en}</Typography>
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
                  value={userProfile?.wrn || ""}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile?.wrn}</Typography>
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
                  value={userProfile?.mobile || ""}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile?.mobile}</Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>E-Mail:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="email"
                  value={userProfile?.email || ""}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile?.email}</Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>Address:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="address"
                  value={userProfile?.address || ""}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{userProfile?.address}</Typography>
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
