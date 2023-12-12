const mongoose = require("mongoose");
const mpngoURI = "mongodb://127.0.0.1:27017/inotebook"


// const connectToMongo =()=>{
    //     mongoose.connect(mpngoURI,()=>{
        //         console.log("Connected to mongo successfully")
//     })}

const connectToMongo = ()=>{
    mongoose.connect(mpngoURI);
        console.log("Connected to mongo successfully");

}



module.exports=connectToMongo;




