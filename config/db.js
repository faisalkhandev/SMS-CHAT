const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected.");
  } catch (error) {
    console.log("Error Connecting DB....");
  }
};

// const connectDB = () => {
//   mongoose
//     .connect(process.env.MONGO_URL)
//     .then(() => {
//       console.log("DB Connected");
//     })
//     .catch((err) => {
//       console.log("Error Connecting DB..");
//       console.log(err);
//     });
// };

module.exports = connectDB;
