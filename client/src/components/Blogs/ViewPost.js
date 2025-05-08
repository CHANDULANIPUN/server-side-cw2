import React, { useState } from 'react';
import axios from 'axios';

const ViewPost = () => {
  const [postId, setPostId] = useState('');
  const [post, setPost] = useState(null);
  const [message, setMessage] = useState('');

  const handleFetch = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/posts/${postId}`);
      setPost(res.data);
      setMessage('');
    } catch (err) {
      setPost(null);
      setMessage('Post not found.');
    }
  };

  // Styles
  const containerStyle = {
    padding: '40px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  };

  const headingStyle = {
    fontSize: '2em',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center',
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '1em',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
    width: '300px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1em',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  };

  const messageStyle = {
    marginTop: '20px',
    color: '#d00',
    textAlign: 'center',
  };

  const postCardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const titleStyle = {
    fontSize: '1.5em',
    marginBottom: '10px',
    color: '#333',
  };

  const contentStyle = {
    fontSize: '1em',
    marginBottom: '10px',
    color: '#555',
  };

  const metaStyle = {
    fontSize: '0.9em',
    color: '#888',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>View Single Blog Post</h2>
      <div style={{ textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Post ID"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
          required
          style={inputStyle}
        />
        <button onClick={handleFetch} style={buttonStyle}>Fetch Post</button>
      </div>
      {message && <p style={messageStyle}>{message}</p>}
      {post && (
        <div style={postCardStyle}>
          <h3 style={titleStyle}>{post.title}</h3>
          <p style={contentStyle}>{post.content}</p>
          <p style={metaStyle}>
            Country: {post.countryName} | Date: {post.dateOfVisit}
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewPost;
