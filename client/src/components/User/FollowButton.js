import React, { useState } from 'react';
import axios from 'axios';

const FollowButton = ({ followingId, isInitiallyFollowing }) => {
    const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFollowToggle = async () => {
        setLoading(true);
        setError('');

        try {
            const apiKey = localStorage.getItem('apiKey');  // ✅ Get API key from storage

            if (!apiKey) {
                setError('API key is missing.');
                setLoading(false);
                return;
            }

            if (isFollowing) {
                // Unfollow
                await axios.post(
                    'http://localhost:5001/api/unfollow',
                    { followingId },  // ✅ Only send followingId
                    { headers: { 'x-api-key': apiKey } }  // ✅ Add API key header
                );
                setIsFollowing(false);
            } else {
                // Follow
                await axios.post(
                    'http://localhost:5001/api/follow',
                    { followingId },  // ✅ Only send followingId
                    { headers: { 'x-api-key': apiKey } }  // ✅ Add API key header
                );
                setIsFollowing(true);
            }
        } catch (err) {
            console.error('Error toggling follow status:', err);
            setError('Failed to update follow status.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'inline-block', marginLeft: '10px' }}>
            <button onClick={handleFollowToggle} disabled={loading}>
                {loading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            {error && (
                <div style={{ color: 'red', fontSize: '0.9em' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default FollowButton;
