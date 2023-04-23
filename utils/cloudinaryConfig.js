const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//Upload to Cloudinary
const uploadToCloudinary = async ({ file, folder }) => {
  try {
    return await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      use_filename: true,
      folder,
    });
  } catch (error) {
    return error;
  }
};

module.exports = uploadToCloudinary;
