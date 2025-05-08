import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FollowButton from './FollowButton'; // make sure the path is correct

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const currentUserId = 1; // hardcoded for now; replace with real user ID later

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:5001/api/posts/${postId}/like`, { userId: currentUserId });
      fetchPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleDislike = async (postId) => {
    try {
      await axios.post(`http://localhost:5001/api/posts/${postId}/dislike`, { userId: currentUserId });
      fetchPosts();
    } catch (err) {
      console.error('Error disliking post:', err);
    }
  };

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
    marginBottom: '10px',
  };

  const buttonStyle = {
    padding: '8px 12px',
    marginRight: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: '#fff',
  };

  const dislikeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
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
            <p style={metaStyle}>
              👍 Likes: {post.likes || 0} | 👎 Dislikes: {post.dislikes || 0}
            </p>

            {/* Like/Dislike Buttons */}
            <button style={buttonStyle} onClick={() => handleLike(post.id)}>
              👍 Like
            </button>
            <button style={dislikeButtonStyle} onClick={() => handleDislike(post.id)}>
              👎 Dislike
            </button>

            {/* Follow Button (only show if not own post) */}
            {post.user_id && post.user_id !== currentUserId && (
              <FollowButton
                followerId={currentUserId}
                followingId={post.user_id}
                isInitiallyFollowing={post.isFollowing || false} // make sure backend provides this
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AllPosts;
