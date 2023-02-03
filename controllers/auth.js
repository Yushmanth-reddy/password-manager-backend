const User = require("../models/user");
const {body,validationResult} = require('express-validator')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const client = require('../configs/redis');
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 1024});

const accessTokenGenerator = (user) => {
    const payload = {}
    const options = {
        expiresIn : "1h",
        audience: [user._id]
    }
    var accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY,options);

    return accessToken
}

const refreshTokenGenerator = (user) => {
    const payload = {}
    const options = {
        expiresIn : "1y",
        audience: [user._id]
    }
    var refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY,options);
    const userId = user._id.toString()

    client.SET(userId,refreshToken, {EX: 365 * 24 * 60 * 60  } ,(err)=>{
        if (err) {
            res.status(500).json({
                message:"internal server error"
            })
        } 
    })
    
    return refreshToken
}



exports.signup = async(req,res) => {
    const {email,name,password} = req.body;

    const validationErrors = validationResult(req)
    if(validationErrors.isEmpty()){
        const isExist = await User.findOne({email:email});

        if(isExist){
            res.json({
                message:"user already exists"
            })
        }
        else{
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    res.json({
                        msg:"err in hashing password"
                    })
                } 
                else {
                    const publicKey = key.exportKey('public');
                    const privateKey = key.exportKey('private');
                    const user = new User({
                        email,
                        name,
                        password:hash,
                        publicKey
                    })
                    
                    await user.save();
                    const accessToken = accessTokenGenerator(user);
                    const refreshToken = refreshTokenGenerator(user);
    
                    res.status(200).json({accessToken,refreshToken,privateKey})
                }
                
            });
        }

    }
    else{
        const errors = validationErrors.array().map((err) => {
            return{
                msg:err.msg
            }
        })
        res.json({
            errors
        })
    }

}

exports.signin = async (req,res) => {
    const {email,password} = req.body;
    const validationErrors = validationResult(req);
    if(validationErrors.isEmpty()){
        const isExist = await User.findOne({email:email});
            if (!isExist) {
                res.json({ message: "User does not exist" 
            })
        }
        //if user exist than compare password
            //password comes from the user
            //user.password comes from the database
            else{
                bcrypt.compare(password, isExist.password, (err, data) => {
                    if(err){
                        res.json({
                            msg:"err in hashing password"
                        })
                    }
                    else{
                        const accessToken = accessTokenGenerator(isExist);
                        const refreshToken = refreshTokenGenerator(isExist);
                        res.json({accessToken,refreshToken})
                    }
                  }
                )
            }
           
    }
}

exports.refreshToken = async (req,res) => {
    const user = req.user;

    const accessToken = accessTokenGenerator(user);
    const refreshToken = refreshTokenGenerator(user);

    res.json({accessToken,refreshToken})
}

exports.logout = async (req,res) => {
    const userId = req.user._id.toString()
    client.DEL(userId)
    .then((data)=>{
        res.json({
            msg:"User loggedout successfully"
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({
            msg:"internal server error"
        })
    })
}

