import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = ({ profileUserId, loggedInUserId }) => {
  const [profileUser, setProfileUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    // Fetch user details
    axios.get(`http://localhost:5001/api/user/${profileUserId}`)
      .then(res => setProfileUser(res.data))
      .catch(err => console.error('Error fetching user:', err));

    // Fetch followers
    axios.get(`http://localhost:5001/api/user/${profileUserId}/followers`)
      .then(res => setFollowers(res.data.followers))
      .catch(err => console.error('Error fetching followers:', err));

    // Fetch following
    axios.get(`http://localhost:5001/api/user/${profileUserId}/following`)
      .then(res => setFollowing(res.data.following))
      .catch(err => console.error('Error fetching following:', err));
  }, [profileUserId]);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      {profileUser ? (
        <>
          <h2>{profileUser.username}’s Profile</h2>

          <div style={{ marginTop: '20px' }}>
            <h3>Followers ({followers.length})</h3>
            <ul>
              {followers.map((f) => (
                <li key={f.id}>{f.username}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Following ({following.length})</h3>
            <ul>
              {following.map((f) => (
                <li key={f.id}>{f.username}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;
