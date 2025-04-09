import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const navStyle = {
        backgroundColor: '#333',
        padding: '25px',
    };

    const ulStyle = {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
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

    return (
        <nav style={navStyle}>
            <ul style={ulStyle}>
                <li style={liStyle}>
                    <Link
                        to="/"
                        style={linkStyle}
                        onMouseOver={(e) => e.target.style.textDecoration = linkHoverStyle.textDecoration}
                        onMouseOut={(e) => e.target.style.textDecoration = linkStyle.textDecoration}
                    >
                        Home
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link
                        to="/login"
                        style={linkStyle}
                        onMouseOver={(e) => e.target.style.textDecoration = linkHoverStyle.textDecoration}
                        onMouseOut={(e) => e.target.style.textDecoration = linkStyle.textDecoration}
                    >
                        Login
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link
                        to="/register"
                        style={linkStyle}
                        onMouseOver={(e) => e.target.style.textDecoration = linkHoverStyle.textDecoration}
                        onMouseOut={(e) => e.target.style.textDecoration = linkStyle.textDecoration}
                    >
                        Register
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link
                        to="/api-key-manager"
                        style={linkStyle}
                        onMouseOver={(e) => e.target.style.textDecoration = linkHoverStyle.textDecoration}
                        onMouseOut={(e) => e.target.style.textDecoration = linkStyle.textDecoration}
                    >
                        API Key Manager
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;