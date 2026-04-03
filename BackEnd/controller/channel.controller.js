import channels from "../model/channel.model.js"

export const createChannel = async (req, res) =>{
    try{
        const {channelName, userName, channelDescription, displayPicture} = req.body;
        const existingChannel = await channels.findOne({channelName})
        if(existingChannel){
            return res.status(400).json({message:"Channel Name already exist"})
        }

        const channel = new channels({channelName, userName, channelDescription, displayPicture})
        await channel.save()
        res.status(201).json({message: "Channel Created"})

    }catch(err){
        res.status(500).json({message: err.message})
    }
}

export const fetchInfo = async (req, res) => {
    try{
        const {name} = req.params;
        const channel = await channels.findOne({channelName: name})
        if(!channel){
            res.status(404).json({message: "Channel not found"})
        }
        res.status(200).json({channel})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}