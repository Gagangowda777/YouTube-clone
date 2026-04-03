import videos from "../model/video.model.js";

export const fetchVideo = async (req, res) => {
    try{
        const {title} = req.params;
        const video = await videos.findOne({title: title})
        if(!video){
            res.status(404).json({message: "video not found"})
        }
        res.status(200).json(video)
    }catch(err){
        res.status(500).json({message: err.message})
    }

}

export const uploadVideo = async(req, res) => {
    try{
        const {title, thumbNail, channelName} = req.body;

        const video = new videos({title, thumbNail, channelName})
        await video.save()
        res.status(200).json({message: "video uploaded"})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

export const deleteVideo = async(req, res) => {
    try{
        const video = await videos.findByIdAndDelete(req.params.id)
        if(!video){
            return res.status(404).json({message: "Video not found"})
        }
        res.json({message: "Video deleted"})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}