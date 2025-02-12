// // src/pages/Student1.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { onAuthStateChanged } from "firebase/auth"; // Import Firebase auth
// import { auth } from "../firebaseConfig"; // Ensure you configure Firebase correctly
// import "../styles/Student1.css";

// const Student1 = () => {
//   const [studentList, setStudentList] = useState([]);
//   const [currentStudent, setCurrentStudent] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [userProfile, setUserProfile] = useState(null);

//   const API_URL =
//     "https://college-fde10-default-rtdb.firebaseio.com/student_list.json";

//   // Fetch all students
//   const fetchStudentList = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(API_URL);
//       const data = response.data || {};
//       const formattedData = Object.keys(data)
//         .map((key) => ({
//           ...data[key],
//           id: key,
//         }))
//         .sort((a, b) => parseInt(a.sr) - parseInt(b.sr)); // Sort by sr
//       setStudentList(formattedData);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch student list", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch user profile if logged in
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         onAuthStateChanged(auth, async (user) => {
//           if (user) {
//             // User is logged in
//             const loggedInUserEmail = user.email;

//             // Fetch all students
//             const response = await axios.get(API_URL);
//             const studentsData = response.data || {};

//             // Match the logged-in user's email with student data
//             const matchedStudent = Object.entries(studentsData).find(
//               ([_, student]) => student.email === loggedInUserEmail
//             );

//             if (matchedStudent) {
//               const [id, details] = matchedStudent;
//               setUserProfile({ id, ...details }); // Set the user profile data
//             } else {
//               Swal.fire({
//                 title: "Error",
//                 text: "No profile found for this user.",
//                 icon: "error",
//                 confirmButtonText: "OK",
//               });
//             }
//           } else {
//             Swal.fire({
//               title: "Error",
//               text: "User is not logged in.",
//               icon: "error",
//               confirmButtonText: "OK",
//             });
//           }
//         });
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserData();
//     fetchStudentList();
//   }, []);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="Student1-container">
//       <h2>Welcome to Student Portal</h2>
//       {userProfile ? (
//         <div className="current-student-details">
//           <h3>Your Profile</h3>
//           <table>
//             <tbody>
//               <tr>
//                 <td>SR. No.</td>
//                 <td>{userProfile.sr}</td>
//               </tr>
//               <tr>
//                 <td>EN. No.</td>
//                 <td>{userProfile.en}</td>
//               </tr>
//               <tr>
//                 <td>Roll No.</td>
//                 <td>{userProfile.rollNo}</td>
//               </tr>
//               <tr>
//                 <td>WRN</td>
//                 <td>{userProfile.wrn}</td>
//               </tr>
//               <tr>
//                 <td>Name</td>
//                 <td>{userProfile.name}</td>
//               </tr>
//               <tr>
//                 <td>Father's Name</td>
//                 <td>{userProfile.fathername}</td>
//               </tr>
//               <tr>
//                 <td>Email</td>
//                 <td>{userProfile.email}</td>
//               </tr>
//               <tr>
//                 <td>Gender</td>
//                 <td>{userProfile.gender}</td>
//               </tr>
//               <tr>
//                 <td>Mobile No.</td>
//                 <td>{userProfile.mobile}</td>
//               </tr>
//               <tr>
//                 <td>Address</td>
//                 <td>{userProfile.address}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div>No profile data available</div>
//       )}

//       <h2>All Students</h2>
//       <div className="table-responsive">
//         <table>
//           <thead>
//             <tr>
//               <th>SR. No.</th>
//               <th>Roll No.</th>
//               <th>Name</th>
//               <th>Gender</th>
//             </tr>
//           </thead>
//           <tbody>
//             {studentList.map((student, index) => (
//               <tr key={student.id}>
//                 <td data-label="SR. No.">{index + 1}</td> {/* SR. No. generated as index + 1 */}
//                 <td data-label="Roll No.">{student.rollNo}</td>
//                 <td data-label="Name">{student.name}</td>
//                 <td data-label="Gender">{student.gender}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Student1;

// src/pages/Student1.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase auth
import { auth } from "../firebaseConfig"; // Ensure you configure Firebase correctly
import "../styles/Student1.css";

const Student1 = () => {
  const [studentList, setStudentList] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const API_URL =
    "https://college-fde10-default-rtdb.firebaseio.com/student_list.json";

  // Fetch all students
  const fetchStudentList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      const data = response.data || {};
      const formattedData = Object.keys(data)
        .map((key) => ({
          ...data[key],
          id: key,
        }))
        .sort((a, b) => parseInt(a.sr) - parseInt(b.sr)); // Sort by sr
      setStudentList(formattedData);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch student list", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user profile if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            // User is logged in
            const loggedInUserEmail = user.email;

            // Fetch all students
            const response = await axios.get(API_URL);
            const studentsData = response.data || {};

            // Match the logged-in user's email with student data
            const matchedStudent = Object.entries(studentsData).find(
              ([_, student]) => student.email === loggedInUserEmail
            );

            if (matchedStudent) {
              const [id, details] = matchedStudent;
              setUserProfile({ id, ...details }); // Set the user profile data
            } else {
              Swal.fire({
                title: "Error",
                text: "No profile found for this user.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          } else {
            Swal.fire({
              title: "Error",
              text: "User is not logged in.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchStudentList();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Student1-container">
      <h2>Welcome to Student Portal</h2>
      {userProfile ? (
        <div className="current-student-details">
          <h3>Details Of {userProfile.name}</h3>
          <table>
            <tbody>
              <tr>
                <td>SR. No.</td>
                <td>{userProfile.sr}</td>
              </tr>
              <tr>
                <td>EN. No.</td>
                <td>{userProfile.en}</td>
              </tr>
              <tr>
                <td>Roll No.</td>
                <td>{userProfile.rollNo}</td>
              </tr>
              <tr>
                <td>WRN</td>
                <td>{userProfile.wrn}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{userProfile.name}</td>
              </tr>
              <tr>
                <td>Father's Name</td>
                <td>{userProfile.fathername}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{userProfile.email}</td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>{userProfile.gender}</td>
              </tr>
              <tr>
                <td>Mobile No.</td>
                <td>{userProfile.mobile}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{userProfile.address}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default Student1;
