import mongoose from "mongoose";
const ContentTypes = ['Youtube','Twitter'];

mongoose.connect('mongodb://localhost:27017/SecondBrain');

const ContentSchema = new mongoose.Schema({
    link:{type:String, required:true},
    type:{type:String,required:true},
    title:{type:String,required:true},
    tag:[{type:mongoose.Schema.Types.ObjectId,ref:'Tag' }],
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true}
});

export const Content= mongoose.model('Content', ContentSchema);
