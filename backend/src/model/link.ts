import mongoose from "mongoose";

const LinkSchema= new mongoose.Schema({
    hash:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    }
});

export const Link = mongoose.model('Link',LinkSchema);
