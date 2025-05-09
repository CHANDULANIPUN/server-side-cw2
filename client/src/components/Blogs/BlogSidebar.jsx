import React from 'react';

const BlogSidebar = ({ setActive }) => {
  const sidebarStyle = {
    width: '220px',
    backgroundColor: '#f9f9f9',
    padding: '30px 20px',
    borderRight: '1px solid #ddd',
    height: '100vh',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.05)',
    top: 0,
    left: 0,
    overflowY: 'auto'
  };

  const headingStyle = {
    fontSize: '1.5em',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center'
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  };

  const listItemStyle = {
    marginBottom: '15px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0d0d0d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = '#444';
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = '#0d0d0d';
  };

  const actions = [
    'create',
    'delete',
  ];

  return (
    <div style={sidebarStyle}>
      <h3 style={headingStyle}>Blog Actions</h3>
      <ul style={listStyle}>
        {actions.map((action) => (
          <li key={action} style={listItemStyle}>
            <button
              onClick={() => setActive(action)}
              style={buttonStyle}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              {action === 'all'
                ? 'View All Posts'
          
                : `${action.charAt(0).toUpperCase() + action.slice(1)} Post`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogSidebar;
