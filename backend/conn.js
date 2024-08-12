const mongoose = require("mongoose");

const conn = async () => {
   try {
      const res = await mongoose.connect(process.env.MONGO_URI);
      if (res) {
         console.log("Connected to DataBase");
      }
   } catch (error) {
      console.log(error);
   }
};

module.exports = conn;
