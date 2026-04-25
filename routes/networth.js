const { Router } = require("express");
const db = require("../db");

const router = Router();

//GET all networth
router.get("/", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM networth").all();
    res.status(200).json({
      status: "success",
      data: { networth: rows },
    });
    console.log("API Called : Get all networth");
  } catch (error) {
    next(error);
  }
});

//CREATE a networth
router.post("/", (req, res, next) => {
  try {
    const { name, value, base_value, goal_ultimate_id, type } = req.body;
    const result = db.prepare(
      "INSERT INTO networth (name, value, base_value, goal_ultimate_id, type) VALUES (?,?,?,?,?)"
    ).run(name, value, base_value, goal_ultimate_id, type);
    const row = db.prepare("SELECT * FROM networth WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({
      status: "success",
      data: { networth: row },
    });
    console.log("API Called : Add a networth");
  } catch (error) {
    next(error);
  }
});

//DELETE a networth
router.delete("/:id", (req, res, next) => {
  try {
    db.prepare("DELETE FROM networth WHERE id = ?").run(req.params.id);
    res.status(204).json({ status: "success" });
    console.log("API Called : Delete a networth");
  } catch (error) {
    next(error);
  }
});

//UPDATE a networth
router.put("/", (req, res, next) => {
  try {
    const { name, value, base_value, goal_ultimate_id, type, id } = req.body;
    db.prepare(
      "UPDATE networth SET name=?, value=?, base_value=?, goal_ultimate_id=?, type=? WHERE id=?"
    ).run(name, value, base_value, goal_ultimate_id, type, id);
    const row = db.prepare("SELECT * FROM networth WHERE id = ?").get(id);
    res.status(200).json({
      status: "success",
      data: { networth: row },
    });
    console.log("API Called : Update a networth");
  } catch (error) {
    next(error);
  }
});

//GET all networth_time
router.get("/time", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM networth_time").all();
    res.status(200).json({
      status: "success",
      data: { networth_time: rows },
    });
    console.log("API Called : Get all networth_time");
  } catch (error) {
    next(error);
  }
});

//CREATE a networth_time
router.post("/time", (req, res, next) => {
  try {
    const { total_networth, monthly_income, investment_profit, monthly_profit } = req.body;
    const result = db.prepare(
      "INSERT INTO networth_time (total_networth, monthly_income, investment_profit, monthly_profit) VALUES (?,?,?,?)"
    ).run(total_networth, monthly_income, investment_profit, monthly_profit);
    const row = db.prepare("SELECT * FROM networth_time WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({
      status: "success",
      data: { networth_time: row },
    });
    console.log("API Called : Add a networth_time");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
