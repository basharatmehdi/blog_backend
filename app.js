const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
require("express-async-errors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoutes");

const dbConnection = require("./config/dbConnect");
const notFound = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/errorHandler");

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  res.send("this is get route");
});

//Routes
app.use("/api/auth", authRouter);

//Middlewares
app.use(notFound);
app.use(errorHandlerMiddleware);

// Server configuration
const port = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await dbConnection(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
