const mongoose = require("mongoose");
require("dotenv").config();

const MONGOSTRING = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);

    const con = await mongoose.connect(MONGOSTRING, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    console.error("Error: ", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
