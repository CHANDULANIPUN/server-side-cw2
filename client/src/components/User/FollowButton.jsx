import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FollowButton = ({ followerId, followingId, initialIsFollowing }) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    const handleClick = async () => {
        const apiKey = localStorage.getItem('apiKey');

        console.log('Follow button check → followerId:', followerId, 'apiKey:', apiKey);

        if (!followerId || !apiKey) {
            setMessage('You must be logged in to follow users.');
            return;
        }

        setLoading(true);

        const apiUrl = isFollowing
            ? 'http://localhost:5001/api/unfollow'
            : 'http://localhost:5001/api/follow';

        const payload = {
            followerId: Number(followerId),
            followingId: Number(followingId)
        };

        try {
            const response = await axios.post(apiUrl, payload, {
                headers: { Authorization: `Bearer ${apiKey}` }
            });
            console.log('Follow action response:', response.data);
            setIsFollowing(!isFollowing);
            setMessage(''); // clear any previous message on success
        } catch (error) {
            console.error('Error toggling follow status:', error);
            setMessage('Failed to update follow status.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleClick}
                disabled={loading}
                style={{
                    padding: '8px 16px',
                    backgroundColor: isFollowing ? '#dc3545' : '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    marginTop: '10px'
                }}
            >
                {loading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
            </button>

            {message && (
                <p style={{ color: '#d9534f', marginTop: '10px' }}>
                    {message}{' '}
                    <Link to="/login" style={{ textDecoration: 'underline', color: '#007bff' }}>
                        Go to Login
                    </Link>
                </p>
            )}
        </div>
    );
};

export default FollowButton;
