const express = require("express");
const router = express.Router();
const { getOrderStatus } = require("../../Controller/tracking");

router.get("/orders/:orderId/status", getOrderStatus);

module.exports = router;
