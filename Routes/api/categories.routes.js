const router = require("express").Router();
const CategoriesModel = require("../../models/categories.model");

router.get("/", async (req, res, next) => {
  try {
    const Categories = await CategoriesModel.find();
    console.log("find new categories ");
    return res.status(200).json({ categories: Categories });
  } catch (e) {
    next(error);
    console.error("Error fetching categories:", e);
    return res.status(500).json({ error: e.message });
  }
});
  
module.exports = router;
