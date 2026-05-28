const connectDB = require("./configs/db");
const app = require("./app");
require("dotenv").config();

async function run() {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.log("Error connecting to the database:", error);
    process.exit(1);
  }
}

run();
