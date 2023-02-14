const jwt = require("jsonwebtoken");
const client = require("../configs/redis");
const User = require("../models/user");

exports.verifyRefresh = (req, res, next) => {
  const refreshToken = req.headers.authorization;

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_KEY,
    async (err, decoded) => {
      if (err) {
        res.json({
          msg: "Error in jwt token",
        });
      } else {
        const userId = decoded.aud;
        await client
          .GET(userId[0])
          .then(async (result) => {
            if (result === refreshToken) {
              const user = await User.findOne({ _id: userId });
              req.user = user;
              next();
            } else {
              res.json({
                msg: "Unauthorized",
              });
            }
          })
          .catch((err) => {
            console.log(err.message);

            res.status(500).json({
              msg: "internal server error",
            });
          });
      }
    }
  );
};

exports.verifyAccess = (req, res, next) => {
  console.log(req.headers);
  const accessToken = req.headers.authorization.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, async (err, decoded) => {
    if (err) {
      console.log(err);
      res.status(400).json({
        msg: "Error in jwt token",
      });
    } else {
      const userId = decoded.aud;
      const user = await User.findOne({ _id: userId });
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({
          msg: "Invalid token",
        });
      }
    }
  });
};
