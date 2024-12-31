// src/pages/Classes.jsx
import React, { useState } from 'react';
import { Button, Card, CardContent, CardMedia, Typography, Modal, Box } from '@mui/material';

const Classes = () => {
  const [open, setOpen] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState('');
  const [pdfPage, setPdfPage] = useState(34); // Default page to be displayed
  const [numPages, setNumPages] = useState(null); // To handle number of pages in the PDF

  const subjects = [
    {
      title: 'Network Security',
      image: 'https://www.logsign.com/uploads/ensuring_network_security_e34d6ce4bb.png',
      description: 'Learn about firewalls, encryption, and secure communications.',
      syllabus: 'Firewalls, Encryption, Cryptography, Secure Communication',
      pdfUrl: 'https://dbrau.ac.in/wp-content/uploads/2024/01/BCA-2023.pdf', // PDF link for Network Security
      page: 34, // Specific page for Network Security
    },
    {
      title: 'Visual Basic .NET',
      image: 'https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/vb-header.png',
      description: 'Explore application development with VB.NET.',
      syllabus: 'VB.NET Syntax, Windows Forms, Database Integration',
      pdfUrl: 'https://dbrau.ac.in/wp-content/uploads/2024/01/BCA-2023.pdf', // PDF link for Visual Basic .NET
      page: 35, // Specific page for Visual Basic .NET
    },
    {
      title: 'Computer Network',
      image: 'https://3.bp.blogspot.com/-sr5nrVMP8gQ/WrPUIcvWWHI/AAAAAAAALIE/apHAJwImTkkE3Ey4-TF4IkO8iItWBfMGQCLcBGAs/s1600/dccn.png',
      description: 'Understand networking protocols, topologies, and applications.',
      syllabus: 'OSI Model, TCP/IP, Networking Devices, Network Topologies',
      pdfUrl: 'https://dbrau.ac.in/wp-content/uploads/2024/01/BCA-2023.pdf', // PDF link for Computer Network
      page: 37, // Specific page for Computer Network
    },
    {
      title: 'System Analysis & Design',
      image: 'https://image.slidesharecdn.com/systemanalysisanddesign-151009061521-lva1-app6891/95/system-analysis-and-design-1-638.jpg?cb=1444371405',
      description: 'Learn techniques to analyze and design systems.',
      syllabus: 'System Life Cycle, Feasibility Study, DFD, ER Diagrams',
      pdfUrl: 'https://dbrau.ac.in/wp-content/uploads/2024/01/BCA-2023.pdf', // PDF link for System Analysis & Design
      page: 39, // Specific page for System Analysis & Design
    },
    {
      title: 'System Design & Algorithm',
      image: 'https://online.stanford.edu/sites/default/files/styles/embedded_large/public/2018-03/engineering-computer-science-algorithms-design-analysis_soe-ycsalgorithms.png?itok=9li5BBeK',
      description: 'Master design principles and algorithms.',
      syllabus: 'Sorting Algorithms, Design Patterns, Complexity Analysis',
      pdfUrl: 'https://dbrau.ac.in/wp-content/uploads/2024/01/BCA-2023.pdf', // PDF link for System Design & Algorithm
      page: 39, // Specific page for System Design & Algorithm
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
    setPdfPage(page); // Set the specific page number
    if (pdfUrl) {
      window.open(pdfUrl, '_blank'); // Open the PDF in a new tab
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSyllabus('');
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px' }}>
        Classes
      </Typography>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {subjects.map((subject, index) => (
          <Card key={index} style={{ width: '300px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '10px' }}>
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
                onClick={() => handleOpen(subject.syllabus, subject.pdfUrl, subject.page)} // passing page number here
              >
                Show More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px' }}>
        Labs
      </Typography>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {labs.map((lab, index) => (
          <Card key={index} style={{ width: '300px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '10px' }}>
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
                onClick={() => handleOpen(lab.syllabus)} // passing page number here as well, default is 34
              >
                Show More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={handleClose} aria-labelledby="syllabus-title" aria-describedby="syllabus-content">
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            outline: 'none',
            width: '80%',
            height: '80%',
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
