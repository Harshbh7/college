// src/pages/Exams.jsx
import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { EventNote, Description, QueryStats, Payment, School, Cloud, MenuBook } from "@mui/icons-material";

const Exams = () => {
  const openLink = (url, width = 600, height = 800) => {
    window.open(url, "_blank", `width=${width},height=${height}`);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        📚 Exams & Portals
      </Typography>

      {/* Grid Layout for Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3, width: "90%" }}>
        {[
          { title: "Exam Results", icon: <QueryStats sx={{ fontSize: 40, color: "#4CAF50", mb: 1 }} />, color: "success", url: "https://result2024.agrauniv.online/", buttonText: "Check Results" },
          { title: "Exam Datesheets", icon: <Description sx={{ fontSize: 40, color: "#2196F3", mb: 1 }} />, color: "primary", url: "https://dbrau.ac.in/wp-content/uploads/2024/05/BCA-II-IV-Exam-Scheme-May-June-2024-Revised.pdf", buttonText: "July Datesheet", extraButton: { url: "https://dbrau.ac.in/wp-content/uploads/2024/12/BCA-IIIIV-Semester-DEC-2024.pdf", text: "December Datesheet", color: "secondary" } },
          { title: "Fee Payment Portal", icon: <Payment sx={{ fontSize: 40, color: "#FF9800", mb: 1 }} />, color: "warning", url: "https://admission.agracollegeagra.org.in/2024/#/login", buttonText: "Open Fee Portal" },
          { title: "Samarth Portal", icon: <School sx={{ fontSize: 40, color: "#673AB7", mb: 1 }} />, color: "info", url: "https://dbrau.samarth.edu.in/index.php/site/login", buttonText: "Open Samarth Portal" },
          { title: "DigiLocker Portal", icon: <Cloud sx={{ fontSize: 40, color: "#009688", mb: 1 }} />, color: "success", url: "https://accounts.digilocker.gov.in/signin/smart_v2/ed1033ecfda61f08197eb6360c708ed73640a20b9cc84c402d65633f27f2d52a--en", buttonText: "Open DigiLocker" },
          { title: "BCA Syllabus", icon: <MenuBook sx={{ fontSize: 40, color: "#E91E63", mb: 1 }} />, color: "secondary", url: "https://dbrau.ac.in/wp-content/uploads/2024/01/BCA-2023.pdf", buttonText: "View Syllabus" }
        ].map((item, index) => (
          <Card key={index} sx={{ height: 200, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: 3, transition: "transform 0.3s", '&:hover': { transform: "scale(1.05)" } }}>
            <CardContent sx={{ textAlign: "center" }}>
              {item.icon}
              <Typography variant="h6" fontWeight="bold">{item.title}</Typography>
              <Button variant="contained" color={item.color} onClick={() => openLink(item.url)} sx={{ mt: 1 }}>
                {item.buttonText}
              </Button>
              {item.extraButton && (
                <Button variant="contained" color={item.extraButton.color} onClick={() => openLink(item.extraButton.url)} sx={{ mt: 1, ml: 1 }}>
                  {item.extraButton.text}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Exams;
