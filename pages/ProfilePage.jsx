// src/pages/ProfilePage.jsx
// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const response = await axios.get(`${DATABASE_URL}student_list.json`);
          const studentsData = response.data;

          const loggedInUserEmail = user.email;
          const studentKey = Object.keys(studentsData).find(
            (key) => studentsData[key].email === loggedInUserEmail
          );

          if (studentKey) {
            setUserProfile({ ...studentsData[studentKey], id: studentKey });
          } else {
            Swal.fire("No Profile", "No profile found for this user.", "warning");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Swal.fire("Error", "Failed to fetch user data.", "error");
        }
      } else {
        Swal.fire("Not Logged In", "User is not logged in.", "info");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!selectedImage) return null;

    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      Swal.fire("Error", "Failed to upload image.", "error");
      return null;
    }
  };

  const handleSave = async () => {
    setIsEditing(false);

    let imageUrl = userProfile.photoUrl;
    if (selectedImage) {
      imageUrl = await uploadImageToCloudinary();
    }

    const updatedProfile = { ...userProfile, photoUrl: imageUrl };

    try {
      await axios.put(
        `${DATABASE_URL}student_list/${userProfile.id}.json`,
        updatedProfile
      );
      setUserProfile(updatedProfile);
      setSelectedImage(null);

      Swal.fire("Success", "Profile updated successfully!", "success");

      window.dispatchEvent(new Event("profileImageUpdated"));
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire("Error", "Failed to update profile.", "error");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Card sx={{ maxWidth: 600, width: "100%", padding: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar
            src={userProfile?.photoUrl || "https://via.placeholder.com/150"}
            alt={userProfile?.name || "User"}
            sx={{ width: 120, height: 120 }}
          />
        </Box>
        <CardContent>
          {isEditing && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current.click()}
              >
                Upload Image
              </Button>
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" align="center" gutterBottom>
                {userProfile?.name}
                {!isEditing && (
                  <IconButton onClick={() => setIsEditing(true)} sx={{ ml: 2 }}>
                    <EditIcon />
                  </IconButton>
                )}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Father's Name:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="fathername"
                  value={userProfile?.fathername || ""}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, fathername: e.target.value })
                  }
                />
              ) : (
                <Typography>{userProfile?.fathername}</Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Mother's Name:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="mothername"
                  value={userProfile?.mothername || ""}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, mothername: e.target.value })
                  }
                />
              ) : (
                <Typography>{userProfile?.mothername}</Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Date of Birth:</strong>
              </Typography>
              <Typography>{userProfile?.dob}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Enrollment No:</strong>
              </Typography>
              <Typography>{userProfile?.en}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>WRN:</strong>
              </Typography>
              <Typography>{userProfile?.wrn}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Mobile No:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="mobile"
                  value={userProfile?.mobile || ""}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, mobile: e.target.value })
                  }
                />
              ) : (
                <Typography>{userProfile?.mobile}</Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>E-Mail:</strong>
              </Typography>
              <Typography>{userProfile?.email || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                <strong>Address:</strong>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="text"
                  value={userProfile?.address || ""}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, address: e.target.value })
                  }
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
