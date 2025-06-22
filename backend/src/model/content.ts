import mongoose from "mongoose";

const ContentTypes = ['audio','video','article','link'];

const ContentSchema = new mongoose.Schema({
    link:{type:String, required:true},
    type:{type:String, enum:ContentTypes,required:true},
    title:{type:String,required:true},
    tag:[{type:mongoose.Types.ObjectId,ref:'Tag' }],
    userId:{type:mongoose.Types.ObjectId, ref:'User', required:true}
});

export const Content= mongoose.model('Content', ContentSchema);
