import { Router } from "express";
import { prisma } from "../lib/prisma";
import { auth } from "../middleware/auth";


const  commentRouter = Router();

commentRouter.get('/', async(req ,res)=> {
    try{
        const {userId} = req.query;
        if(!userId){
            return res.status(400).json({msg: 'User id is required!'})

        }
        const comments = await prisma.comment.findMany({
            where: {userId: Number(userId)},
            orderBy: {createdAt: 'desc'},
            take: 20,
            include: {
                post: true
            }
        });
        res.json(comments);


    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Something went wrong!'})
    }
})

commentRouter.delete('/:id', auth, async (req , res)=> {
    try{
        const {id } = req.params;
        const user = res.locals.user;
        const comment = await prisma.comment.findUnique({
            where: {
                id: Number(id)
            }
        });
        if(!comment){
            return res.status(404).json({msg: 'Comment not found!'})
        }
        
        const post = await prisma.post.findUnique({
            where: {
                id: comment.postId
            }
        });
        if(!post){
            return res.status(404).json({msg: 'Post not found!'})
        }

        if(post.authorId !== user.id || comment.userId !== user.id){
            return res.status(401).json({msg: 'You are not authorized to delete this post!'})
        }
        
        await prisma.comment.delete({
            where: {
                id: Number(id)
            }
        });
        res.json({msg: 'Comment deleted!'});

    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Something went wrong!'})
    }
});

export default commentRouter;