const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/uploadmiddleware"); 
const profile = require("../../Controller/profile");

router.get("/", profile.getProfile);
router.post("/", upload.single("profileImage"), profile.createOrUpdateProfile);

module.exports = router;
