import express from "express";
import Department from "../models/Department.js";

const router = express.Router();

// ➕ Add new department
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Department name required" });

    const existing = await Department.findOne({ name });
    if (existing) return res.status(400).json({ message: "Department already exists" });

    const newDept = new Department({ name });
    await newDept.save();

    res.status(201).json({ message: "Department added successfully", department: newDept });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/create", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Department name is required" });

    const exists = await Department.findOne({ name });
    if (exists) return res.status(400).json({ message: "Department already exists" });

    const department = new Department({ name });
    await department.save();
    res.status(201).json({ message: "Department added successfully", department });
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
// 📜 Get all departments
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
