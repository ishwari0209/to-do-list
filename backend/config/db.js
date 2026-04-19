const mongoose = require("mongoose");

const connectDB = async () => {
try {
const conn=mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");
} catch (error) {
console.log(error);
}
};

module.exports = connectDB;
