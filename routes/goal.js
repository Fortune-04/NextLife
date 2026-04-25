const { Router } = require("express");
const db = require("../db");

const router = Router();

//////////////////////////////////////////////GOAL_ULTIMATE//////////////////////////////////////////////////

//GET all Goal_Ultimate
router.get("/ultimate", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM goal_ultimate").all();
    res.status(200).json({
      status: "success",
      data: { goal_ultimate: rows },
    });
    console.log("API Called : Get all goal_ultimate");
  } catch (error) {
    next(error);
  }
});

//CREATE a Goal_Ultimate
router.post("/ultimate", (req, res, next) => {
  try {
    const { name, target_value, image_source, status } = req.body;
    const result = db.prepare(
      "INSERT INTO goal_ultimate (name, target_value, image_source, status) VALUES (?,?,?,?)"
    ).run(name, target_value, image_source || null, status ? 1 : 0);
    const row = db.prepare("SELECT * FROM goal_ultimate WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({
      status: "success",
      data: { goal_ultimate: row },
    });
    console.log("API Called : Add a goal_ultimate");
  } catch (error) {
    next(error);
  }
});

//UPDATE a Goal_Ultimate
router.put("/ultimate", (req, res, next) => {
  try {
    const { name, target_value, current_value, image_source, status, id } = req.body;
    db.prepare(
      "UPDATE goal_ultimate SET name=?, target_value=?, current_value=?, image_source=?, status=? WHERE id=?"
    ).run(name, target_value, current_value, image_source, status ? 1 : 0, id);
    const row = db.prepare("SELECT * FROM goal_ultimate WHERE id = ?").get(id);
    res.status(200).json({
      status: "success",
      data: { goal_ultimate: row },
    });
    console.log("API Called : Update a goal_ultimate");
  } catch (error) {
    next(error);
  }
});

//UPDATE a Goal_Ultimate target value
router.put("/ultimate/target", (req, res, next) => {
  try {
    const { name, target_value, image_source, id } = req.body;
    db.prepare(
      "UPDATE goal_ultimate SET name=?, target_value=?, image_source=? WHERE id=?"
    ).run(name, target_value, image_source || null, id);
    const row = db.prepare("SELECT * FROM goal_ultimate WHERE id = ?").get(id);
    res.status(200).json({
      status: "success",
      data: { goal_ultimate: row },
    });
    console.log("API Called : Update a goal_ultimate target");
  } catch (error) {
    next(error);
  }
});

//DELETE a Goal_Ultimate
router.delete("/ultimate/:id", (req, res, next) => {
  try {
    db.prepare("DELETE FROM goal_ultimate WHERE id = ?").run(req.params.id);
    res.status(204).json({ status: "success" });
    console.log("API Called : Delete a goal_ultimate");
  } catch (error) {
    next(error);
  }
});

//////////////////////////////////////////////GOAL_OTHER//////////////////////////////////////////////

//GET all Goal_Other
router.get("/other", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM goal_other").all();
    res.status(200).json({
      status: "success",
      data: { goal_other: rows },
    });
    console.log("API Called : Get all goal_other");
  } catch (error) {
    next(error);
  }
});

//CREATE a Goal_Other
router.post("/other", (req, res, next) => {
  try {
    const { name, complete_status } = req.body;
    const result = db.prepare(
      "INSERT INTO goal_other (name, complete_status) VALUES (?,?)"
    ).run(name, complete_status ? 1 : 0);
    const row = db.prepare("SELECT * FROM goal_other WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({
      status: "success",
      data: { goal_other: row },
    });
    console.log("API Called : Add a goal_other");
  } catch (error) {
    next(error);
  }
});

//DELETE a goal_other
router.delete("/other/:id", (req, res, next) => {
  try {
    db.prepare("DELETE FROM goal_other WHERE id = ?").run(req.params.id);
    res.status(204).json({ status: "success" });
    console.log("API Called : Delete a goal_other");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
