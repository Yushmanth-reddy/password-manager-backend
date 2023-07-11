const mongoose = require("mongoose");

exports.connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
  } catch (err) {
    throw err;
  }
};

mongoose.set("strictQuery", false);
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});
