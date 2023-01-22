const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri =process.env.DB_URL;
const client = new MongoClient(uri);

module.exports = client;