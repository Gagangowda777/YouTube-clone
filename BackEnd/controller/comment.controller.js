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