import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser'
import  productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';    
import paymentRoutes from './routes/payment.route.js';
import couponRoutes from './routes/coupon.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import cors from "cors";
dotenv.config();    
const app=express();

const PORT=process.env.PORT|| 5000;

app.use(express.json({limit: "30mb", extended: true}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // ✅ Handles form data
app.use("/api/auth",authRoutes)
app.use("/api/products",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/coupon",couponRoutes)
app.use("/api/payment",paymentRoutes)
app.use("/api/analytics",analyticsRoutes)
app.use(
    cors({
      origin: "http://localhost:5173", // ✅ Allow frontend URL
      credentials: true, // ✅ Allow cookies & authentication headers
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});





app.listen(PORT,()=>{
    console.log("server started at "+ PORT);
    connectDB();
})