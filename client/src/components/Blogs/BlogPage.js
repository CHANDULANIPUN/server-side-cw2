// pages/BlogPage.js
import React, { useState } from 'react';
import BlogSidebar from './BlogSidebar.js';
import CreatePost from './CreatePost.js';
import UpdatePost from './UpdatePost.js';
import DeletePost from './DeletePost.js';
import AllPosts from './AllPosts.js';
import ViewPost from './ViewPost.js';

const BlogPage = () => {
  const [activeComponent, setActiveComponent] = useState('all');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'create': return <CreatePost />;
      case 'update': return <UpdatePost />;
      case 'delete': return <DeletePost />;
      case 'viewOne': return <ViewPost />;
      default: return <AllPosts />;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <BlogSidebar setActive={setActiveComponent} />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        {renderComponent()}
      </div>
    </div>
  );
};

export default BlogPage;
