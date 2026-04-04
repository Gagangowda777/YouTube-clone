import channels from "../model/channel.model.js"; // importing channels model from channdelmodel

// function to create channel 
export const createChannel = async (req, res) => {
  try {
    const { channelName, channelDescription, displayPicture } = req.body;
    const userName = req.user?.name;
    if (!channelName || !userName) {
      return res.status(400).json({ message: "Channel name and authenticated user are required" });
    }

    const existingChannel = await channels.findOne({ channelName });
    if (existingChannel) {
      return res.status(400).json({ message: "Channel name already exists" });
    }

    const channel = new channels({
      channelName,
      userName,
      channelDescription,
      displayPicture,
      owner: req.user.id,
    });
    await channel.save();

    res.status(201).json({ message: "Channel created successfully", channel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// function to fetch channel  
export const fetchInfo = async (req, res) => {
  try {
    const { name } = req.params;
    const channel = await channels.findOne({ channelName: name });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    res.status(200).json({ channel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};