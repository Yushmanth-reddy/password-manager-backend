const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const passRoutes = require("./routes/password");
const keyRoutes = require("./routes/Pkey");
const mongoose = require("mongoose");
const { connect } = require("./configs/db");
// require("./configs/redis");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use("/auth", authRoutes);
app.use("/pass", passRoutes);
// app.use("/key", keyRoutes);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// mongoose.set("strictQuery", false);
// mongoose
//   .connect(process.env.DB_URL)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`server running on port ${PORT}`);
//     });
//     console.log("Connected to db");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    connect();
    console.log("connected to backend!");
  }
});
