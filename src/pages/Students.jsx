//src/pages/Students.jsx
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
    gender: "",
    mobile: "",
    address: "",
  });

  const API_URL = "https://college-fde10-default-rtdb.firebaseio.com/student_list.json";

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
        .sort((a, b) => parseInt(a.sr) - parseInt(b.sr));
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
      gender: "",
      mobile: "",
      address: "",
    });
    setIsModalOpen(true);
  };

  const addStudent = async () => {
    try {
      const maxSr = students.reduce((max, student) => Math.max(max, parseInt(student.sr) || 0), 0);
      const newStudent = { ...studentForm, sr: maxSr + 1 };
      const response = await axios.post(API_URL, newStudent);
      setStudents((prev) => [...prev, { ...newStudent, id: response.data.name }]);
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
      gender: student.gender || "",
      mobile: student.mobile || "",
      address: student.address || "",
    });
    setIsModalOpen(true);
  };

  const updateStudent = async () => {
    try {
      const updatedStudent = { ...studentForm };
      await axios.put(`${API_URL.replace(".json", `/${currentStudentId}.json`)}`, updatedStudent);
      setStudents((prev) =>
        prev.map((student) =>
          student.id === currentStudentId ? { ...updatedStudent, id: currentStudentId } : student
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
    const newWindow = window.open("", "Print", "width=800,height=600");
    newWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          ${tableContent}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="students-container">
      <Button onClick={handleAdd} startIcon={<AddIcon />}>Add Student</Button>
      <Button onClick={handlePrint} startIcon={<PrintIcon />}>Print</Button>
      <table>
        <thead>
          <tr>
            <th>SR</th>
            <th>EN</th>
            <th>Roll No</th>
            <th>WRN</th>
            <th>Name</th>
            <th>Father Name</th>
            <th>Gender</th>
            <th>Mobile</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.sr}</td>
              <td>{student.en}</td>
              <td>{student.rollNo}</td>
              <td>{student.wrn}</td>
              <td>{student.name}</td>
              <td>{student.fathername}</td>
              <td>{student.gender}</td>
              <td>{student.mobile}</td>
              <td>{student.address}</td>
              <td>
                <Button onClick={() => handleEdit(student)} startIcon={<EditIcon />}>Edit</Button>
                <Button onClick={() => handleDelete(student.id)} startIcon={<DeleteIcon />}>Delete</Button>
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
