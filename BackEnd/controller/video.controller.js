import videos from "../model/video.model.js";   // importing videos model 

// function to fetch videos 
export const fetchVideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const video = await videos.findById(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      return res.status(200).json(video);
    }

    const allVideos = await videos.find().sort({ createdAt: -1 });
    return res.status(200).json(allVideos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// function to upload a video 
export const uploadVideo = async (req, res) => {
  try {
    const { title, thumbNail, channelName, description, videoUrl, category } = req.body;
    if (!title || !thumbNail || !channelName || !videoUrl) {
      return res.status(400).json({ message: "Title, thumbnail, channel name, and video URL are required" });
    }

    const video = new videos({
      title,
      thumbNail,
      channelName,
      description,
      videoUrl,
      category: category || "Other",
      uploadedBy: req.user.id,
    });
    await video.save();
    res.status(201).json({ message: "Video uploaded successfully", video });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// function to update a video 
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, thumbNail, channelName, description, videoUrl, category } = req.body;
    const video = await videos.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (title) video.title = title;
    if (thumbNail) video.thumbNail = thumbNail;
    if (channelName) video.channelName = channelName;
    if (description) video.description = description;
    if (videoUrl) video.videoUrl = videoUrl;
    if (category) video.category = category;

    await video.save();
    res.status(200).json({ message: "Video updated successfully", video });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// function to delete a video 
export const deleteVideo = async (req, res) => {
  try {
    const video = await videos.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};