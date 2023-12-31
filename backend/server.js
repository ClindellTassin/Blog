import express from "express";
import { config } from "dotenv"
import connect from "./config/dbConnect.js";
import userRoutes from "./routes/user.js";
import { errorHandler, notFound } from "./middlewares/errors/errorHandler.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js"
import emailRoutes from "./routes/email.js";
import categoryRoutes from "./routes/category.js";

config();
connect();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/categories', categoryRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port: ${PORT}`));
