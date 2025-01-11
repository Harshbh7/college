// src/pages/Students.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import {
  AddCircleOutline as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import "../styles/Students.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [studentForm, setStudentForm] = useState({
    sr: "",
    en: "",
    rollNo: "",
    wrn: "",
    name: "",
    fathername: "",
    email: "",
    gender: "",
    mobile: "",
    address: "",
  });

  const API_URL =
    "https://college-fde10-default-rtdb.firebaseio.com/student_list.json";

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      const data = response.data || {};
      const formattedData = Object.keys(data)
        .map((key) => ({
          ...data[key],
          id: key,
        }))
        .sort((a, b) => parseInt(a.sr || 0) - parseInt(b.sr || 0));
      setStudents(formattedData);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch students", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setIsEditing(false);
    setStudentForm({
      sr: "",
      en: "",
      rollNo: "",
      wrn: "",
      name: "",
      fathername: "",
      email: "",
      gender: "",
      mobile: "",
      address: "",
    });
    setIsModalOpen(true);
  };

  const addStudent = async () => {
    try {
      const maxSr = students.reduce(
        (max, student) => Math.max(max, parseInt(student.sr) || 0),
        0
      );
      const newStudent = { ...studentForm, sr: maxSr + 1 };
      const response = await axios.post(API_URL, newStudent);
      setStudents((prev) => [
        ...prev,
        { ...newStudent, id: response.data.name },
      ]);
      Swal.fire("Success", "Student added successfully", "success");
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire("Error", "Failed to add student", "error");
    }
  };

  const handleEdit = (student) => {
    setIsEditing(true);
    setCurrentStudentId(student.id);
    setStudentForm({
      sr: student.sr || "",
      en: student.en || "",
      rollNo: student.rollNo || "",
      wrn: student.wrn || "",
      name: student.name || "",
      fathername: student.fathername || "",
      email: student.email || "",
      gender: student.gender || "",
      mobile: student.mobile || "",
      address: student.address || "",
    });
    setIsModalOpen(true);
  };

  const updateStudent = async () => {
    try {
      const updatedStudent = { ...studentForm };
      await axios.put(
        `${API_URL.replace(".json", `/${currentStudentId}.json`)}`,
        updatedStudent
      );
      setStudents((prev) =>
        prev.map((student) =>
          student.id === currentStudentId
            ? { ...updatedStudent, id: currentStudentId }
            : student
        )
      );
      Swal.fire("Success", "Student updated successfully", "success");
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire("Error", "Failed to update student", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL.replace(".json", `/${id}.json`)}`);
          setStudents((prev) => prev.filter((student) => student.id !== id));
          Swal.fire("Deleted!", "Student has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete student", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handlePrint = () => {
    const tableContent = document.querySelector(".students-container table").outerHTML;
  
    // Create a hidden iframe for printing
    const printWindow = document.createElement("iframe");
    printWindow.style.position = "absolute";
    printWindow.style.top = "-10000px"; // Hide the iframe
    document.body.appendChild(printWindow);
  
    const printDocument = printWindow.contentDocument || printWindow.contentWindow.document;
    printDocument.open();
    printDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Students List</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Students List</h1>
          ${tableContent}
        </body>
      </html>
    `);
    printDocument.close();
  
    // Trigger print
    printWindow.contentWindow.focus();
    printWindow.contentWindow.print();
  
    // Clean up
    setTimeout(() => document.body.removeChild(printWindow), 1000);
  };
  
  
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="students-container">
      <Button onClick={handleAdd} startIcon={<AddIcon />}>
        Add Student
      </Button>
      <Button onClick={handlePrint} startIcon={<PrintIcon />}>
        Print
      </Button>
      <table>
      <thead>
          <tr>
            <th>SR</th>
            <th>EN</th>
            <th>Roll No</th>
            <th>WRN</th>
            <th>Name</th>
            <th>Father Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Mobile</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td data-label="SR">{student.sr}</td>
              <td data-label="EN">{student.en}</td>
              <td data-label="Roll No">{student.rollNo}</td>
              <td data-label="WRN">{student.wrn}</td>
              <td data-label="Name">{student.name}</td>
              <td data-label="Father Name">{student.fathername}</td>
              <td data-label="Email">{student.email}</td>
              <td data-label="Gender">{student.gender}</td>
              <td data-label="Mobile">{student.mobile}</td>
              <td data-label="Address">{student.address}</td>
              <td data-label="Actions">
                <Button
                  onClick={() => handleEdit(student)}
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(student.id)}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
      <DialogTitle>{isEditing ? "Edit Student" : "Add Student"}</DialogTitle>
        <DialogContent>
          {Object.keys(studentForm).map((key) => (
            <TextField
              key={key}
              name={key}
              label={key.toUpperCase()}
              value={studentForm[key]}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              disabled={key === "sr"} // Disable editing for "sr"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={isEditing ? updateStudent : addStudent}>
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Students;
