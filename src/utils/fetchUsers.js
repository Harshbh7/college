// import { database, ref, onValue } from "../firebaseConfig";

// export const fetchUsers = (setUsers) => {
//   const usersRef = ref(database, "student_list");

//   onValue(usersRef, (snapshot) => {
//     if (snapshot.exists()) {
//       const usersData = snapshot.val();
//       const usersArray = Object.entries(usersData).map(([id, data]) => ({
//         id,
//         name: data.name || "Unknown",
//         avatar: `https://i.pravatar.cc/150?u=${id}`, // Dummy avatar
//       }));
//       setUsers(usersArray);
//     } else {
//       setUsers([]);
//     }
//   });
// };

// src/utils/fetchUsers.js
import { database } from "../firebaseConfig"; // Import Firebase database instance
import { ref, onValue } from "firebase/database"; // Import required Firebase functions

export const fetchUsers = (setUsers) => {
  const usersRef = ref(database, "student_list"); // Reference to the "users" node in Firebase

  onValue(usersRef, (snapshot) => {
    if (snapshot.exists()) {
      const users = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        name: data.name || "Unknown User", // Default if name is missing
        avatar: data.photoUrl || "https://via.placeholder.com/150", // Default profile image
      }));
      setUsers(users);
    } else {
      setPeople([]); // No users found
    }
  }, {
    onlyOnce: false, // Keep listening for real-time updates
  });
};
