import mongoose from "mongoose";
mongoose.connect('mongodb://localhost:27017/SecondBrain');

const UserSchema = new mongoose.Schema({
    email:{type:String, required:true,unique:true},
    password:{type:String,required:true},
    username:{type:String, required:true,unique:true}
})

export const User = mongoose.model('User',UserSchema);
