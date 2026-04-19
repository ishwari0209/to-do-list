const mongoose = require("mongoose");

const connectDB = async () => {
try {
mongoose.connect("mongodb://127.0.0.1:27017/TodoDb")
console.log("MongoDB connected");
} catch (error) {
console.log(error);
}
};

module.exports = connectDB;
