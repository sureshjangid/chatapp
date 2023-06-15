const mongoose = require("mongoose");
const color = require("colors");

const conntectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${con.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit();
  }
};


module.exports = conntectDB;