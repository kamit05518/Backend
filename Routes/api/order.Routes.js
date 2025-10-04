const express = require("express");
const router = express.Router();
const { order, getAllOrder, getOrderById } = require("../../Controller/order");
const { authMiddleware } = require("../../middlewares/auth");


router.use(authMiddleware); 


router.post("/order", order);
router.get("/orders", getAllOrder);
router.get("/order/:id", getOrderById);

module.exports = router;