const router = require("express").Router();
const Item = require("../../models/items");

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find()
      .populate("subcategory", "name"); 
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items", details: error.message });
  }
});

//  Get items by subcategory
router.get("/subcategory/:subcategoryId", async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const items = await Item.find({ 
      subcategory: subcategoryId 
    }).populate("subcategory", "name");
    
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items by subcategory", details: error.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      subcategory: req.body.subcategoryId || req.body.subcategory 
    });
    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    res.status(400).json({ error: "Failed to add item", details: error.message });
  }
});

module.exports = router;