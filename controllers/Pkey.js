const client = require("../configs/redis");

exports.storePrivateKey = async (req, res) => {
  const { privateKey } = req.body;
  const publicKey = req.user.publicKey;
  const data = await client.SET(publicKey, privateKey, { EX: 600 });
  if (data === "OK") {
    res.status(200).json({
      msg: "Private key stored",
    });
  } else {
    res.status(500).json({
      message: "internal server error",
    });
  }
};
