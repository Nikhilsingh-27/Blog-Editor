const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String},
    author: { type: String},
    content: { type: String},
    tags: [String],
    status: { type: String, enum: ["draft", "published"], default: "draft" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Blog", blogSchema);
