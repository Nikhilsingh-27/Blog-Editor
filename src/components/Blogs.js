import React from 'react';
import { Link } from 'react-router-dom';

const Blogs = ({ blog }) => {
  console.log(blog)
  
  return (
    <div className="blog-card">
      <h2>Title : {blog.title}</h2>
      <p>Author : {blog.author}</p>
      <p>Content: {blog.content.slice(0, 25) + "..."}</p>
      <p>
        <i>Tags :{" "}
          {blog.tags && blog.tags.map((tag, index) => (
            <Link
              key={index}
              to={`/tag/${tag}`}
              style={{ marginRight: '8px', textDecoration: 'underline' }}
            >
              #{tag}
            </Link>
          ))}
        </i>
      </p>
      <Link to={'/viewblog/'+blog._id}>view full blog</Link>
      <p>status : {blog.status}</p>
      <Link to={`/createblog/`+blog._id}><button>Edit</button></Link>
      
    </div>
  );
};

export default Blogs;
