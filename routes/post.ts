import { Router } from "express";

import { prisma } from "../lib/prisma";
import { auth, checkRole } from "../middleware/auth";

const postRouter = Router();

postRouter.get('/', async (req , res)=> {
    try{
        const posts  = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 20,
        include:{
            author: {
                select: {
                    id: true,
                    name: true,
                }
            },
            comment: true
        }
    });
    res.json(posts);

    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Something went wrong'})
    }

});

postRouter.get('/:id', async(req , res )=> {
    try{
        const {id }= req.params;
        const post = await prisma.post.findUnique({
        where: {
            id : Number(id)
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true
                }
            },
            comment: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }

                }
            }

        },
    });
    if(!post){
        return res.status(404).json({msg: 'Post not found'})
    }
    res.json(post);

    }catch(err){
        console.log(err);
        return res.status(500).json({msg: 'Something went wrong'})
    }
});

postRouter.post('/',auth, checkRole('ADMIN'), async (req , res )=> {
    try{
        const user = res.locals.user;
        const title = req.body?.title;
        const content = req.body?.content;

        if(!title || !content){
            return res.status(400).json({msg: 'Title and content are required'});
        }

        const post = await prisma.post.create({
            data: {
                title: title,
                content: content,
                authorId: user.id

            },
        });
        res.json(post);

    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Something went wrong'});

    }
});

postRouter.put('/:id', auth, checkRole('ADDMIN'), async(req, res)=> {
    try{
        const user = res.locals.user;
        const {id } = req.params;
        const post = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        });
        if(!post){
            return res.status(404).json({msg: 'Post not found'})
        }
        if(post.authorId !== user.id){
            return res.status(401).json({msg: 'You are not authorized to edit this post'})
        
        }

        const title = req.body?.title;
        const content = req.body?.content;
        if(!title || !content){
            return res.status(400).json({msg: 'Title and content are required'})
        }
        const updatedPost = await prisma.post.update({
            where: {
                id: Number(id)
            },
            data: {
                title: title,
                content: content
            }
        });
        res.json({
            msg: 'Post updated',
            post: updatedPost
        });

    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Something went wrong'})
    }
});

postRouter.delete('/:id', auth, async (req , res ) => {
    try{
        const {id} = req.params;
        const user = res.locals.user;
        const post = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        });

        if(!post){
            return res.status(404).json({msg: 'Post not found'})
        }
        if( post.authorId !== user.id){
            return res.status(401).json({msg: 'You are not authorized to delete this post'})
        }
        await prisma.post.delete({
            where: {
                id: Number(id)
            }
        });
        res.json({msg: 'Post deleted'});

    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Something went wrong'})
    }
});

postRouter.post('/:id/comments', auth, async(req ,res)=> {
    try{
        const {id} = req.params;
        const user = res.locals.user;
        const content = req.body?.content;
        if(!content){
            return res.status(400).json({msg: 'Content is required'})
        }
        const post = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        });
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }

        const comment = await prisma.comment.create({
            data: {
                content: content,
                postId: Number(id),
                userId: user.id
            }
        });
        res.json(comment);

    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Something went wrong'});
    }
});

export default postRouter;