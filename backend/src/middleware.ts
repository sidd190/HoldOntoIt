import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware =(req:Request,res:Response,next:NextFunction)=>{
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string,"JigglyJiggly");
    if(decoded){
        //@ts-ignore
        req.userId = decoded.id;
        next();
    }
    else{
        res.status(403).json({message:"Not logged in."})
    }
}