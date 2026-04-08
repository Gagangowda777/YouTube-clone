import comments from "../model/comments.model.js"; // importing channels model 

// function to add a comment 
export const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { videoId } = req.params;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    const content = new comments({
      comment,
      videoId,
      userName: req.user?.name || "Anonymous",
      userId: req.user?.id,
    });
    await content.save();
    res.status(201).json({ message: "Comment posted successfully", comment: content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// function to fetch comments 
export const fetchComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    const commentList = await comments.find({ videoId }).sort({ createdAt: -1 });
    return res.status(200).json(commentList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// function to update a comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const existingComment = await comments.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Verify user owns the comment
    if (existingComment.userId.toString() !== req.user?.id) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    existingComment.comment = comment;
    await existingComment.save();
    res.status(200).json({ message: "Comment updated successfully", comment: existingComment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// function to delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const existingComment = await comments.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Verify user owns the comment
    if (existingComment.userId.toString() !== req.user?.id) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    await comments.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};