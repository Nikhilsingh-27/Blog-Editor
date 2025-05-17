const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./schema");
const cors=require("cors")
const app = express();
app.use(express.json()); // built-in body parser
app.use(cors());
mongoose.connect("mongodb://localhost:27017/BlogEditor")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Root route
app.get("/", (req, res) => {
  res.send("Hello from Blog API");
});

// Create new blog (publish or draft depending on status field)
app.post("/api/blogs/publish", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put(`/api/blogs/publish/:id`, async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }  
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// Get all blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const allblogs = await Blog.find();
    res.json(allblogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get blog by id
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is listening on PORT ${PORT}`);
});
