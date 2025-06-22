import express from 'express'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {User} from './model/user';
import { Content } from './model/content';
import { authMiddleware } from './middleware';
import { Link } from './model/link';
import { random } from './utils';

const app = express();
app.use(express.json());

const JWT_SECRET = "JigglyJiggly";

app.post('/api/v1/signup',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    try {
        await User.create({
            username,
            password,
            email
        });
        res.json({messsage:"User signed up."})
    } catch (error) {
        res.status(401).json({message:"User already exists."})
    }
})

app.post('/api/v1/signin',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await User.findOne({
        username,
        password
    });
    if(existingUser){
        const token = jwt.sign({
            id:existingUser._id,
        },JWT_SECRET);
        res.json({
            token
        })
    }
    else{
        res.status(403).json({message:"Incorrect Credentials"});
    }
})

app.post('/api/v1/content',authMiddleware,async (req,res)=>{
    const {link,type,title,tag} = req.body;
    try {
        await Content.create({
            link,
            type,
            title,
            //@ts-ignore
            userId:req.userId,
            tag:[],
        })
        res.json({message:"Added"});
    } catch (error) {
        res.status(403).json({message:"Error" + error});
    }
})

app.get('/api/v1/content',authMiddleware,async (req,res)=>{
    //@ts-ignore
    const userId = req.userId;
    try {
        const content = await Content.find({userId:userId}).populate("userId","username");
        res.json({content})
    } catch (error) {
        res.status(404).json({message:"Content not found!"});
        console.log("Error in getContent controller : "+error);
    }
})

app.delete('/api/v1/content',authMiddleware,async (req,res)=>{
    const contentId = req.body.contentId;
    await Content.deleteMany({
        contentId,
        //@ts-ignore
        userId:req.userId
    })
})

app.post('/api/v1/brain/share',authMiddleware,async (req,res)=>{
    const share= req.body.share;
    const hash = random(10);
    if(share){
        const exisitingLink = await Link.findOne({
            //@ts-ignore
            userId:req.userId
        });
        if(exisitingLink){
            res.json({
                message:"already exisits : /share/"+exisitingLink.hash
            })
        }
        await Link.create({
            //@ts-ignore
            userId:req.userId,
            hash
        })
        res.json({
            message:"/share/"+hash
        })
    }
    else{
        await Link.deleteOne({
            //@ts-ignore
            userId:req.userId
        });
        res.json({
            message:"Removed Link"
        })
    }
})

app.get('/api/v1/brain/:shareLink',async (req,res)=>{
    const hash = req.params.shareLink;

    const link = await Link.findOne({
        hash:hash
    })
    if (!link){
        res.status(411).json({message:"Invalid sharelink"});
        return;
    }

    const content = await Content.find({
        userId:link.userId
    })
    const user= await User.find({
        _id:link.userId
    })

    if(!user){
        res.status(404).json({message:"INVALID ERROR IN ShARELink"})
        return;
    }
    res.json({
        //@ts-ignore
        username:user.username,
        content:content
    })
})

app.listen(5000,()=>{
    console.log("Server running on port 5000");
})