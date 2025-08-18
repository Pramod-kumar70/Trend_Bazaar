const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();

const user = process.env.USERID;
const pass = process.env.PASS;
const dbName = process.env.DBNAME;
const PORT = process.env.PORT;

// Construct Mongo URI
const URI = `mongodb+srv://${user}:${pass}@cluster0ne.4hhjel9.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0ne`;

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB Connected Successfully! on port " ,PORT);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports =  connectDB;
