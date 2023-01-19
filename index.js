const dotenv = require("dotenv");
dotenv.config()
const express = require("express")
const cors = require("cors");
const { default: mongoose } = require("mongoose");


const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3300 

mongoose.set("strictQuery", false);

mongoose.connect(process.env.DB_URL,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("connected to database");
    }
})

app.listen(PORT,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log(`listening to port ${PORT}`);
    }
})