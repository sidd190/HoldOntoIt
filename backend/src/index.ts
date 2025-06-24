import express, { Request, Response } from 'express'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const {User} = require('dimsee');
import { Content } from './model/content';
const {authMiddleware} = require('dimsee/backend');
import { Link } from './model/link';
import { random } from './utils';
const { createAuthBackend } = require('dimsee/backend');

if (!mongoose.models.User) {
    mongoose.models.User = User;
}

const app = createAuthBackend({
    mongoUri:"mongodb://localhost:27017/SecondBrain",
    jwtSecret:"JigglyJiggly",
    jwtExpiry: '15m'
});

app.use(express.json());

interface CustomRequest extends Request {
    user?: { userId: string };
}

app.post('/api/v1/content', authMiddleware, async (req: CustomRequest, res: Response) => {
    const { link, type, title, tag } = req.body;
    try {
        await Content.create({
            link,
            type,
            title,
            userId: req.user?.userId,
            tag: tag || [],
        }); 
        res.json({ message: "Added" });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Error occurred" + error });
    }
});

app.get('/api/v1/content', authMiddleware, async (req: CustomRequest, res: Response) => {
    const userId = (req.user?.userId);
    try {
        const content = await Content.find({userId});
        res.json({ content });
    } catch (error) {
        //@ts-ignore
        res.status(404).json({ message: "Content not found!", error: error.message });
    }
});

app.delete('/api/v1/content',authMiddleware,async (req: Request, res: Response)=>{
    const contentId = req.body.contentId;
    await Content.deleteMany({
        contentId,
        //@ts-ignore
        userId:req.userId
    })
})

app.post('/api/v1/brain/share',authMiddleware,async (req: Request, res: Response)=>{
    const share= req.body.share;
    const hash = random(10);
    if(share){
        const exisitingLink = await Link.findOne({
            //@ts-ignore
            userId:req.user.userId,
        });
        if(exisitingLink){
            res.json({
                message:"already exisits : /share/"+exisitingLink.hash
            })
        }
        await Link.create({
            //@ts-ignore
            userId:req.user.userId,
            hash
        })
        res.json({
            message:"/share/"+hash
        })
    }
    else{
        await Link.deleteOne({
            //@ts-ignore
            userId:req.user.userId
        });
        res.json({
            message:"Removed Link"
        })
    }
})

app.get('/api/v1/brain/:shareLink',async (req: Request, res: Response)=>{
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