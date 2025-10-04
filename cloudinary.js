
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");



const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = "misc";

   
     if (req.baseUrl.includes("/profile")) { 
      folderName = "profiles";
    }

    return {
      folder: folderName,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: `${Date.now()}_${file.originalname.split(".")[0]}`,
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" }
      ]
    };
  },
});

module.exports = { cloudinary, storage };

