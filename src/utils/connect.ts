import mongoose from "mongoose";

async function connect() {
  const dbUri = <string>process.env.DB;

  try {
    await mongoose.connect(dbUri);
    console.log("Database connected SuccesFully");
  } catch (error) {
    console.log(error,'db error');
    
    console.log("Could not connect to db");
    process.exit(1);
  }
}

export default connect;
