const mongoose = require("mongoose");
const schema = mongoose.Schema;

const passwordSchema = new schema({
  websiteURL: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  siteTitle: {
    type: String,
    required: true,
    trim: true,
  },
});

const Password = mongoose.model("Password", passwordSchema);

module.exports = Password;
