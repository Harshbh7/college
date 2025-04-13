// src/pages/EBooks.jsx
import React, { useState } from 'react';
import { Button, Card, CardContent, CardMedia, Typography, Grid, Modal, Box, TextField } from '@mui/material';

const EBooks = () => {
  const [open, setOpen] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [authorQuery, setAuthorQuery] = useState('');

  const ebooks = [
    {
      title: 'Network Security',
      author: 'William Stallings',
      image: 'https://www.logsign.com/uploads/ensuring_network_security_e34d6ce4bb.png',
      url: 'https://dl.hiva-network.com/Library/security/Cryptography-and-network-security-principles-and-practice.pdf',
    },
    {
      title: 'Visual Basic .NET',
      author: 'Michael Halvorson',
      image: 'https://images.spiceworks.com/wp-content/uploads/2023/04/28084947/shutterstock_1918195625.jpg',
      url: 'https://nibmehub.com/opac-service/pdf/read/Learning%20Visual%20Basic%20.NET.pdf',
    },
    {
      title: 'Computer Network',
      author: 'Andrew S. Tanenbaum',
      image: 'https://miro.medium.com/v2/resize:fit:1024/0*yDZ4O2EsLoVJSdDC.jpeg',
      url: 'https://csc-knu.github.io/sys-prog/books/Andrew%20S.%20Tanenbaum%20-%20Computer%20Networks.pdf',
    },
    {
      title: 'System Design & Algorithms',
      author: 'A. A. Puntambekar',
      image: 'https://www.silveredge-gs.com/wp-content/uploads/AdobeStock_563424092.webp',
      url: 'https://www.cet.edu.in/noticefiles/278_DAA%20Complete.pdf',
    },
    {
      title: 'Design & Analysis of Algorithms',
      author: 'Thomas H. Cormen',
      image: 'https://online.stanford.edu/sites/default/files/styles/embedded_large/public/2018-03/engineering-computer-science-algorithms-design-analysis_soe-ycsalgorithms.png?itok=9li5BBeK',
      url: 'https://dl.ebooksworld.ir/books/Introduction.to.Algorithms.4th.Leiserson.Stein.Rivest.Cormen.MIT.Press.9780262046305.EBooksWorld.ir.pdf',
    },
  ];

  const handleOpen = (ebook) => {
    setSelectedEbook(ebook);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEbook(null);
  };

  const handleSearch = () => {
    const filteredEbooks = ebooks.filter(
      (ebook) =>
        ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        ebook.author.toLowerCase().includes(authorQuery.toLowerCase())
    );

    if (filteredEbooks.length > 0) {
      setSelectedEbook(filteredEbooks[0]); // Show first matched book
      setOpen(true);
    } else {
      alert("No matching eBook found.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px' }}>
        E-Books
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
        <TextField
          label="Book Title"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <TextField
          label="Author Name"
          variant="outlined"
          value={authorQuery}
          onChange={(e) => setAuthorQuery(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search Book
        </Button>
      </div>
      <Grid container spacing={3}>
        {ebooks.map((ebook, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '10px' }}>
              <CardMedia
                component="img"
                height="200"
                image={ebook.image}
                alt={ebook.title}
                style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
              />
              <CardContent>
                <Typography variant="h6" component="div" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  {ebook.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {ebook.author}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: '100%', marginTop: '10px' }}
                  onClick={() => handleOpen(ebook)}
                >
                  Read Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for PDF Viewer */}
      <Modal open={open} onClose={handleClose} aria-labelledby="ebook-title" aria-describedby="ebook-content">
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {selectedEbook && (
            <iframe
              src={selectedEbook.url}
              width="90%"
              height="90%"
              title={selectedEbook.title}
              style={{ border: 'none' }}
            ></iframe>
          )}
          <Button
            variant="contained"
            color="secondary"
            style={{ position: 'absolute', top: '20px', right: '20px' }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default EBooks;