import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay)
  }
}
const Createblog = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const quillRef = useRef(null);
  const param = useParams();
  const navigate = useNavigate();

  const idofdraft = useRef(0);

  const handlestop = useCallback(async () => {
    toast.success("Draft is saved")
    const editor = quillRef.current?.getEditor();
    const plainText = editor ? editor.getText().trim() : '';

    const blogData = {
      title,
      author,
      tags: tags.split(',').map(tag => tag.trim()),
      content: plainText,
      status: 'draft'
    };

    try {
      let url = '';
      let method = '';
      if (param.id) {
        idofdraft.current = param.id;
      }
      if (idofdraft.current !== 0) {
        url = `http://localhost:5000/api/blogs/publish/${idofdraft.current}`;
        method = 'PUT';
      } else {
        url = `http://localhost:5000/api/blogs/publish/`;
        method = 'POST';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      const data = await res.json();

      // Save ID if new draft was created
      if (method === 'POST' && data._id) {
        idofdraft.current = data._id;
        console.log("Draft created with ID:", idofdraft.current);
      }

    } catch (err) {
      console.error("Auto save failed:", err);
    }
  }, [title, author, tags]);


  useEffect(() => {
    const debouncedStop = debounce(handlestop, 2000);

    const handleInput = (e) => {
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.classList.contains('ql-editor')
      ) {
        debouncedStop();
      }
    };

    document.addEventListener('input', handleInput);
    return () => {
      document.removeEventListener('input', handleInput);
    };
  }, [handlestop]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const plainText = quillRef.current?.getEditor()?.getText().trim() || '';

    const blogData = {
      title,
      author,
      tags: tags.split(',').map(tag => tag.trim()),
      content: plainText,
      status: "published"
    };

    try {
      let url = '';
      let method = '';
      if (param.id) {
        url = `http://localhost:5000/api/blogs/publish/${param.id}`;
        method = 'PUT';
      }
      else if (idofdraft.current !== 0) {
        url = `http://localhost:5000/api/blogs/publish/${idofdraft.current}`;
        method = 'PUT';
      } else {
        url = `http://localhost:5000/api/blogs/publish/`;
        method = 'POST';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Blog is successfully Published`)
        setTitle('');
        setAuthor('');
        setTags('');
        setContent('');
        idofdraft.current = 0;
        navigate('/')

      } else {
        alert("Error submitting blog");
      }

    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  useEffect(() => {
    const initBlog = async (id) => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
        const data = await res.json();

        setTitle(data.title);
        setAuthor(data.author);
        setContent(data.content);
        setTags(data.tags.join(', '));
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };

    if (param.id) {
      initBlog(param.id);
    }
  }, [param.id]);

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
      <div style={styles.container}>
        <h2 style={styles.title}>{param.id ? 'Edit Blog' : 'Create New Blog'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}

            style={styles.input}
          />
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}

            style={styles.input}
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={styles.input}
          />
          <div style={styles.quill}>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Write your blog here..."
            />
          </div>
          <button type="submit" style={styles.button}>
            {param.id ? 'Update Blog' : 'Submit Blog'}
          </button>
        </form>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: '2rem auto',
    padding: '1.5rem',
    border: '1px solid #ccc',
    borderRadius: '12px',
    backgroundColor: '#fdfdfd',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  quill: {
    marginBottom: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#0077cc',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'block',
    margin: 'auto',
  },
};

export default Createblog;
