const multer = require("multer");

// Multer Storage function
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/posts/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

//Multer Filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(
      {
        message: "Invalid image format",
      },
      false
    );
  }
};

module.exports = {
  storage,
  fileFilter,
};
