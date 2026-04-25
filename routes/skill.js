const { Router } = require("express");
const db = require("../db");

const router = Router();

//////////////////////////////////////////////Skill_Type//////////////////////////////////////////////

//GET all Skill_Type
router.get("/type", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM skill_type").all();
    res.status(200).json({
      status: "success",
      data: { skill_type: rows },
    });
    console.log("API Called : Get all skill_type");
  } catch (error) {
    next(error);
  }
});

//CREATE a skill_type
router.post("/type", (req, res, next) => {
  try {
    const { name } = req.body;
    const result = db.prepare(
      "INSERT INTO skill_type (name) VALUES (?)"
    ).run(name);
    const row = db.prepare("SELECT * FROM skill_type WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({
      status: "success",
      data: { skill_type: row },
    });
    console.log("API Called : Add a skill_type");
  } catch (error) {
    next(error);
  }
});

//DELETE a skill_type
router.delete("/type/:id", (req, res, next) => {
  try {
    db.prepare("DELETE FROM skill_type WHERE id = ?").run(req.params.id);
    res.status(204).json({ status: "success" });
    console.log("API Called : Delete a skill_type");
  } catch (error) {
    next(error);
  }
});

//UPDATE a skill_type
router.put("/type", (req, res, next) => {
  try {
    const { name, id } = req.body;
    db.prepare("UPDATE skill_type SET name=? WHERE id=?").run(name, id);
    const row = db.prepare("SELECT * FROM skill_type WHERE id = ?").get(id);
    res.status(200).json({
      status: "success",
      data: { skill_type: row },
    });
    console.log("API Called : Update a skill_type");
  } catch (error) {
    next(error);
  }
});

//////////////////////////////////////////////Skill//////////////////////////////////////////////

//GET all Skill
router.get("/", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM skill").all();
    res.status(200).json({
      status: "success",
      data: { skill: rows },
    });
    console.log("API Called : Get all skill");
  } catch (error) {
    next(error);
  }
});

//CREATE a Skill
router.post("/", (req, res, next) => {
  try {
    const { name, complete_status, skill_type_id } = req.body;
    const result = db.prepare(
      "INSERT INTO skill (name, complete_status, skill_type_id) VALUES (?,?,?)"
    ).run(name, complete_status, skill_type_id);
    const row = db.prepare("SELECT * FROM skill WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({
      status: "success",
      data: { skill: row },
    });
    console.log("API Called : Add a skill");
  } catch (error) {
    next(error);
  }
});

//DELETE a Skill
router.delete("/:id", (req, res, next) => {
  try {
    db.prepare("DELETE FROM skill WHERE id = ?").run(req.params.id);
    res.status(204).json({ status: "success" });
    console.log("API Called : Delete a skill");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
