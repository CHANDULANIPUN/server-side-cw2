// components/UpdatePost.js
import React, { useState } from 'react';
import axios from 'axios';

const UpdatePost = () => {
  const [postId, setPostId] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
    title: '',
    content: '',
    countryName: '',
    dateOfVisit: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/posts/${postId}`, formData);
      setMessage('Post updated successfully!');
    } catch (err) {
      setMessage('Failed to update post.');
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
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
    fontSize: '2em',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
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
    backgroundColor: '#0d0d0d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#444',
  };

  const messageStyle = {
    textAlign: 'center',
    marginTop: '20px',
    color: message.includes('successfully') ? '#28a745' : '#d9534f',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={headingStyle}>Update Blog Post</h2>

        <label style={labelStyle}>Post ID:</label>
        <input
          type="text"
          placeholder="Enter Post ID"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
          required
          style={inputStyle}
        />

        {['userId', 'title', 'content', 'countryName', 'dateOfVisit'].map((field) => (
          <div key={field}>
            <label style={labelStyle}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        ))}

        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
        >
          Update
        </button>
        {message && <p style={messageStyle}>{message}</p>}
      </form>
    </div>
  );
};

export default UpdatePost;
