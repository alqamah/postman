import express from "express";
import cookieParser from "cookie-parser";
import UserRouter from "./features/user/user.routes.js";
import PostRouter from "./features/post/post.routes.js";
import CommentRouter from "./features/comment/comment.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use('/api/user', UserRouter);
app.use('/api/post', PostRouter);
app.use('/api/comment', CommentRouter);

export default app;