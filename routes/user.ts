import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import {prisma } from "../lib/prisma";
import { auth } from "../middleware/auth";


const userRouter = Router();

userRouter.get('/verify',auth, async (req , res)=> {
    const {id } = res.locals.user;
    const user = await prisma.user.findUnique({
        where: {id}
    });
    res.json(user);
})

userRouter.post('/register', async(req , res) => {
    const name = req.body?.name;
    const email = req.body?.email;
    const password = req.body?.password;
    const confirmPassword = req.body?.confirmPassword;
    
    if(!name || !email || !password) {
        return res.status(400).json({msg: 'name, email and password are required'});
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if(existingUser) {
        return res.status(400).json({msg: 'User already exists'});
    }
    if(password !== confirmPassword){
        return res.status(400).json({msg: 'Passwords do not match'});
    }

    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: await bcrypt.hash(password,10)
        },
        select: {
            id: true,
            name: true,
            email: true
        }
    });
    res.json(user);
});

userRouter.post('/login', async (req , res) => {
    const email = req.body?.email;
    const password = req.body?.password;

    if(!email || !password){
        return res.status(400).json({msg: 'Email and password are required'});

    }
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true
        
        }
    });
    if(user){
        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign({
                id: user.id,
                role: user.role
            }, process.env.JWT_SECRET as string, {
                expiresIn: '15min'
            });
            return res.json({token, user});
        }
    }
    return res.status(400).json({msg: 'Invalid credentials'});
});

userRouter.put('/profile', auth , async(req ,res) => {
    try{
        const { id } = res.locals.user;
        const { bio } = req.body;
        if(!id) {
            return res.status(400).json({msg: 'Unable to find user'});
        }
        if(!bio){
            return res.status(400).json({msg: 'Bio is required'});
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                bio: bio
            }
        });
        res.json(updatedUser);

    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Something went wrong'});
    }
})

export default userRouter;