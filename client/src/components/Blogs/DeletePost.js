// components/DeletePost.js
import React, { useState } from 'react';
import axios from 'axios';

const DeletePost = () => {
  const [postId, setPostId] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/posts/${postId}`, {
        data: { userId },
      });
      setMessage('Post deleted successfully!');
    } catch (err) {
      setMessage('Failed to delete post.');
    }
  };

  // Styles
  const containerStyle = {
    padding: '40px',
    backgroundColor: '#f9f9f9',
  };

  const formStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  };

  const headingStyle = {
    marginBottom: '20px',
    color: '#333',
    fontSize: '2em',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '15px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#c82333',
  };

  const messageStyle = {
    marginTop: '20px',
    color: message.includes('successfully') ? '#28a745' : '#d9534f',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2 style={headingStyle}>Delete Blog Post</h2>

        <input
          type="text"
          placeholder="Post ID"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          style={inputStyle}
        />

        <button
          onClick={handleDelete}
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        >
          Delete
        </button>

        {message && <p style={messageStyle}>{message}</p>}
      </div>
    </div>
  );
};

export default DeletePost;
