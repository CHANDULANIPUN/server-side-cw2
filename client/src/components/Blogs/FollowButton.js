import React, { useState } from 'react';
import axios from 'axios';

const FollowButton = ({ followerId, followingId, isInitiallyFollowing }) => {
    const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
    const [loading, setLoading] = useState(false);

    const handleToggleFollow = async () => {
        try {
            setLoading(true);
            const endpoint = isFollowing
                ? 'unfollow'
                : 'follow';
            await axios.post(`http://localhost:5001/api/${endpoint}`, {
                followerId,
                followingId
            });
            setIsFollowing(!isFollowing);
        } catch (err) {
            console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, err);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const buttonStyle = {
        padding: '6px 12px',
        backgroundColor: isFollowing ? '#6c757d' : '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9em',
    };

    return (
        <button
            style={buttonStyle}
            onClick={handleToggleFollow}
            disabled={loading}
        >
            {loading
                ? 'Processing...'
                : isFollowing
                    ? 'Unfollow'
                    : 'Follow'}
        </button>
    );
};

export default FollowButton;
