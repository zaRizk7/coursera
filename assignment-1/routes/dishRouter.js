const express = require("express");

const dishRouter = express.Router();

dishRouter.all("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});

dishRouter.get("/", (req, res, next) => {
  res.end("Will send all the dishes to you!");
});

dishRouter.get("/:dishId", (req, res, next) => {
  res.end(`Will send details of the dish: ${req.params.dishId} to you!`);
});

dishRouter.post("/", (req, res, next) => {
  res.end(
    `Will add the dish: ${req.body.name} with details: ${req.body.description}`
  );
});

dishRouter.post("/:dishId", (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
});

dishRouter.put("/", (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /dishes");
});

dishRouter.put("/:dishId", (req, res, next) => {
  res.end(
    `Updating the dish: ${req.params.dishId}\nWill update the dish: ${req.body.name} with details: ${req.body.description}`
  );
});

dishRouter.delete("/", (req, res, next) => {
  res.end("Deleting all dishes");
});

dishRouter.delete("/:dishId", (req, res, next) => {
  res.end(`Deleting dish: ${req.params.dishId}`);
});

module.exports = dishRouter;
