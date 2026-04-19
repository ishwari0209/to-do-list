const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
title: {
type: String,
required: true
},
Duration:{
    type: Date

},
status: {
  type: Boolean,
  default: false
}
});

module.exports = mongoose.model("Tasks", taskSchema);
