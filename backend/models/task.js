const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
      unique: true
   },
   desc: {
      type: String,
      required: true
   },
   imp: {
      type: Boolean,
      default: false
   },
   comp: {
      type: Boolean,
      default: false
   }
},{timestamps: true});

const task = mongoose.model("task", taskSchema);
module.exports = task;
