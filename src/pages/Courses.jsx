// src/pages/Classes.jsx
import React, { useState } from 'react';
import { Button, Card, CardContent, CardMedia, Typography, Modal, Box, Grid, useMediaQuery } from '@mui/material';

const Classes = () => {
  const [open, setOpen] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState('');
  const [pdfPage, setPdfPage] = useState(34); // Default page to be displayed
  const isMobile = useMediaQuery('(max-width:600px)'); // Check if the viewport is mobile-sized

  const subjects = [
    {
      title: 'Network Security',
      image: 'https://www.logsign.com/uploads/ensuring_network_security_e34d6ce4bb.png',
      description: 'Learn about firewalls, encryption, and secure communications.',
      syllabus: 'Firewalls, Encryption, Cryptography, Secure Communication',
      pdfUrl: 'https://dbrau.ac.in/wp-content/uploads/2024/01/BCA-2023.pdf', // PDF link for Network Security
      page: 34,
    },
    {
      title: 'Visual Basic .NET',
      image: 'https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/vb-header.png',
      description: 'Explore application development with VB.NET.',
      syllabus: 'VB.NET Syntax, Windows Forms, Database Integration',
      pdfUrl: 'https://dbrau.ac.in/wp-content/uploads/2024/01/BCA-2023.pdf',
      page: 35,
    },
    {
      title: 'Computer Network',
      image: 'https://3.bp.blogspot.com/-sr5nrVMP8gQ/WrPUIcvWWHI/AAAAAAAALIE/apHAJwImTkkE3Ey4-TF4IkO8iItWBfMGQCLcBGAs/s1600/dccn.png',
      description: 'Understand networking protocols, topologies, and applications.',
      syllabus: 'OSI Model, TCP/IP, Networking Devices, Network Topologies',
      pdfUrl: 'https://dbrau.ac.in/wp-content/uploads/2024/01/BCA-2023.pdf',
      page: 37,
    },
    {
      title: 'System Analysis & Design',
      image: 'https://image.slidesharecdn.com/systemanalysisanddesign-151009061521-lva1-app6891/95/system-analysis-and-design-1-638.jpg?cb=1444371405',
      description: 'Learn techniques to analyze and design systems.',
      syllabus: 'System Life Cycle, Feasibility Study, DFD, ER Diagrams',
      pdfUrl: 'https://dbrau.ac.in/wp-content/uploads/2024/01/BCA-2023.pdf',
      page: 39,
    },
    {
      title: 'System Design & Algorithm',
      image: 'https://online.stanford.edu/sites/default/files/styles/embedded_large/public/2018-03/engineering-computer-science-algorithms-design-analysis_soe-ycsalgorithms.png?itok=9li5BBeK',
      description: 'Master design principles and algorithms.',
      syllabus: 'Sorting Algorithms, Design Patterns, Complexity Analysis',
      pdfUrl: 'https://dbrau.ac.in/wp-content/uploads/2024/01/BCA-2023.pdf',
      page: 39,
    },
  ];

  const labs = [
    {
      title: 'Lab (Practical)',
      image: 'https://th.bing.com/th/id/OIP.642AhjV3eOD4gHBSSsTEqAHaE8?rs=1&pid=ImgDetMain',
      description: 'Practical experiments on various programming and system design topics.',
      syllabus: 'Programming Practice, Network Simulation, Database Operations',
    },
  ];

  const handleOpen = (syllabus, pdfUrl = '', page = 34) => {
    setSelectedSyllabus(syllabus);
    setPdfPage(page);
    if (pdfUrl) {
      window.open(pdfUrl, '_blank'); // Open the PDF in a new tab
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSyllabus('');
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px' }}>
        Classes
      </Typography>
      <Grid container spacing={3}>
        {subjects.map((subject, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '10px' }}>
              <CardMedia
                component="img"
                height="200"
                image={subject.image}
                alt={subject.title}
                style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
              />
              <CardContent>
                <Typography variant="h5" component="div" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  {subject.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '10px' }}>
                  {subject.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '10px', width: '100%' }}
                  onClick={() => handleOpen(subject.syllabus, subject.pdfUrl, subject.page)}
                >
                  Show More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" style={{ textAlign: 'center', margin: '40px 0 20px' }}>
        Labs
      </Typography>
      <Grid container spacing={3}>
        {labs.map((lab, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '10px' }}>
              <CardMedia
                component="img"
                height="200"
                image={lab.image}
                alt={lab.title}
                style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
              />
              <CardContent>
                <Typography variant="h5" component="div" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  {lab.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '10px' }}>
                  {lab.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '10px', width: '100%' }}
                  onClick={() => handleOpen(lab.syllabus)}
                >
                  Show More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={open} onClose={handleClose} aria-labelledby="syllabus-title" aria-describedby="syllabus-content">
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: isMobile ? '10px' : '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            outline: 'none',
            width: isMobile ? '90%' : '60%',
            height: isMobile ? '70%' : '80%',
          }}
        >
          <Typography id="syllabus-title" variant="h6" component="h2" style={{ fontWeight: 'bold' }}>
            Syllabus
          </Typography>
          {selectedSyllabus && (
            <Typography id="syllabus-content" style={{ marginTop: '10px' }}>
              {selectedSyllabus}
            </Typography>
          )}
          <Button
            variant="outlined"
            style={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Classes;
