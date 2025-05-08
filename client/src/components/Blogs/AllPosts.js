// components/AllPosts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Error fetching posts:', err));
  }, []);

  // Styles
  const containerStyle = {
    
    padding: '40px',
    backgroundColor: '#f9f9f9',

  };

  const headingStyle = {
    fontSize: '2em',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center',
  };

  const postCardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
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
        <h2 style={headingStyle}>All Blog Posts</h2>
        {posts.length === 0 ? (
            <p>No blog posts available.</p>
        ) : (
            posts.map((post) => (
                <div key={post.id} style={postCardStyle}>
                    <h3 style={titleStyle}>{post.title}</h3>
                    <p style={contentStyle}>{post.content}</p>
                    <p style={metaStyle}>
                        Country: {post.country_name || 'N/A'} | Date:{' '}
                        {post.date_of_visit
                            ? new Date(post.date_of_visit).toLocaleDateString()
                            : 'N/A'}
                    </p>
                </div>
            ))
        )}
    </div>
);


};

export default AllPosts;
