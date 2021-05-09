const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const connectDB = async () => {
   try {
    await mongoose.connect(db, {
        newUserUrlParser: true
    })
    console.log("Mongo DB connected");
   }
   catch(err) {
    console.error(err.message)
   }

}

module.exports  = connectDB;