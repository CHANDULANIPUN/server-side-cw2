import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FollowButton from './FollowButton';

const HomePage = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const { currentUserId } = props;
  const [searchText, setSearchText] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Expose search handler to Navbar via ref
  useImperativeHandle(ref, () => ({
    handleSearchFromNavbar(text) {
      setSearchText(text);
      setPage(1);
      setHasSearched(true);
    },
  }));

  // Fetch all posts on load
  useEffect(() => {
    axios
      .get('http://localhost:5001/api/posts')
      .then((res) => setAllPosts(res.data))
      .catch((err) => console.error('Error fetching all posts:', err));
  }, []);

  const fetchBlogs = useCallback(async () => {
    if (!hasSearched) return;

    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/search', {
        params: { query: searchText, page, limit: 5 }, // ✅ pass the full text under "query"
      });

      setBlogs(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  }, [searchText, page, hasSearched]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleLearnClick = () => {
    navigate('/login');
  };

  const containerStyle = {
    textAlign: 'center',
    padding: '50px 20px',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
    fontFamily: 'Roboto, sans-serif',
  };

  const buttonStyle = {
    padding: '8px 16px',
    fontSize: '1em',
    backgroundColor: '#0d0d0d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const postCardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '20px auto',
    textAlign: 'left',
  };

  return (
    <div style={containerStyle}>
      <h1>Welcome to GlobalGlimpse App</h1>
      <p>
        Discover detailed information about countries around the world. Our app provides comprehensive data on geography, population, economy, and more.
      </p>

      <button onClick={handleLearnClick} style={buttonStyle}>
        Learn More
      </button>

      <div style={{ marginTop: '40px' }}>
        {hasSearched ? (
          <div>
            <h2>Search Results</h2>
            {loading ? (
              <p>Loading...</p>
            ) : blogs.length === 0 ? (
              <p>No blog posts found.</p>
            ) : (
              blogs.map((blog) => (
                <div key={blog.id} style={postCardStyle}>
                  <h3>{blog.title}</h3>
                  <p>{blog.content}</p>
                  <p>
                    By <strong>{blog.user_name}</strong> | {blog.country_name} |{' '}
                    {new Date(blog.date_of_visit).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}

            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                style={{ marginRight: '10px' }}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                style={{ marginLeft: '10px' }}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2>All Blog Posts</h2>
            {allPosts.length === 0 ? (
              <p>No blog posts available.</p>
            ) : (
              (allPosts.map((post) => (
                <div key={post.id} style={postCardStyle}>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <p>
                    By <strong>{post.user_name}</strong>{' '}
                    {post.user_id !== props.currentUserId && (
                      <FollowButton
                        followerId={currentUserId}   // logged-in user ID
                        followingId={post.user_id}   // post author ID
                        isInitiallyFollowing={post.isFollowing}  // comes from backend API
                      />

                    )}
                  </p>
                  <p>
                    Country: {post.country_name || 'N/A'} | Date:{' '}
                    {post.date_of_visit
                      ? new Date(post.date_of_visit).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              )))

            )}
          </div>

        )}
      </div>
    </div>
  );
});

export default HomePage;
