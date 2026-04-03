import comments from "../model/comments.model.js";

export const addComment = async (req, res) => {
    try{
        const {comment, userName} = req.body; 
        if(!comment){
            res.status(404).json({message: "cant post empty commet"})
        }
        const content = new comments({comment, userName})
        await content.save()
        res.status(201).json({message: "comment posted"})
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

export const fetchComment = async(req, res) => {
    try{
        const {userName} = req.params; 
        const comment = await comments.find({userName})
        
        return res.status(200).json(comment)

    }catch(err){
        res.status(500).json({message: err.message})
    }
}