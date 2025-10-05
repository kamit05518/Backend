const Router = require("express").Router();
const apiRouter = require("./api/index.js");

Router.use("/api", apiRouter);
Router.get("/", (req, res) => {
  res.send("Welcome to the API. Please use /api/<route>");
});



Router.use((req, res, next) => {
  const err = new Error("The route you are trying to access does not exist");
  err.status = 404;
  next(err);
});


  


module.exports = Router;
