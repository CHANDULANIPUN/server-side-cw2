import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import axios from 'axios';
import FollowButton from './FollowButton';

const HomePage = forwardRef((props, ref) => {
  const { currentUserId } = props;

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [allPosts, setAllPosts] = useState([]);
  const [allLoading, setAllLoading] = useState(false);
  const [sortOption, setSortOption] = useState('newest');

  useImperativeHandle(ref, () => ({
    handleSearchFromNavbar(text) {
      setSearchText(text);
      setSearchPage(1);
      setHasSearched(true);
    },
  }));

  const fetchAllPosts = useCallback(async () => {
    setAllLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/posts', {
        params: { sortBy: sortOption },
      });
      const posts = Array.isArray(res.data) ? res.data : res.data.posts || [];
      setAllPosts(posts);
    } catch (err) {
      console.error('Error fetching all posts:', err);
    } finally {
      setAllLoading(false);
    }
  }, [sortOption]);

  useEffect(() => {
    if (!hasSearched) {
      fetchAllPosts();
    }
  }, [fetchAllPosts, hasSearched]);

  const fetchSearchResults = useCallback(async () => {
    if (!hasSearched) return;
    setSearchLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/search', {
        params: { query: searchText, page: searchPage, limit: 5 },
      });
      setSearchResults(res.data.posts || []);
      setSearchTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching search results:', err);
    } finally {
      setSearchLoading(false);
    }
  }, [searchText, searchPage, hasSearched]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:5001/api/posts/${postId}/like`, {
        userId: currentUserId,
      });
      hasSearched ? fetchSearchResults() : fetchAllPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleDislike = async (postId) => {
    try {
      await axios.post(`http://localhost:5001/api/posts/${postId}/dislike`, {
        userId: currentUserId,
      });
      hasSearched ? fetchSearchResults() : fetchAllPosts();
    } catch (err) {
      console.error('Error disliking post:', err);
    }
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
    marginBottom: '10px',
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

  const likeButtonStyle = {
    padding: '8px 12px',
    marginRight: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: '#fff',
  };

  const dislikeButtonStyle = {
    ...likeButtonStyle,
    backgroundColor: '#dc3545',
  };

  const renderPost = (post) => (
    <div key={post.id} style={postCardStyle}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>
        By <strong>{post.user_name}</strong>{' '}
        {post.user_id && post.user_id !== currentUserId && (
          <FollowButton
            followerId={currentUserId}
            followingId={post.user_id}
            initialIsFollowing={post.isFollowing || false}
          />
        )}
      </p>
      <p>
        Country: {post.country_name || 'N/A'} | Date:{' '}
        {post.date_of_visit
          ? new Date(post.date_of_visit).toLocaleDateString()
          : 'N/A'}
      </p>
      <p>
        👍 Likes: {post.likes || 0} | 👎 Dislikes: {post.dislikes || 0}
      </p>
      <button style={likeButtonStyle} onClick={() => handleLike(post.id)}>
        👍 Like
      </button>
      <button style={dislikeButtonStyle} onClick={() => handleDislike(post.id)}>
        👎 Dislike
      </button>
    </div>
  );

  return (
    <div style={containerStyle}>
      <h1>Welcome to GlobalGlimpse App</h1>
      <p>
        Discover detailed information about countries around the world. Our app
        provides comprehensive data on geography, population, economy, and more.
      </p>
      {!hasSearched && (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <label htmlFor="sort">Sort by: </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="mostLiked">Most Liked</option>
          </select>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        {hasSearched ? (
          <div>
            <h2>Search Results</h2>
            {searchLoading ? (
              <p>Loading...</p>
            ) : searchResults.length === 0 ? (
              <p>No blog posts found.</p>
            ) : (
              searchResults.map(renderPost)
            )}
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => setSearchPage((prev) => Math.max(prev - 1, 1))}
                disabled={searchPage === 1}
                style={{ marginRight: '10px' }}
              >
                Previous
              </button>
              <span>
                Page {searchPage} of {searchTotalPages}
              </span>
              <button
                onClick={() =>
                  setSearchPage((prev) =>
                    Math.min(prev + 1, searchTotalPages)
                  )
                }
                disabled={searchPage === searchTotalPages}
                style={{ marginLeft: '10px' }}
              >
                Next
              </button>
            </div>
            <button
              onClick={() => {
                setHasSearched(false);
                setSearchText('');
                setSearchResults([]);
              }}
              style={{ ...buttonStyle, marginTop: '15px' }}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div>
            <h2>All Blog Posts</h2>
            {allLoading ? (
              <p>Loading...</p>
            ) : allPosts.length === 0 ? (
              <p>No blog posts available.</p>
            ) : (
              allPosts.map(renderPost)
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default HomePage;
