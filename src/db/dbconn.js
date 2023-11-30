const mongoose = require('mongoose');

const Dbconnection = async ()=>{
    try {
    const connect = await mongoose.connect("mongodb://localhost:27017/men100m-api")
    console.log("DB is connected successfully")
    } catch (error) {
      console.log(error)  
    }
    
}
Dbconnection();
