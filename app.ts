import express from 'express';
import cors from 'cors';

import userRouter from './routes/user';
import postRouter from './routes/post';
import commentRouter from './routes/comment';

const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CLIENT_URL?.split(",").map((s) => s.trim().replace(/\/+$/, "")) ?? []),
];

const app = express();

app.use(cors({origin: allowedOrigins}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=> {
    res.json('My blog api is up and running!')
})
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(8800, ()=> {
    console.log('Server is running at port 8800')
});
