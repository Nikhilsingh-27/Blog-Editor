import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Blogs from '../components/Blogs';

const Home = () => {
  const [allblogs, setAllblogs] = useState([]);

  useEffect(() => {
    const initblog = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/blogs");
        const data = await response.json();
        setAllblogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };

    initblog();
  }, []);

  return (
    <>
      <div>
        <nav id="navbar">
          <h1>Blogs</h1>
          <div className="navitem">
            <Link to="/">Home</Link>
            <Link to="/createblog">Create Blog</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </nav>
        <div className="blog-list">
          {allblogs.map((blog) => (
            <Blogs key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
