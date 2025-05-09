import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FollowButton from './FollowButton';

const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        if (storedId) {
            const userId = Number(storedId);
            setCurrentUserId(userId);
            fetchPosts(userId);
        } else {
            setLoading(false); // no user, stop loading
        }
    }, []);

    const fetchPosts = async (userId) => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5001/api/posts', {
                params: { currentUserId: userId }
            });
            setPosts(res.data);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            await axios.post(`http://localhost:5001/api/posts/${postId}/like`, { userId: currentUserId });
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
                )
            );
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleDislike = async (postId) => {
        try {
            await axios.post(`http://localhost:5001/api/posts/${postId}/dislike`, { userId: currentUserId });
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId ? { ...p, dislikes: (p.dislikes || 0) + 1 } : p
                )
            );
        } catch (err) {
            console.error('Error disliking post:', err);
        }
    };

    if (!currentUserId) {
        return <p style={{ textAlign: 'center', marginTop: '50px' }}>Please log in to see posts.</p>;
    }

    return (
        <div style={{ padding: '40px', backgroundColor: '#f9f9f9' }}>
            <h2 style={{ fontSize: '2em', color: '#333', textAlign: 'center' }}>All Blog Posts</h2>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading posts...</p>
            ) : posts.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No blog posts available.</p>
            ) : (
                posts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            maxWidth: '800px',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    >
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <p>Author: {post.user_name} (User ID: {post.user_id})</p>
                        <p>
                            👍 Likes: {post.likes || 0} | 👎 Dislikes: {post.dislikes || 0}
                        </p>

                        <div style={{ marginTop: '10px' }}>
                            <button
                                onClick={() => handleLike(post.id)}
                                style={{
                                    marginRight: '10px',
                                    padding: '6px 12px',
                                    backgroundColor: '#007BFF',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                👍 Like
                            </button>
                            <button
                                onClick={() => handleDislike(post.id)}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                👎 Dislike
                            </button>
                        </div>

                        {currentUserId !== null && currentUserId !== undefined &&
                            post.user_id !== currentUserId && (
                                <div style={{ marginTop: '10px' }}>
                                    <FollowButton
                                        followerId={currentUserId}
                                        followingId={post.user_id}
                                        initialIsFollowing={Boolean(post.isFollowing)}
                                    />
                                </div>
                            )}
                    </div>
                ))
            )}
        </div>
    );
};

export default AllPosts;
