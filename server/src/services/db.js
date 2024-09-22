const mongoose = require("mongoose")

const MONGO_URL = process.env.MONGO_URL




mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready");
    
})

mongoose.connection.on("error", (err) => {
    console.error(err);
    
})

async function dbConnect () {
    //await mongoose.connect("mongodb://127.0.0.1/nasaDB")
    await mongoose.connect(MONGO_URL)
}

async function dbDisconnect () {
   await mongoose.disconnect() 
}
module.exports = { dbConnect, dbDisconnect }