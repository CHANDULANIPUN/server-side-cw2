import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [followStates, setFollowStates] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const currentUserId = 1; // hardcoded for now

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/posts');
      setPosts(res.data);

      // Initialize follow states
      const initialFollowStates = {};
      const initialLoadingStates = {};
      res.data.forEach((post) => {
        initialFollowStates[post.id] = post.isFollowing || false;
        initialLoadingStates[post.id] = false;
      });
      setFollowStates(initialFollowStates);
      setLoadingStates(initialLoadingStates);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:5001/api/posts/${postId}/like`, {
        userId: currentUserId,
      });
      fetchPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleDislike = async (postId) => {
    try {
      await axios.post(`http://localhost:5001/api/posts/${postId}/dislike`, {
        userId: currentUserId,
      });
      fetchPosts();
    } catch (err) {
      console.error('Error disliking post:', err);
    }
  };

  const handleFollowToggle = async (postId, followingId) => {
    setLoadingStates((prev) => ({ ...prev, [postId]: true }));
    try {
      if (followStates[postId]) {
        await axios.post('http://localhost:5001/api/unfollow', {
          followerId: currentUserId,
          followingId,
        });
        setFollowStates((prev) => ({ ...prev, [postId]: false }));
      } else {
        await axios.post('http://localhost:5001/api/follow', {
          followerId: currentUserId,
          followingId,
        });
        setFollowStates((prev) => ({ ...prev, [postId]: true }));
      }
    } catch (err) {
      console.error('Error toggling follow status:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoadingStates((prev) => ({ ...prev, [postId]: false }));
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

  const followButtonStyle = (isFollowing, loading) => ({
    padding: '6px 12px',
    backgroundColor: isFollowing ? '#dc3545' : '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
  });

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

            <button style={buttonStyle} onClick={() => handleLike(post.id)}>
              👍 Like
            </button>
            <button style={dislikeButtonStyle} onClick={() => handleDislike(post.id)}>
              👎 Dislike
            </button>

            {/* Follow Button (only if not own post) */}
            {post.user_id && post.user_id !== currentUserId && (
              <button
                style={followButtonStyle(followStates[post.id], loadingStates[post.id])}
                onClick={() => handleFollowToggle(post.id, post.user_id)}
                disabled={loadingStates[post.id]}
              >
                {loadingStates[post.id]
                  ? 'Processing...'
                  : followStates[post.id]
                  ? 'Unfollow'
                  : 'Follow'}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AllPosts;
