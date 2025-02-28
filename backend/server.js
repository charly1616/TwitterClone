import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();
const app = express();
const PORT  = process.env.PORT || 8000;

app.use("/api/auth", authRoutes)

app.listen(8000, ()=>{
    console.log(`http://localhost:${PORT}/api/auth/login`);
    connectMongoDB();
})
