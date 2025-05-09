import React, { useState } from 'react';
import axios from 'axios';

const FollowButton = ({ followerId, followingId, isInitiallyFollowing }) => {
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await axios.post('http://localhost:5001/api/unfollow', {
          followerId,
          followingId,
        });
        setIsFollowing(false);
      } else {
        // Follow
        await axios.post('http://localhost:5001/api/follow', {
          followerId,
          followingId,
        });
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Error toggling follow status:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    padding: '6px 12px',
    backgroundColor: isFollowing ? '#dc3545' : '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
  };

  return (
    <button
      style={buttonStyle}
      onClick={handleFollowToggle}
      disabled={loading}
    >
      {loading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
