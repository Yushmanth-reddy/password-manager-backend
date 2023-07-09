const NodeRSA = require("node-rsa");
const key = new NodeRSA({ b: 1024 });
const client = require("../configs/redis");
const Password = require("../models/passwords");
const { createError } = require("../utils/error");

// add Password Feature
exports.addPass = async (req, res, next) => {
  try {
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

    await passwords.save();
    res.status(200).json({
      msg: "password stored",
    });
  } catch (err) {
    next(err);
  }
};

exports.showPass = async (req, res, next) => {
  try {
    const passId = req.params.passId;
    const user = req.user;
    let privateKey = req.body.privateKey;
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }
    const key_private = new NodeRSA(privateKey);

    const passwordDetailes = await Password.findOne({
      _id: passId,
      email: user.email,
    });
    if (passwordDetailes) {
      const decryptedPassword = key_private.decrypt(
        passwordDetailes.password,
        "utf8"
      );
      res.status(200).json({
        websiteURL: passwordDetailes.websiteURL,
        password: decryptedPassword,
      });
    } else {
      return next(createError(400, "Password not found"));
    }
  } catch (err) {
    next(err);
  }
};

exports.deletePass = async (req, res, next) => {
  try {
    const passId = req.params.passId;
    const user = req.user;

    const { deletedCount } = await Password.deleteOne({
      _id: passId,
      email: user.email,
    });

    if (deletedCount === 0)
      return next(
        createError(400, "Error in deleting the password(password not found)")
      );

    res.status(200).json({
      msg: "Password deleted",
    });
  } catch (err) {
    next(err);
  }
};

//update password function
exports.updatePass = async (req, res, next) => {
  try {
    const passId = req.params.passId;
    const user = req.user;
    const { websiteURL, password, Title, username } = req.body;

    const publicKey = req.user.publicKey;
    const key_public = new NodeRSA(publicKey);
    const encryptedPassword = key_public.encrypt(password, "base64");

    const { modifiedCount } = await Password.updateOne(
      { _id: passId, email: user.email },
      {
        $set: {
          password: encryptedPassword,
          websiteURL,
          siteTitle: Title,
          userName: username,
        },
      }
    );
    if (modifiedCount === 0) {
      return next(
        createError(400, "Error in updating the password (password not found)")
      );
    }
    res.status(200).json({
      msg: "Password updated",
    });
  } catch (err) {
    next(err);
  }
};

exports.getPass = async (req, res, next) => {
  try {
    const passId = req.params.passId;
    const user = req.user;
    let privateKey = req.body.privateKey;
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }
    const key_private = new NodeRSA(privateKey);

    const passwordDetailes = await Password.findOne({
      _id: passId,
      email: user.email,
    });
    if (passwordDetailes) {
      const decryptedPassword = key_private.decrypt(
        passwordDetailes.password,
        "utf8"
      );
      res.status(200).json({
        websiteURL: passwordDetailes.websiteURL,
        password: decryptedPassword,
        userName: passwordDetailes.userName,
        siteTitle: passwordDetailes.siteTitle,
      });
    } else {
      return next(createError(400, "Password not found"));
    }
  } catch (err) {
    next(err);
  }
};

exports.getallpass = async (req, res, next) => {
  try {
    const { email } = req.user;
    const allPasswords = await Password.find({ email: email });
    if (allPasswords) {
      res.status(200).json(allPasswords);
    } else {
      return next(createError(400, "Passwords not found"));
    }
  } catch (err) {
    next(err);
  }
};
