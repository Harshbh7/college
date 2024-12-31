// src/pages/Exams.jsx
import React from 'react';

const Exams = () => {
  const openExamResults = () => {
    window.open('https://result2024.agrauniv.online/', '_blank', 'width=420,height=600');
  };

  const openExamDatesheet = (month) => {
    let url = '';
    if (month === 'july') {
      url = 'https://dbrau.ac.in/wp-content/uploads/2024/05/BCA-II-IV-Exam-Scheme-May-June-2024-Revised.pdf'; // July Datesheet URL
    } else if (month === 'december') {
      url = 'https://dbrau.ac.in/wp-content/uploads/2024/12/BCA-IIIIV-Semester-DEC-2024.pdf'; // December Datesheet URL
    }
    window.open(url, '_blank', 'width=600,height=800');
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Exams Page</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={openExamResults}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          View Exam Results
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button
          onClick={() => openExamDatesheet('july')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px',
            marginRight: '10px',
          }}
        >
          Exam July Datesheet
        </button>
        <button
          onClick={() => openExamDatesheet('december')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#FF5722',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          Exam December Datesheet
        </button>
      </div>
    </div>
  );
};

export default Exams;
