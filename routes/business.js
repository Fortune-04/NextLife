const { Router } = require("express");
const db = require("../db");

const router = Router();

//GET all business
router.get("/", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM business").all();
    res.status(200).json({
      status: "success",
      data: { business: rows },
    });
    console.log("API Called : Get all business");
  } catch (error) {
    next(error);
  }
});

//CREATE a business
router.post("/", (req, res, next) => {
  try {
    const { name, revenue, capital, status } = req.body;
    const result = db.prepare(
      "INSERT INTO business (name, revenue, capital, status) VALUES (?,?,?,?)"
    ).run(name, revenue, capital, status != null ? String(status) : null);
    const row = db.prepare("SELECT * FROM business WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({
      status: "success",
      data: { business: row },
    });
    console.log("API Called : Add a business");
  } catch (error) {
    next(error);
  }
});

//DELETE a business
router.delete("/:id", (req, res, next) => {
  try {
    db.prepare("DELETE FROM business WHERE id = ?").run(req.params.id);
    res.status(204).json({ status: "success" });
    console.log("API Called : Delete a business");
  } catch (error) {
    next(error);
  }
});

//UPDATE a business
router.put("/", (req, res, next) => {
  try {
    const { name, revenue, capital, status, id } = req.body;
    db.prepare(
      "UPDATE business SET name=?, revenue=?, capital=?, status=? WHERE id=?"
    ).run(name, revenue, capital, status != null ? String(status) : null, id);
    const row = db.prepare("SELECT * FROM business WHERE id = ?").get(id);
    res.status(200).json({
      status: "success",
      data: { business: row },
    });
    console.log("API Called : Update a business");
  } catch (error) {
    next(error);
  }
});

//GET all business_time
router.get("/time", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM business_time").all();
    res.status(200).json({
      status: "success",
      data: { business_time: rows },
    });
    console.log("API Called : Get all business_time");
  } catch (error) {
    next(error);
  }
});

//CREATE a business_time
router.post("/time", (req, res, next) => {
  try {
    const { business_profit, total_revenue, total_capital, profit_percentage } = req.body;
    const result = db.prepare(
      "INSERT INTO business_time (business_profit, total_revenue, total_capital, profit_percentage) VALUES (?,?,?,?)"
    ).run(business_profit, total_revenue, total_capital, profit_percentage);
    const row = db.prepare("SELECT * FROM business_time WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({
      status: "success",
      data: { business_time: row },
    });
    console.log("API Called : Add business_time");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
