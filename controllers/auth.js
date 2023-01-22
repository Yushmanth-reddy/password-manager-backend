const User = require("../models/user");
const {body,validationResult} = require('express-validator')
const bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');

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
                const user = new User({
                    email,
                    name,
                    password:hash
                })
                
                await user.save();

                
                    const Apayload = {}
                    const Aoptions = {
                        expiresIn : "1h",
                        audience: [user._id]
                    }
    
                    var accessToken = jwt.sign(Apayload, process.env.JWT_ACCESS_KEY,Aoptions);

                
                
                    const Rpayload = {}
                    const Roptions = {
                        expiresIn : "1y",
                        audience: [user._id]
                    }
    
                    var refreshToken = jwt.sign(Rpayload, process.env.JWT_REFRESH_KEY,Roptions);

                

                res.json({accessToken,refreshToken})
                
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

exports.signin = (req,res) => {
    console.log("kjdhfs");
}