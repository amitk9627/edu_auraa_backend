// Requiring module
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config(); 

const facultyRoute = require("./src/routes/faculty");
const instituteRoute = require("./src/routes/institute");
const courseRoute = require("./src/routes/courses");
const batchRoute = require("./src/routes/batches");
const userRoute = require("./src/routes/user");

// Creating express object
const app = express();

// Port Number
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
  
// allowing all origins
app.use(
  cors({
    origin: '*',  // Allow all origins
    credentials: true, // Allow credentials (cookies, Authorization headers, etc.)
  })
);

mongoose.set("strictPopulate", false);
mongoose.set("strictQuery", false);

// console.log("MONGO_URI", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME
  })
  .then(() => {
    console.log(`Connection Established with ${process.env.DB_NAME} database`);
  })
  .catch((error) => {
    console.log(error);
  });

  app.use("/app/v1/faculty", facultyRoute);
  app.use("/app/v1/institute", instituteRoute);
  app.use("/app/v1/courses", courseRoute);
  app.use("/app/v1/batches", batchRoute);
  app.use("/app/v1/users",userRoute)


  app.listen(PORT, console.log(`Server started on port ${PORT}`));