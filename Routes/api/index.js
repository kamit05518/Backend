const Router = require("express").Router();

const authRouter = require("./Auth.Routes.js");
const CartRouter = require("./Cart.Routes.js");
const orderRouter = require("./order.Routes.js");
const categoriesRoutes = require("./categories.routes.js");
const chefsRoutes = require("./chefs.routes.js");
const subcategoriesRoutes = require("./subcategories.Routes.js");
const itemsRoutes = require("./items.Routes.js"); 
const trackingRoutes = require("./tracking.Routes.js");
const profileRoutes =require("./profile.Routes.js")

Router.use("/chefs", chefsRoutes);
Router.use("/categories", categoriesRoutes);
Router.use("/auth", authRouter);
Router.use("/cart", CartRouter);
Router.use("/order", orderRouter);
Router.use("/subcategories", subcategoriesRoutes);
Router.use("/items", itemsRoutes); 
Router.use("/tracking/",trackingRoutes);
Router.use("/profile",profileRoutes)
Router.use((req, res) => {
  res.status(404).json({ error: "Route does not exist" });
});

module.exports = Router;
