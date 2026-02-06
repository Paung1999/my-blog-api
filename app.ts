import express from 'express';
import cors from 'cors';

import userRouter from './routes/user';
import postRouter from './routes/post';
import commentRouter from './routes/comment';



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=> {
    res.json('My blog api is up and running!')
})
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

app.listen(8800, ()=> {
    console.log('Server is running at port 8800')
});
