import jwt from "jsonwebtoken";
import express from "express";
import { prisma } from "../lib/prisma";

type UserType = {
    id: number;
    name: string;
    email: string;
    password: string;
    bio?: string;
}

export async function auth(req:express.Request, res: express.Response, next:express.NextFunction) {
    const authorization = req.headers.authorization;
    const token = authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({msg: 'Unauthorized'});
    
    }
    try{
        const secret = process.env.JWT_SECRET as string;
        const decoded =  jwt.verify(token, secret) ;

        if(typeof decoded === 'string' || !decoded){
            return res.status(401).json({msg: 'Invalid token'});

        }
        const tokenUser = decoded as UserType;
        if(!tokenUser){
            return res.status(401).json({msg: 'Invalid token'});
        }

        const user = await prisma.user.findUnique({
            where: {
                id: tokenUser.id
            }
        });
        if(!user){
            return res.status(401).json({msg: 'User not found'});

        }
        res.locals.user = user;
        next();
    }catch(err){
        return res.status(401).json({msg: 'Unauthorized'});
    
    }
}