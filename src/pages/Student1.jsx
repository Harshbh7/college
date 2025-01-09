// src/pages/Student1.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/Student1.css";

const Student1 = () => {
  const [Student1, setStudent1] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL =
    "https://college-fde10-default-rtdb.firebaseio.com/student_list.json";

  // Fetch Student1 from API
  const fetchStudent1 = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      const data = response.data || {};
      const formattedData = Object.keys(data)
        .map((key) => ({
          ...data[key],
          id: key,
        }))
        .sort((a, b) => parseInt(a.sr) - parseInt(b.sr)); // Sort by `sr`
      setStudent1(formattedData);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch Student1", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent1();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Student1-container">
      <h2>Student List</h2>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>SR. No.</th>
              <th>EN. No.</th>
              <th>Roll No.</th>
              <th>WRN</th>
              <th>Name</th>
              <th>Father's Name</th>
              <th>Gender</th>
              <th>Mobile No.</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {Student1.map((student) => (
              <tr key={student.id}>
                <td data-label="SR. No.">{student.sr}</td>
                <td data-label="EN. No.">{student.en}</td>
                <td data-label="Roll No.">{student.rollNo}</td>
                <td data-label="WRN">{student.wrn}</td>
                <td data-label="Name">{student.name}</td>
                <td data-label="Father's Name">{student.fathername}</td>
                <td data-label="Gender">{student.gender}</td>
                <td data-label="Mobile No.">{student.mobile}</td>
                <td data-label="Address">{student.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Student1;


