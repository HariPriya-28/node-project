const express  =require("express");
const mongoose = require ("mongoose");
const cors = require ("cors");
const dotenv = require ("dotenv");
const authMiddleware = require("./middleware/authMiddleware");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api",[authMiddleware],require("./routes/laptopRoutes"));
app.use("/api",[authMiddleware],require("./routes/mobileRoutes"));
app.use("/api",[authMiddleware],require("./routes/watchRoutes"));
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log(" Successfully Connected to MongoDB");
    app.listen(process.env.PORT || 5000,'0.0.0.0',()=>{
        console.log("Server Started to listen on port 5000");
    })
}).catch((err)=>{
    console.log(" Error in Connecting to MongoDB");
})