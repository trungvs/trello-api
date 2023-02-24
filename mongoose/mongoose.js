require("dotenv").config()


const mongoose = require("mongoose")
mongoose.set('strictQuery', false);
async function connectDB() {
    await mongoose.connect(process.env.DB_STRING)
}

module.exports = {
    connectDB
}