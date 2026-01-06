import mongoose from "mongoose";
//Docker
const MONGO_URI = process.env.MONGODB_URI ||  "mongodb://mongodb:27017/tiendaSol"; 

//Local
//const MONGO_URI = "mongodb://localhost:27017/tiendaSol"; 

export const conectarDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB conectado correctamente");
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  }
};

