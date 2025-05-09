import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserPosts from '../Blogs/userPosts';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ profileUserId }) => {
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    axios.get(`http://localhost:5001/api/user/${profileUserId}`)
      .then(res => setProfileUser(res.data))
      .catch(err => console.error('Error fetching user:', err));

    axios.get(`http://localhost:5001/api/user/${profileUserId}/followers`)
      .then(res => setFollowers(res.data.followers))
      .catch(err => console.error('Error fetching followers:', err));

    axios.get(`http://localhost:5001/api/user/${profileUserId}/following`)
      .then(res => setFollowing(res.data.following))
      .catch(err => console.error('Error fetching following:', err));
  }, [profileUserId]);

  const containerStyle = {
    display: 'flex',
    maxWidth: '1100px',
    margin: '40px auto',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  };

  const sidebarStyle = {
    width: '240px',
    backgroundColor: '#f9f9f9',
    padding: '30px 20px',
    borderRight: '1px solid #ddd',
  };

  const mainContentStyle = {
    flexGrow: 1,
    padding: '30px',
    backgroundColor: '#fff',
  };

  const headingStyle = {
    fontSize: '1.8em',
    color: '#333',
    marginBottom: '20px',
  };

  const buttonStyle = {
    width: '100%',
    marginBottom: '15px',
    padding: '12px',
    backgroundColor: '#0d0d0d',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    textAlign: 'center',
    display: 'block',
    textDecoration: 'none',
  };

  const buttonHoverStyle = {
    backgroundColor: '#444',
  };

  const sectionBoxStyle = {
    backgroundColor: '#fafafa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <button
          style={buttonStyle}
          onClick={() => setActiveSection('overview')}
          onMouseOver={e => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={e => e.target.style.backgroundColor = buttonStyle.backgroundColor}
        >
          Overview
        </button>
        <button
          style={buttonStyle}
          onClick={() => setActiveSection('followers')}
          onMouseOver={e => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={e => e.target.style.backgroundColor = buttonStyle.backgroundColor}
        >
          Followers ({followers.length})
        </button>
        <button
          style={buttonStyle}
          onClick={() => setActiveSection('following')}
          onMouseOver={e => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={e => e.target.style.backgroundColor = buttonStyle.backgroundColor}
        >
          Following ({following.length})
        </button>
        <button
          style={buttonStyle}
          onClick={() => setActiveSection('posts')}
          onMouseOver={e => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={e => e.target.style.backgroundColor = buttonStyle.backgroundColor}
        >
          My Posts
        </button>
        <button
          style={buttonStyle}
          onClick={() => {
            setActiveSection('feed');
            axios.get(`http://localhost:5001/api/following-feed/${profileUserId}`)
              .then(res => setFeedPosts(res.data))
              .catch(err => console.error('Error fetching following feed:', err));
          }}
          onMouseOver={e => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={e => e.target.style.backgroundColor = buttonStyle.backgroundColor}
        >
          Following Feed
        </button>
        <button
          style={buttonStyle}
          onClick={() => navigate('/create-post')}
          onMouseOver={e => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={e => e.target.style.backgroundColor = buttonStyle.backgroundColor}
        >
         Create New Post
        </button>
      </div>

      <div style={mainContentStyle}>
        {profileUser ? (
          <>
            {activeSection === 'overview' && (
              <div style={sectionBoxStyle}>
                <h2 style={headingStyle}>{profileUser.username}’s Profile</h2>
                <p><strong>Email:</strong> {profileUser.email}</p>
              </div>
            )}

            {activeSection === 'followers' && (
              <div style={sectionBoxStyle}>
                <h3 style={headingStyle}>Followers ({followers.length})</h3>
                <ul>
                  {followers.map((f) => (
                    <li key={f.id}>{f.username}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeSection === 'following' && (
              <div style={sectionBoxStyle}>
                <h3 style={headingStyle}>Following ({following.length})</h3>
                <ul>
                  {following.map((f) => (
                    <li key={f.id}>{f.username}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeSection === 'posts' && (
              <div style={sectionBoxStyle}>
                <UserPosts currentUsername={profileUser.username} />
              </div>
            )}

            {activeSection === 'feed' && (
              <div style={sectionBoxStyle}>
                <h3 style={headingStyle}>Posts from Users You Follow</h3>
                {feedPosts.length === 0 ? (
                  <p>No posts from followed users yet.</p>
                ) : (
                  feedPosts.map((post) => (
                    <div key={post.id} style={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      padding: '15px',
                      marginBottom: '15px'
                    }}>
                      <h4>{post.title}</h4>
                      <p>{post.content}</p>
                      <p style={{ fontSize: '0.9em', color: '#666' }}>
                        By {post.user_name} on {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
