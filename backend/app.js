const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const conversationRoutes = require("./routes/conversationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const usageRoutes = require("./routes/usageRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();

const { globalRateLimiter } = require("./middlewares/rateLimitMiddleware");


app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(globalRateLimiter);

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());



app.use("/api/conversations", conversationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usage" , usageRoutes)
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);


app.use(errorMiddleware);

module.exports = app;