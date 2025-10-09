const express = require("express");
const router = express.Router();

const {
  addStudent,
  getAllStudents,
  getStudentByRollNumber,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

router.post("/", addStudent);
router.get("/", getAllStudents);
router.get("/:rollNumber", getStudentByRollNumber);
router.put("/:rollNumber", updateStudent);
router.delete("/:rollNumber", deleteStudent);

module.exports = router;
