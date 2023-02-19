const client = require("../configs/redis");

exports.storePrivateKey = async (req, res) => {
  let { privateKey } = req.body;
  const publicKey = req.user.publicKey;
  const data = await client.SET(publicKey, privateKey, { EX: 600 });
  privateKey = privateKey.replace(/\\n/g, "\n");
  if (data === "OK") {
    res.status(200).json({
      msg: "Private key stored",
    });
    // console.log(typeof privateKey);
    console.log(privateKey);
    // console.log("hello\nyushman");
  } else {
    res.status(500).json({
      message: "internal server error",
    });
  }
};
