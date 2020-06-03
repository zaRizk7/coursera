const express = require("express");

const promoRouter = express.Router();

promoRouter.all("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});

promoRouter.get("/", (req, res, next) => {
  res.end("Will send all the promotions to you!");
});

promoRouter.get("/:promoId", (req, res, next) => {
  res.end(`Will send details of the promotion: ${req.params.promoId} to you!`);
});

promoRouter.post("/", (req, res, next) => {
  res.end(
    `Will add the promotion: ${req.body.name} with details: ${req.body.description}`
  );
});

promoRouter.post("/:promoId", (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /promotions/${req.params.promoId}`);
});

promoRouter.put("/", (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /promotions");
});

promoRouter.put("/:promoId", (req, res, next) => {
  res.end(
    `Updating the promotion: ${req.params.promoId}\nWill update the promotion: ${req.body.name} with details: ${req.body.description}`
  );
});

promoRouter.delete("/", (req, res, next) => {
  res.end("Deleting all promotions");
});

promoRouter.delete("/:promoId", (req, res, next) => {
  res.end(`Deleting promotion: ${req.params.promoId}`);
});

module.exports = promoRouter;
