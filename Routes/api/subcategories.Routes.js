const router = require("express").Router();
const SubcategoriesModel = require("../../models/subcategories");
const menuModel = require("../../models/items"); 


router.get("/", async (req, res) => {
  try {
    const subcategories = await SubcategoriesModel.find();
    console.log("Fetched all subcategories");
    return res.status(200).json({ subcategories });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return res.status(500).json({ error: error.message });
  }
});


router.get("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await SubcategoriesModel.find({ category: categoryId });
    
    console.log(`Fetched subcategories for category ${categoryId}`);
    return res.status(200).json({ subcategories });
  } catch (error) {
    console.error("Error fetching subcategories by category:", error);
    return res.status(500).json({ error: error.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await SubcategoriesModel.findById(id);
    
    if (!subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }
    
    console.log(`Fetched subcategory ${id}`);
    return res.status(200).json({ subcategory });
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    return res.status(500).json({ error: error.message });
  }
});


router.get("/items/:subcategoryId", async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    const items = await menuModel.find({ subcategory: subcategoryId });

    if (!items || items.length === 0) {
      return res.status(404).json({ message: "No items found for this subcategory" });
    }

    console.log(`Fetched ${items.length} items for subcategory ${subcategoryId}`);
    return res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching items by subcategory:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
