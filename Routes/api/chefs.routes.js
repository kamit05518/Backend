
const router = require("express").Router();
const Chef = require("../../models/chefs.model");

router.get("/", async (req, res) => {
  try {
    const chefs = await Chef.find({});
    return res.status(200).json({ chefs });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router; 
