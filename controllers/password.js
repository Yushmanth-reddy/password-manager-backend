const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 1024});
const client = require('../configs/redis');
const Password = require('../models/passwords')

exports.addPass = async (req,res) => {
    const {websiteURL, password} = req.body;
    const user = req.user;

    const publicKey = req.user.publicKey;
    const privateKey = await client.GET(publicKey);
    
    const key_public = new NodeRSA(publicKey)
    const key_private = new NodeRSA(privateKey)

    const encryptedPassword = key_public.encrypt(password,'base64');

    const passwords = new Password({
        email:user.email,
        password:encryptedPassword,
        websiteURL
    })

    await passwords.save()
    .then(()=>{
        res.status(200).json({
            msg:"password stored"
        })
    })
    .catch((err)=>{
        res.status(500).json({
            msg:"internal server error"
        })
    })

    const decrypt = key_private.decrypt(encryptedPassword,'utf8')
    console.log(decrypt);
}

exports.showPass = async (req,res) =>{
    
}