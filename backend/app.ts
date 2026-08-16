import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import chatRoutes from "./routes/chat.route";
import cookieParser from "cookie-parser";
const upload = multer();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
})
);


app.get("/", (req: Request, res: Response) => {
    res.send("Hel World");
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/chat',chatRoutes);

export default app;