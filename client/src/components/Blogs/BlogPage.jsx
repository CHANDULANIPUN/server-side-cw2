
import React, { useState } from 'react';
import BlogSidebar from './BlogSidebar.js';
import CreatePost from './CreatePost.js';




const BlogPage = () => {
  const [activeComponent, setActiveComponent] = useState('all');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'create':
        return <CreatePost />;
        
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
