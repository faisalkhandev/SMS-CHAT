const Student = require("../models/Student");

const addStudent = async (req, res) => {
  try {
    const { name, rollNumber, grade } = req.body;
    const existingStudent = await Student.findOne({ rollNumber: rollNumber });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this Roll Number Already exist.",
      });
    }

    const newStudent = new Student({
      name: name,
      rollNumber: rollNumber,
      grade: grade,
    });
    const savedStudent = await newStudent.save();
    console.log("New user created.", savedStudent);
    res.status(201).json({
      success: true,
      data: newStudent,
      message: "User Created Successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An Error Occurred while Creating a User.",
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const fetchingStudents = await Student.find({});
    res.status(200).json({
      success: true,
      data: fetchingStudents,
      message: "Successfullyy All students Fetched.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error Occurred while Fetching Students..",
    });
  }
};

const getStudentByRollNumber = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const student = await Student.findOne({ rollNumber: rollNumber });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student with this role number doesnot exist..",
      });
    }
    return res.status(200).json({
      success: true,
      data: student,
      message: "Student Found Successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error getting Student...",
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const updateFields = {};
    if (req.body.name) {
      updateFields.name = req.body.name;
    }
    if (req.body.section) {
      updateFields.section = req.body.section;
    }
    if (req.body.grade) {
      updateFields.grade = req.body.grade;
    }
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Data Required for update..",
      });
    }
    const updatedStudent = await Student.findOneAndUpdate(
      {
        rollNumber: rollNumber,
      },
      updateFields,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Could not Find student with this Roll Nummber to update..",
      });
    }
    return res.status(200).json({
      success: true,
      data: updatedStudent,
      message: "Successfully Updated Student..",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error Updating Student.",
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const deletedStudent = await Student.findOneAndDelete({
      rollNumber: rollNumber,
    });
    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Is Roll Number ka koi student ni exist krta.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully Deleted the Student.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error Deleting Student..",
    });
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentByRollNumber,
  updateStudent,
  deleteStudent,
};
