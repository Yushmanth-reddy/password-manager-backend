const NodeRSA = require("node-rsa");
const key = new NodeRSA({ b: 1024 });
const client = require("../configs/redis");
const Password = require("../models/passwords");

// add Password Feature
exports.addPass = async (req, res) => {
  const { username, Title, websiteURL, password } = req.body;
  const user = req.user;

  const publicKey = req.user.publicKey;
  const key_public = new NodeRSA(publicKey);

  const encryptedPassword = key_public.encrypt(password, "base64");
  const passwords = new Password({
    email: user.email,
    password: encryptedPassword,
    websiteURL,
    siteTitle: Title,
    userName: username,
  });

  await passwords
    .save()
    .then(() => {
      res.status(200).json({
        msg: "password stored",
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "internal server error",
      });
      console.log("hello");
    });
};

exports.showPass = async (req, res) => {
  const passId = req.params.passId;
  const user = req.user;

  const publicKey = req.user.publicKey;
  const privateKey = await client.GET(publicKey);

  // const key_public = new NodeRSA(publicKey)
  const key_private = new NodeRSA(privateKey);

  await Password.findOne({ _id: passId })
    .then((pass) => {
      const decryptedPassword = key_private.decrypt(pass.password, "utf8");
      res.status(200).json({
        websiteURL: pass.websiteURL,
        password: decryptedPassword,
      });
    })
    .catch((err) => {
      res.status(400).json({
        msg: "Password not found",
        mse: err.msg,
      });
    });
};

exports.deletePass = async (req, res) => {
  const passId = req.params.passId;
  const user = req.user;

  await Password.deleteOne({ _id: passId })
    .then(() => {
      res.status(200).json({
        msg: "Password deleted",
      });
    })
    .catch((err) => {
      res.json({
        msg: "password not found",
      });
    });
};


//update password function
exports.updatePass = async (req, res) => {
  const passId = req.params.passId;
  const user = req.user;
  const { websiteURL, password } = req.body;

  const publicKey = req.user.publicKey;
  const key_public = new NodeRSA(publicKey);

  const encryptedPassword = key_public.encrypt(password, "base64");
  // updating password in db
  await Password.updateOne(
    { _id: passId },
    { $set: { password: encryptedPassword, websiteURL } }
  )
    .then(() => {
      res.status(200).json({
        msg: "Password updated",
      });
    })
    .catch((err) => {
      res.json({
        msg: "Error in updating password",
      });
    });
};
