import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';


const Viewblog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState({});

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
        const data = await res.json();
        console.log(data);
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    init();
  }, [id]);
  
  return (
     <>
      <nav id="navbar">
        <h1>Blogs</h1>
        <div className="navitem">
          <Link to="/">Home</Link>
          <Link to="/createblog">Create Blog</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>
    <div className="view-blog-container">
      <h1 className="view-blog-title">Title : {blog.title}</h1>
      <p className="view-blog-author"><strong>Author:</strong> {blog.author}</p>
      <p className="view-blog-status"><strong>Status:</strong> {blog.status}</p>
      <div className="view-blog-tags">
        <strong>Tags:</strong>{" "}
        {blog.tags?.map((tag, index) => (
          <Link key={index} to={`/tag/${tag}`} className="tag-link">
            #{tag}
          </Link>
        ))}
      </div>
      <div className="view-blog-content">
        <strong>Content:</strong>
        <p>{blog.content}</p>
      </div>
      
      <Link to={`/createblog/${blog._id}`}>
        <button className="edit-btn">Edit Blog</button>
      </Link>
    </div>
    </>

  );
};

export default Viewblog;
