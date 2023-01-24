const dotenv = require("dotenv");
dotenv.config()
const express = require("express")
const cors = require("cors");
const authRoutes = require("./routes/auth")
const mongoose  = require("mongoose");
require("./configs/redis")



const app = express()
app.use(cors())
app.use(express.json())

app.use("/auth",authRoutes);

const PORT = process.env.PORT || 3300 

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URL)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`server running on port ${PORT}`);
    })
    console.log("Connected to db",);
})
.catch((err)=>{
    console.log(err);
    
})
