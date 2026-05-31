const connectDB = require("./configs/db");
require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT

async function run() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error connecting to the database:", error);
    process.exit(1);
  }
}

run();
