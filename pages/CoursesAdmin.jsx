import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardMedia, Typography, Grid, Modal, Box, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FIREBASE_URL = 'https://college-fde10-default-rtdb.firebaseio.com/books';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const EBooks = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [allEbooks, setAllEbooks] = useState([]); // for search
  const [searchQuery, setSearchQuery] = useState('');
  const [newEbook, setNewEbook] = useState({ 
    title: '', 
    author: '', 
    image: '', 
    url: '', 
    subject: '' 
  });

  // Fetch Data from Firebase
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${FIREBASE_URL}.json`);
        const data = response.data;
        if (data) {
          const loadedBooks = Object.keys(data).map((key) => ({
            id: key,
            title: data[key].title || '',
            author: data[key].author || '',
            image: data[key].image || '',
            url: data[key].url || '',
            subject: data[key].subject || ''
          }));
          setEbooks(loadedBooks);
          setAllEbooks(loadedBooks);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleOpen = (ebook) => {
    window.open(ebook.url, '_blank');
  };

  const handleAddEbook = () => {
    if (
      newEbook.title === '' ||
      newEbook.author === '' ||
      newEbook.image === '' ||
      newEbook.url === '' ||
      newEbook.subject === ''
    ) {
      toast.error('All fields are required.');
      return;
    }

    if (editMode && selectedEbook) {
      // Update existing book
      axios
        .put(`${FIREBASE_URL}/${selectedEbook.id}.json`, newEbook)
        .then(() => {
          setEbooks((prevBooks) =>
            prevBooks.map((book) =>
              book.id === selectedEbook.id ? { ...newEbook, id: selectedEbook.id } : book
            )
          );
          setAllEbooks((prevBooks) =>
            prevBooks.map((book) =>
              book.id === selectedEbook.id ? { ...newEbook, id: selectedEbook.id } : book
            )
          );
          toast.success('Book updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating book: ', error);
          toast.error('Failed to update book. Please try again.');
        });
    } else {
      // Add new book
      axios
        .post(`${FIREBASE_URL}.json`, newEbook)
        .then((response) => {
          const newBook = { id: response.data.name, ...newEbook };
          setEbooks((prevBooks) => [...prevBooks, newBook]);
          setAllEbooks((prevBooks) => [...prevBooks, newBook]);
          toast.success('Book added successfully!');
        })
        .catch((error) => {
          console.error('Error adding book: ', error);
          toast.error('Failed to add book. Please try again.');
        });
    }

    setNewEbook({ title: '', author: '', image: '', url: '', subject: '' });
    setModalOpen(false);
    setEditMode(false);
    setSelectedEbook(null);
  };

  const handleEdit = (ebook) => {
    setNewEbook({ ...ebook });
    setSelectedEbook(ebook);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = (ebook) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      axios.delete(`${FIREBASE_URL}/${ebook.id}.json`)
        .then(() => {
          setEbooks((prevBooks) => prevBooks.filter((book) => book.id !== ebook.id));
          setAllEbooks((prevBooks) => prevBooks.filter((book) => book.id !== ebook.id));
          toast.success('Book deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting book: ', error);
          toast.error('Failed to delete book. Please try again.');
        });
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      const filteredBooks = allEbooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setEbooks(filteredBooks);
    } else {
      setEbooks(allEbooks);
    }
  };

  const handleModalOpenForAdd = () => {
    setNewEbook({ title: '', author: '', image: '', url: '', subject: '' });
    setEditMode(false);
    setSelectedEbook(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditMode(false);
    setSelectedEbook(null);
    setNewEbook({ title: '', author: '', image: '', url: '', subject: '' });
  };

  return (
    <div style={{ padding: '20px' }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Typography variant='h4' style={{ textAlign: 'center', marginBottom: '20px' }}>
        E-Books
      </Typography>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
        <TextField
          label='Search by Title or Author'
          variant='outlined'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '80%' }}
        />
        <Button variant='contained' color='primary' onClick={handleSearch} style={{ width: '10%' }}>
          Search
        </Button>
        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={handleModalOpenForAdd}
          style={{ width: '10%' }}
        >
          Book
        </Button>
      </div>

      <Grid container spacing={3}>
        {ebooks.map((ebook) => (
          <Grid item xs={12} sm={6} md={4} key={ebook.id}>
            <Card>
              <CardMedia component='img' height='200' image={ebook.image} alt={ebook.title} />
              <CardContent>
                <Typography variant='h6'>{ebook.title}</Typography>
                <Typography variant='subtitle2' color='textSecondary'>
                  {ebook.author}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Subject: {ebook.subject}
                </Typography>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <Button variant='contained' color='primary' style={{ flex: 1 }} onClick={() => handleOpen(ebook)}>
                    Read Now
                  </Button>
                  <IconButton color='primary' onClick={() => handleEdit(ebook)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color='secondary' onClick={() => handleDelete(ebook)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography variant='h6' mb={2}>
            {editMode ? 'Edit Book' : 'Add Book'}
          </Typography>
          <TextField
            label='Title'
            fullWidth
            margin='normal'
            value={newEbook.title}
            onChange={(e) => setNewEbook({ ...newEbook, title: e.target.value })}
          />
          <TextField
            label='Author'
            fullWidth
            margin='normal'
            value={newEbook.author}
            onChange={(e) => setNewEbook({ ...newEbook, author: e.target.value })}
          />
          <TextField
            label='Image URL'
            fullWidth
            margin='normal'
            value={newEbook.image}
            onChange={(e) => setNewEbook({ ...newEbook, image: e.target.value })}
          />
          <TextField
            label='Book URL'
            fullWidth
            margin='normal'
            value={newEbook.url}
            onChange={(e) => setNewEbook({ ...newEbook, url: e.target.value })}
          />
          <TextField
            label='Subject'
            fullWidth
            margin='normal'
            value={newEbook.subject}
            onChange={(e) => setNewEbook({ ...newEbook, subject: e.target.value })}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button onClick={handleModalClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button variant='contained' color='primary' onClick={handleAddEbook}>
              {editMode ? 'Update' : 'Add'}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default EBooks;