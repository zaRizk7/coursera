const express = require("express");

const leaderRouter = express.Router();

leaderRouter.all("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});

leaderRouter.get("/", (req, res, next) => {
  res.end("Will send all the leaders to you!");
});

leaderRouter.get("/:leaderId", (req, res, next) => {
  res.end(`Will send details of the leader: ${req.params.leaderId} to you!`);
});

leaderRouter.post("/", (req, res, next) => {
  res.end(
    `Will add the leader: ${req.body.name} with details: ${req.body.description}`
  );
});

leaderRouter.post("/:leaderId", (req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /leaders/${req.params.leaderId}`);
});

leaderRouter.put("/", (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /leaders");
});

leaderRouter.put("/:leaderId", (req, res, next) => {
  res.end(
    `Updating the leader: ${req.params.leaderId}\nWill update the leader: ${req.body.name} with details: ${req.body.description}`
  );
});

leaderRouter.delete("/", (req, res, next) => {
  res.end("Deleting all leaders");
});

leaderRouter.delete("/:leaderId", (req, res, next) => {
  res.end(`Deleting leader: ${req.params.leaderId}`);
});

module.exports = leaderRouter;
