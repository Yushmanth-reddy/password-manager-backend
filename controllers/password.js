const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 1024});

exports.getAll = (req,res) => {
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');
    console.log(publicKey);
    console.log(privateKey);
}