// // src/pages/ProfilePage.jsx
// import React, { useState, useEffect } from "react";
// import { Box, Card, CardContent, Typography, Avatar, Grid, TextField, Button, IconButton } from "@mui/material";
// import EditIcon from '@mui/icons-material/Edit';
// import { auth } from "../firebaseConfig"; // import firebase config
// import { onAuthStateChanged } from "firebase/auth";
// import axios from "axios";

// const ProfilePage = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [userProfile, setUserProfile] = useState(null); // User profile data
//   const [loading, setLoading] = useState(true); // Loading state to handle API call

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // Listen for user authentication state
//         onAuthStateChanged(auth, async (user) => {
//           if (user) {
//             // Fetch user data from the database if user is logged in
//             const response = await axios.get(
//               `https://college-fde10-default-rtdb.firebaseio.com/student_list.json`
//             );
//             const studentsData = response.data;

//             // Find the student matching the email of the logged-in user
//             const loggedInUserEmail = user.email;
//             const student = Object.values(studentsData).find(student => student.email === loggedInUserEmail);

//             if (student) {
//               setUserProfile(student); // Set the user data if found
//             } else {
//               alert("No profile found for this user.");
//             }
//           } else {
//             alert("User is not logged in.");
//           }
//           setLoading(false);
//         });
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setLoading(false);
//       }
//     };

//     fetchUserData(); // Call the function to fetch user data
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserProfile((prevProfile) => ({
//       ...prevProfile,
//       [name]: value,
//     }));
//   };

//   const handleSave = () => {
//     setIsEditing(false);
//     // Add logic to save the updated user data if needed
//     console.log("Profile saved", userProfile);
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//       <Card sx={{ maxWidth: 600, width: "100%", padding: 2 }}>
//         <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
//           <Avatar
//             src={userProfile?.photoUrl || "https://via.placeholder.com/150"} // Default photo if none available
//             alt={userProfile?.name || "User"}
//             sx={{ width: 120, height: 120 }}
//           />
//         </Box>
//         <CardContent>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Typography variant="h5" align="center" gutterBottom>
//                 {userProfile?.name}
//                 {!isEditing && (
//                   <IconButton onClick={handleEdit} sx={{ ml: 2 }}>
//                     <EditIcon />
//                   </IconButton>
//                 )}
//               </Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle1" color="textSecondary">
//                 <strong>Father's Name:</strong>
//               </Typography>
//               {isEditing ? (
//                 <TextField
//                   fullWidth
//                   name="fathername"
//                   value={userProfile?.fathername || ""}
//                   onChange={handleChange}
//                 />
//               ) : (
//                 <Typography>{userProfile?.fathername}</Typography>
//               )}
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle1" color="textSecondary">
//                 <strong>Mother Name:</strong>
//               </Typography>
//               {isEditing ? (
//                 <TextField
//                   fullWidth
//                   name="mothername"
//                   value={userProfile?.mothername || ""}
//                   onChange={handleChange}
//                 />
//               ) : (
//                 <Typography>{userProfile?.mothername}</Typography>
//               )}
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle1" color="textSecondary">
//                 <strong>Date of Birth:</strong>
//               </Typography>
//               {isEditing ? (
//                 <TextField
//                   fullWidth
//                   type="date"
//                   name="dob"
//                   value={userProfile?.dob || ""}
//                   onChange={handleChange}
//                 />
//               ) : (
//                 <Typography>{userProfile?.dob}</Typography>
//               )}
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle1" color="textSecondary">
//                 <strong>Enrollment No:</strong>
//               </Typography>
//               {isEditing ? (
//                 <TextField
//                   fullWidth
//                   name="en"
//                   value={userProfile?.en || ""}
//                   onChange={handleChange}
//                 />
//               ) : (
//                 <Typography>{userProfile?.en}</Typography>
//               )}
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle1" color="textSecondary">
//                 <strong>WRN:</strong>
//               </Typography>
//               {isEditing ? (
//                 <TextField
//                   fullWidth
//                   name="wrn"
//                   value={userProfile?.wrn || ""}
//                   onChange={handleChange}
//                 />
//               ) : (
//                 <Typography>{userProfile?.wrn}</Typography>
//               )}
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle1" color="textSecondary">
//                 <strong>Mobile No:</strong>
//               </Typography>
//               {isEditing ? (
//                 <TextField
//                   fullWidth
//                   name="mobile"
//                   value={userProfile?.mobile || ""}
//                   onChange={handleChange}
//                 />
//               ) : (
//                 <Typography>{userProfile?.mobile}</Typography>
//               )}
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle1" color="textSecondary">
//                 <strong>E-Mail:</strong>
//               </Typography>
//               {isEditing ? (
//                 <TextField
//                   fullWidth
//                   name="email"
//                   value={userProfile?.email || ""}
//                   onChange={handleChange}
//                 />
//               ) : (
//                 <Typography>{userProfile?.email}</Typography>
//               )}
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="subtitle1" color="textSecondary">
//                 <strong>Address:</strong>
//               </Typography>
//               {isEditing ? (
//                 <TextField
//                   fullWidth
//                   name="address"
//                   value={userProfile?.address || ""}
//                   onChange={handleChange}
//                 />
//               ) : (
//                 <Typography>{userProfile?.address}</Typography>
//               )}
//             </Grid>
//           </Grid>
//           {isEditing && (
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//               <Button variant="contained" onClick={handleSave}>
//                 Save Changes
//               </Button>
//             </Box>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default ProfilePage;


import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // Import Camera icon
import { auth, database } from "../firebaseConfig";
import { ref, update, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dm23icoaz/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const snapshot = await get(ref(database, "student_list"));
            if (snapshot.exists()) {
              const studentsData = snapshot.val();
              const studentKey = Object.keys(studentsData).find(
                (key) => studentsData[key].email === user.email
              );

              if (studentKey) {
                setUserProfile({ ...studentsData[studentKey], key: studentKey });
              } else {
                console.error("No profile found for this user.");
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
        setLoading(false);
      });
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return null;
    
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      let newImageUrl = userProfile.photoUrl;
      if (selectedImage) {
        newImageUrl = await uploadImage();
      }
      if (userProfile.key) {
        const updatedProfile = { ...userProfile, photoUrl: newImageUrl };
        await update(ref(database, `student_list/${userProfile.key}`), updatedProfile);
        setUserProfile(updatedProfile);
        setImagePreview(null);

        // ✅ Show Success Alert
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your profile has been successfully updated.",
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);

      // ❌ Show Error Alert
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong while updating your profile. Please try again.",
      });
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Card sx={{ maxWidth: 600, width: "100%", padding: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={imagePreview || userProfile?.photoUrl || "https://via.placeholder.com/150"}
              alt={userProfile?.name || "User"}
              sx={{ width: 120, height: 120 }}
            />
            {isEditing && (
              <IconButton
              component="label"
              sx={{
                position: "absolute",
                top: "80%",
                left: "80%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: 1,
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Keep the background color unchanged on hover
                }
              }}
            >
              <CameraAltIcon sx={{ color: "white" }} />
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </IconButton>
            
            )}
          </Box>
        </Box>

        <CardContent>
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

            {[ 
              { label: "Father's Name", name: "fathername" },
              { label: "Mother's Name", name: "mothername" },
              { label: "Date of Birth (DOB)", name: "dob", type: "date" },
              { label: "Enrollment Number", name: "en" },
              { label: "WRN Number", name: "wrn" },
              { label: "Mobile Number", name: "mobile" },
              { label: "Address", name: "address" }
            ].map((field, index) => (
              <Grid item xs={6} key={index}>
                <Typography variant="subtitle1" color="textSecondary">
                  <strong>{field.label}:</strong>
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    name={field.name}
                    type={field.type || "text"}
                    value={userProfile?.[field.name] || ""}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label}`}
                  />
                ) : (
                  <Typography>{userProfile?.[field.name] || "N/A"}</Typography>
                )}
              </Grid>
            ))}

            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                <strong>Email:</strong>
              </Typography>
              <Typography>{userProfile?.email}</Typography>
            </Grid>
          </Grid>

          {isEditing && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button variant="contained" onClick={handleSave}>Save Changes</Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
