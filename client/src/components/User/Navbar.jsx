import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './logout';

const Navbar = ({ apiKey, setApiKey, loggedInUserId, onSearch }) => {
    const [searchInput, setSearchInput] = useState('');

    const navStyle = {
        backgroundColor: '#333',
        padding: '25px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const ulStyle = {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
    };

    const liStyle = {
        marginRight: '20px',
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
    };

    const linkHoverStyle = {
        textDecoration: 'underline',
    };

    const searchContainerStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    const inputStyle = {
        padding: '4px 8px',
        fontSize: '0.9em',
        marginRight: '5px',
    };

    const buttonStyle = {
        padding: '4px 10px',
        fontSize: '0.9em',
        backgroundColor: '#0d0d0d',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    };

    const handleSearchClick = () => {
        if (onSearch) {
            onSearch(searchInput.trim());
        }
    };

    return (
        <nav style={navStyle}>
            <ul style={ulStyle}>
                <li style={liStyle}>
                    <Link
                        to="/"
                        style={linkStyle}
                        onMouseOver={(e) => (e.target.style.textDecoration = linkHoverStyle.textDecoration)}
                        onMouseOut={(e) => (e.target.style.textDecoration = linkStyle.textDecoration)}
                    >
                        Home
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link
                        to="/login"
                        style={linkStyle}
                        onMouseOver={(e) => (e.target.style.textDecoration = linkHoverStyle.textDecoration)}
                        onMouseOut={(e) => (e.target.style.textDecoration = linkStyle.textDecoration)}
                    >
                        Login
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link
                        to="/register"
                        style={linkStyle}
                        onMouseOver={(e) => (e.target.style.textDecoration = linkHoverStyle.textDecoration)}
                        onMouseOut={(e) => (e.target.style.textDecoration = linkStyle.textDecoration)}
                    >
                        Register
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link
                        to="/adminlogin"
                        style={linkStyle}
                        onMouseOver={(e) => (e.target.style.textDecoration = linkHoverStyle.textDecoration)}
                        onMouseOut={(e) => (e.target.style.textDecoration = linkStyle.textDecoration)}
                    >
                        Admin
                    </Link>
                </li>

                {apiKey && (
                    <>
                        <li style={liStyle}>
                            <Link
                                to="/country"
                                style={linkStyle}
                                onMouseOver={(e) => (e.target.style.textDecoration = linkHoverStyle.textDecoration)}
                                onMouseOut={(e) => (e.target.style.textDecoration = linkStyle.textDecoration)}
                            >
                                Country
                            </Link>
                        </li>
                        <li style={liStyle}>
                            <Link
                                to={`/profile/${loggedInUserId}`}
                                style={linkStyle}
                                onMouseOver={(e) => (e.target.style.textDecoration = linkHoverStyle.textDecoration)}
                                onMouseOut={(e) => (e.target.style.textDecoration = linkStyle.textDecoration)}
                            >
                                Profile
                            </Link>
                        </li>
                        <li style={liStyle}>
                            <LogoutButton setApiKey={setApiKey} apiKey={apiKey} />
                        </li>
                    </>
                )}
            </ul>

            <div style={searchContainerStyle}>
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by country or username"
                    style={inputStyle}
                />
                <button onClick={handleSearchClick} style={buttonStyle}>
                    Search
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
