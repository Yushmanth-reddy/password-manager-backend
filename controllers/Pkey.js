const client = require('../configs/redis');

// privateKey function
exports.storePrivateKey = async (req,res) => {
  const { privateKey } = req.body;
  const publicKey = req.user.publicKey;
  // storing the public key, private key set in the database
  // doubt ex-600 part
  await client.SET(publicKey, privateKey, { EX: 600 }, (err, data) => {
    if (err) {
      res.status(500).json({
        message: "internal server error",
      });
    } else {
      res.status(200).json({
        msg: "Private key stored",
      });
    }
  });
}