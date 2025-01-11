// import React, { useState } from 'react';
// import { Box, TextField, Button, Typography, Grid, InputAdornment, IconButton, Link, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { createUserWithEmailAndPassword } from 'firebase/auth';  // Firebase import for auth
// import { auth } from '../firebaseConfig';  // Firebase auth import
// import { getDatabase, ref, set, get, child, update } from 'firebase/database';  // Firebase Realtime Database import

// const Signup = () => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [gender, setGender] = useState('Male');
//   const [dob, setDob] = useState('');
//   const [wrn, setWrn] = useState('');
//   const [enrollmentNo, setEnrollmentNo] = useState('');
//   const [address, setAddress] = useState('');
//   const [motherName, setMotherName] = useState(''); // State for mother's name
//   const [fatherName, setFatherName] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState('');  // State for error messages
//   const navigate = useNavigate();

//   const handleClickShowPassword = () => setShowPassword(!showPassword);
//   const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if passwords match
//     if (password !== confirmPassword) {
//       setError("Passwords do not match!");
//       return;
//     }

//     try {
//       // Firebase create user with email and password
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);

//       // Firebase Realtime Database reference
//       const db = getDatabase();
//       const userId = userCredential.user.uid;  // Get user ID from Firebase Auth

//       // Get the current 'sr' value from the counter in Firebase
//       const srRef = ref(db, 'student_data/counter');
//       const snapshot = await get(srRef);

//       let sr = 1;  // Default starting value for 'sr'
//       if (snapshot.exists()) {
//         sr = snapshot.val() + 1;  // Increment the last 'sr' value by 1
//       }

//       // Write user data to Firebase Realtime Database
//       await set(ref(db, 'student_data/' + userId), {
//         name: `${firstName} ${lastName}`,
//         fathername: fatherName,  // Added father name
//         mothername: motherName,  // Added mother name
//         mobile: mobile,
//         email: email,
//         sr: sr,  // Assign the incremented 'sr'
//         dob: dob,
//         address: address,
//         wrn: wrn,
//         en: enrollmentNo,
//       });

//       // Update the 'sr' counter in Firebase
//       await update(ref(db, 'student_data'), {
//         counter: sr  // Update the counter to the new 'sr' value
//       });

//       // On successful signup, navigate to the login page
//       navigate('/login');
//     } catch (err) {
//       setError(err.message);  // Set error message on failed signup
//     }
//   };

//   return (
//     <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', bgcolor: '#f5f5f5' }}>
//       <Grid item xs={12} sm={6} md={4} lg={3}>
//         <Box
//           sx={{
//             backgroundColor: 'white',
//             borderRadius: 2,
//             padding: 3,
//             boxShadow: 3,
//             maxWidth: 400,  // Set a max width for a compact form
//             width: '100%',  // Ensure it doesn't stretch beyond max width
//           }}
//         >
//           <Typography variant="h5" align="center" sx={{ marginBottom: 3 }}>
//             Sign Up
//           </Typography>
//           {error && (
//             <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
//               {error}
//             </Typography>
//           )}
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="First Name"
//               variant="outlined"
//               fullWidth
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               sx={{ marginBottom: 2 }}
//               required
//             />
//             <TextField
//               label="Last Name"
//               variant="outlined"
//               fullWidth
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//               sx={{ marginBottom: 2 }}
//               required
//             />
//             <TextField
//               label="Email"
//               variant="outlined"
//               fullWidth
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               sx={{ marginBottom: 2 }}
//               required
//             />
//             <TextField
//               label="Mobile Number"
//               variant="outlined"
//               fullWidth
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               sx={{ marginBottom: 2 }}
//               required
//             />
//             {/* Gender radio buttons */}
//             <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
//               <RadioGroup
//                 row
//                 value={gender}
//                 onChange={(e) => setGender(e.target.value)}
//               >
//                 <FormControlLabel value="Male" control={<Radio />} label="Male" />
//                 <FormControlLabel value="Female" control={<Radio />} label="Female" />
//               </RadioGroup>
//             </FormControl>
//             <TextField
//               label="Date of Birth"
//               variant="outlined"
//               type="date"
//               fullWidth
//               value={dob}
//               onChange={(e) => setDob(e.target.value)}
//               sx={{ marginBottom: 2 }}
//               InputLabelProps={{ shrink: true }}
//               required
//             />
//             <TextField
//               label="WRN"
//               variant="outlined"
//               fullWidth
//               value={wrn}
//               onChange={(e) => setWrn(e.target.value)}
//               sx={{ marginBottom: 2 }}
//               required
//             />
//             <TextField
//               label="Enrollment No"
//               variant="outlined"
//               fullWidth
//               value={enrollmentNo}
//               onChange={(e) => setEnrollmentNo(e.target.value)}
//               sx={{ marginBottom: 2 }}
//               required
//             />
//             <TextField
//               label="Address"
//               variant="outlined"
//               fullWidth
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               sx={{ marginBottom: 2 }}
//               required
//             />
//             {/* Added Mother's Name Field */}
//             <TextField
//               label="Mother's Name"
//               variant="outlined"
//               fullWidth
//               value={motherName}
//               onChange={(e) => setMotherName(e.target.value)}
//               sx={{ marginBottom: 2 }}
//               required
//             />
//             <TextField
//               label="Father's Name"
//               variant="outlined"
//               fullWidth
//               value={fatherName}
//               onChange={(e) => setFatherName(e.target.value)}
//               sx={{ marginBottom: 2 }}
//               required
//             />
//             <TextField
//               label="Password"
//               variant="outlined"
//               type={showPassword ? 'text' : 'password'}
//               fullWidth
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               sx={{ marginBottom: 2 }}
//               required
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={handleClickShowPassword}>
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <TextField
//               label="Confirm Password"
//               variant="outlined"
//               type={showConfirmPassword ? 'text' : 'password'}
//               fullWidth
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               sx={{ marginBottom: 2 }}
//               required
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={handleClickShowConfirmPassword}>
//                       {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginBottom: 2 }}>
//               Sign Up
//             </Button>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Link href="/login" variant="body2" color="inherit">
//                 Already have an account? Login
//               </Link>
//             </Box>
//           </form>
//         </Box>
//       </Grid>
//     </Grid>
//   );
// };

// export default Signup;


import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, InputAdornment, IconButton, Link, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';  // Firebase import for auth
import { auth } from '../firebaseConfig';  // Firebase auth import
import { getDatabase, ref, set, get, child, update } from 'firebase/database';  // Firebase Realtime Database import

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [wrn, setWrn] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [address, setAddress] = useState('');
  const [motherName, setMotherName] = useState(''); // State for mother's name
  const [fatherName, setFatherName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');  // State for error messages
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Firebase create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Firebase Realtime Database reference
      const db = getDatabase();
      const userId = userCredential.user.uid;  // Get user ID from Firebase Auth

      // Get the current 'sr' value from the counter in Firebase
      const srRef = ref(db, 'student_list/counter');
      const snapshot = await get(srRef);

      let sr = 1;  // Default starting value for 'sr'
      if (snapshot.exists()) {
        sr = snapshot.val() + 1;  // Increment the last 'sr' value by 1
      }

      // Write user data to Firebase Realtime Database
      await set(ref(db, 'student_list/' + userId), {
        name: `${firstName} ${lastName}`,
        fathername: fatherName,  // Added father name
        mothername: motherName,  // Added mother name
        mobile: mobile,
        email: email,
        sr: sr,  // Assign the incremented 'sr'
        dob: dob,
        address: address,
        wrn: wrn,
        en: enrollmentNo,
      });

      // Update the 'sr' counter in Firebase
      await update(ref(db, 'student_list'), {
        counter: sr  // Update the counter to the new 'sr' value
      });

      // On successful signup, navigate to the login page
      navigate('/login');
    } catch (err) {
      setError(err.message);  // Set error message on failed signup
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
            maxWidth: 400,  // Set a max width for a compact form
            width: '100%',  // Ensure it doesn't stretch beyond max width
          }}
        >
          <Typography variant="h5" align="center" sx={{ marginBottom: 3 }}>
            Sign Up
          </Typography>
          {error && (
            <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={{ marginBottom: 2 }}
              required
            />
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
              label="Mobile Number"
              variant="outlined"
              fullWidth
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              sx={{ marginBottom: 2 }}
              required
            />
            {/* Gender radio buttons */}
            <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
              <RadioGroup
                row
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
            <TextField
              label="Date of Birth"
              variant="outlined"
              type="date"
              fullWidth
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              sx={{ marginBottom: 2 }}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="WRN"
              variant="outlined"
              fullWidth
              value={wrn}
              onChange={(e) => setWrn(e.target.value)}
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              label="Enrollment No"
              variant="outlined"
              fullWidth
              value={enrollmentNo}
              onChange={(e) => setEnrollmentNo(e.target.value)}
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              sx={{ marginBottom: 2 }}
              required
            />
            {/* Added Mother's Name Field */}
            <TextField
              label="Mother's Name"
              variant="outlined"
              fullWidth
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              label="Father's Name"
              variant="outlined"
              fullWidth
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
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
            <TextField
              label="Confirm Password"
              variant="outlined"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowConfirmPassword}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginBottom: 2 }}>
              Sign Up
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href="/login" variant="body2" color="inherit">
                Already have an account? Login
              </Link>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Signup;
