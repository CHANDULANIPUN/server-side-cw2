import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        content: '',
        country_name: '',
        date_of_visit: '',
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/posts/${id}`);
                setForm({
                    title: res.data.title,
                    content: res.data.content,
                    country_name: res.data.country_name,
                    date_of_visit: res.data.date_of_visit,
                });
            } catch (err) {
                console.error('Error fetching post:', err);
            }
        };
        fetchPost();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5001/api/posts/${id}`, form);
            setMessage('Post updated successfully!');
            setTimeout(() => navigate(-1), 1000); // go back after 1 second
        } catch (err) {
            console.error('Error updating post:', err);
            setMessage('Failed to update post.');
        }
    };

    // Styles
    const containerStyle = {
        padding: '40px',
        backgroundColor: '#f9f9f9',
    };

    const formStyle = {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '30px',
        backgroundColor: '#ffffff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    };

    const headingStyle = {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
        fontSize: '2em',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '15px',
    };

    const buttonStyle = {
        width: '100%',
        padding: '12px',
        backgroundColor: '#0d0d0d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    const buttonHoverStyle = {
        backgroundColor: '#444',
    };

    const messageStyle = {
        textAlign: 'center',
        marginTop: '20px',
        color: message.includes('successfully') ? '#28a745' : '#d9534f',
        fontWeight: 'bold',
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={headingStyle}>Edit Blog Post</h2>

                <label style={labelStyle}>Title:</label>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Content:</label>
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    required
                    style={{ ...inputStyle, height: '100px' }}
                />

                <label style={labelStyle}>Country Name:</label>
                <input
                    name="country_name"
                    value={form.country_name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Date of Visit:</label>
                <input
                    type="date"
                    name="date_of_visit"
                    value={form.date_of_visit}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <button
                    type="submit"
                    style={buttonStyle}
                    onMouseOver={(e) =>
                        (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)
                    }
                    onMouseOut={(e) =>
                        (e.target.style.backgroundColor = buttonStyle.backgroundColor)
                    }
                >
                    Update
                </button>

                {message && <p style={messageStyle}>{message}</p>}
            </form>
        </div>
    );
};

export default EditPost;
