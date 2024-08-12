const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   tasks: [
      {
         type: mongoose.Types.ObjectId,
         ref: "task"
      }
   ]
});

const user = mongoose.model("user", userSchema);
module.exports = user;
