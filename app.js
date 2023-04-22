const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
require("express-async-errors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");

const dbConnection = require("./config/dbConnect");
const notFound = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/errorHandler");

const { storage, fileFilter } = require("./utils/multerConfig");

app.use(express.json());
app.use(
  multer({
    storage,
    fileFilter,
  }).fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ])
);
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  res.send("this is get route");
});

//Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

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
