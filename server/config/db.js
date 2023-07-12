import mongoose from 'mongoose'
import dotenv from "dotenv";
import fs from 'fs'
dotenv.config()

// Read the CA certificate file
// const caCert = fs.readFileSync('/path/to/ca.pem');
const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URL,{ ssl: true, sslValidate: false });
};

mongoose.connection.on("connected",()=>{
    console.log("mongo is connected");
});
// mongoose.connect('mongodb://username:password@localhost:27017/mydatabase', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   ssl: true,
//   sslValidate: true,
//   sslCA: fs.readFileSync('/path/to/ca.pem')
// });
mongoose.set('toJSON',{
    virtuals: true,
    transform: (doc,converted)=>{
        delete converted._id;
    }
});

export default connectDB;

