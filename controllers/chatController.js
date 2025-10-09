const axios = require("axios");
const Student = require("../models/Student");

const handleChat = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required." });
  }

  const systemPrompt = `You are an intelligent assistant for a Student Management System. Your job is to understand the user's query and convert it into a structured JSON object.

  The possible intents are:
  - "get_all_students"
  - "get_student_by_roll"
  - "add_student"
  - "update_student"
  - "delete_student"
  - "unknown"

  Follow these rules STRICTLY:
  1. For "add_student", you MUST extract "name", "rollNumber", and "grade" and put them inside a "data" object.
  2. For "update_student", you MUST extract the "rollNumber" and any fields to be updated inside a "data" object.
  3. For "get_student_by_roll" or "delete_student", you MUST extract the "rollNumber".
  4. If the user's query doesn't match any intent, use the "unknown" intent.
  5. Your response MUST be ONLY the JSON object and nothing else.

  Example 1:
  User query: "Find student with roll number CS-101"
  Your JSON response: { "intent": "get_student_by_roll", "rollNumber": "CS-101" }

  Example 2:
  User query: "Admit a new student. Name is Sara, roll number is CS-105, and grade is 10."
  Your JSON response: { "intent": "add_student", "data": { "name": "Sara", "rollNumber": "CS-105", "grade": 10 } }

  Example 3:
  User query: "Update student CS-101's grade to 11."
  Your JSON response: { "intent": "update_student", "rollNumber": "CS-101", "data": { "grade": 11 } }
  `;

  try {
    const apiResponse = await axios.post(
      process.env.CHATBOT_API_URL,
      {
        model: "LongCat-Flash-Chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
      },
      { headers: { Authorization: `Bearer ${process.env.CHATBOT_API_KEY}` } }
    );

    const aiResponseString = apiResponse.data.choices[0].message.content;
    const command = JSON.parse(aiResponseString);

    switch (command.intent) {
      case "get_all_students":
        const students = await Student.find({});
        res.json({ reply: "Here are all the students:", data: students });
        break;

      case "get_student_by_roll":
        const student = await Student.findOne({
          rollNumber: command.rollNumber,
        });
        res.json({
          reply: `Here are the details for ${command.rollNumber}:`,
          data: student,
        });
        break;

      case "add_student":
        const newStudent = new Student(command.data);
        console.log("==================");
        console.log("adding new studend::::", newStudent);
        const savedStudent = await newStudent.save();
        res.json({
          reply: "New student has been admitted successfully.",
          data: savedStudent,
        });
        break;

      case "update_student":
        const updatedStudent = await Student.findOneAndUpdate(
          { rollNumber: command.rollNumber },
          command.data,
          { new: true }
        );
        res.json({
          reply: `Student ${command.rollNumber} has been updated.`,
          data: updatedStudent,
        });
        break;

      case "delete_student":
        await Student.findOneAndDelete({ rollNumber: command.rollNumber });
        res.json({
          reply: `Student with roll number ${command.rollNumber} has been deleted.`,
        });
        break;

      default:
        res.json({ reply: "Sorry, I didn't understand that command." });
    }
  } catch (error) {
    console.error("Chatbot logic error:", error);
    res.status(500).json({ error: "Sorry, something went wrong." });
  }
};

module.exports = { handleChat };
