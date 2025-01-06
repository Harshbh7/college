// src/pages/Login.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Grid,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const Login = ({ onLogin, setUserData }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      onLogin();
      setUserData(user); // Set user data (email, etc.) to be passed to ProfilePage
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      alert('Invalid credentials. Please try again.');
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      onLogin();
      setUserData(user); // Set user data (email, etc.) to be passed to ProfilePage
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      alert('Google sign-in failed. Please try again.');
      console.error(error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('Password reset email sent! Check your inbox.');
      setResetDialogOpen(false);
    } catch (error) {
      alert('Failed to send reset email. Please try again.');
      console.error(error);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', bgcolor: '#f5f5f5' }}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            padding: 3,
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" align="center" sx={{ marginBottom: 3 }}>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginBottom: 2 }}>
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleGoogleSignIn}
              sx={{ marginBottom: 2 }}
            >
              Sign in with Google
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
              <Link
                href="#"
                variant="body2"
                color="primary"
                underline="hover"
                onClick={() => setResetDialogOpen(true)}
                sx={{ fontSize: '0.9rem', marginBottom: 1 }}
              >
                Forgot Password?
              </Link>
              <Link
                href="/signup"
                variant="body2"
                color="primary"
                underline="hover"
                sx={{ fontSize: '0.9rem' }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </form>
        </Box>
      </Grid>

      {/* Password Reset Dialog */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleForgotPassword} color="primary">
            Send Reset Email
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Login;
