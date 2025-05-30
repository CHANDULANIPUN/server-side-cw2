import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from 'react-router-dom';
import Navbar from './components/User/Navbar';
import HomePage from './components/User/Home';
import Register from './components/User/Register';
import Login from './components/User/Login';
import ApiKeyManager from './components/User/ApiKeyManager';
import AdminLogin from './components/User/AdminLogin';
import AdminDashboard from './components/User/AdminDashboard';
import ProfilePage from './components/User/ProfilePage';
import EditPost from './components/Blogs/EditPost';
import Country from './components/User/Country';
import CreatePost from './components/Blogs/CreatePost';


const ProfileRouteWrapper = ({ loggedInUserId }) => {
    const { userId } = useParams();
    if (!userId) return <Navigate to="/login" />;
    return <ProfilePage profileUserId={parseInt(userId, 10)} loggedInUserId={loggedInUserId} />;
};

const App = () => {
    const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
    const [userId, setUserId] = useState(() => {
        const storedId = localStorage.getItem('userId');
        return storedId ? parseInt(storedId, 10) : null;
    });
    const homePageRef = useRef();

    useEffect(() => {
        if (apiKey) localStorage.setItem('apiKey', apiKey);
        if (userId !== null) localStorage.setItem('userId', userId.toString());
    }, [apiKey, userId]);

    return (
        <Router>
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <Navbar
                    setApiKey={setApiKey}
                    apiKey={apiKey}
                    loggedInUserId={userId}
                    onSearch={(input) => homePageRef.current?.handleSearchFromNavbar(input)}
                />

                <Routes>
                    <Route path="/" element={<HomePage ref={homePageRef} currentUserId={userId} />} />

                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setApiKey={setApiKey} setUserId={setUserId} />} />
                    <Route
                        path="/api-key-manager"
                        element={apiKey ? <ApiKeyManager apiKey={apiKey} /> : <p>Please log in to manage your API key.</p>}
                    />
                    
                    <Route path="/adminlogin" element={<AdminLogin setApiKey={setApiKey} />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/profile/:userId" element={<ProfileRouteWrapper loggedInUserId={userId} />} />
                    <Route path="/edit-post/:id" element={<EditPost />} />
                    <Route path="/country" element={<Country />} />
                    <Route path="/create-post" element={<CreatePost />} />


                </Routes>
            </div>
        </Router>
    );
};

export default App;
