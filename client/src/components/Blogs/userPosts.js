import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserPosts = ({ currentUsername, currentUserId }) => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/posts/user/${currentUsername}`, {
                    params: { currentUserId }
                });
                setPosts(res.data);
            } catch (err) {
                console.error('Error fetching user posts:', err);
            }
        };

        fetchUserPosts();
    }, [currentUsername, currentUserId]);

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:5001/api/posts/${postId}`);
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const handleEdit = (postId) => {
        navigate(`/edit-post/${postId}`);
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

    const buttonContainerStyle = {
        display: 'flex',
        gap: '10px',
        marginTop: '10px',
    };

    const deleteButtonStyle = {
        padding: '6px 12px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    const editButtonStyle = {
        padding: '6px 12px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>{currentUsername}'s Blog Posts</h2>
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
                        <div style={buttonContainerStyle}>
                            <button
                                style={editButtonStyle}
                                onClick={() => handleEdit(post.id)}
                            >
                                ✏️ Edit Post
                            </button>
                            <button
                                style={deleteButtonStyle}
                                onClick={() => handleDelete(post.id)}
                            >
                                🗑️ Delete Post
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default UserPosts;
