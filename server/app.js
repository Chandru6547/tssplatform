const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

// Controllers
const { runCodeController } = require("./controllers/judge.controller");
const questionController = require("./controllers/question.controller");
const courseController = require("./controllers/course.controller");
const categoryController = require("./controllers/category.controller");

// Routes
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");

// Auth Middleware
const authMiddleware = require("./middleware/auth.middleware");

const campusController = require("./controllers/campus.controller");
const yearController = require("./controllers/year.controller");
const batchController = require("./controllers/batch.controller");
const studentController = require("./controllers/student.controller");
const { getSubmissionsByBatch } = require("./controllers/submissionController");
const mcqRoutes = require("./routes/mcq.routes");
const mcqSubmissionRoutes = require("./routes/mcqSubmission.routes");
const addCourse = require("./controllers/userCourse.controller").addCourse;
const addMcq = require("./controllers/userMcq.controller").addMcq;
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/mcqs", mcqRoutes);
app.use("/api/mcq-submissions", mcqSubmissionRoutes);
/* ===================== AUTH ===================== */
app.use("/api/auth", authRoutes);

/* ===================== JUDGE ===================== */
app.post(
  "/run",
  authMiddleware(["admin", "student"]),
  runCodeController
);

app.post(
  "/campus",
  campusController.createCampus
);

app.get(
  "/campus/get",
  campusController.getCampuses
);

app.post(
  "/year",
  yearController.createYear
);

app.get(
  "/year/get",
  yearController.getYears
);

app.get(
  "/year/get-by-campus",
  yearController.getYearsByCampus
);

app.post(
  "/batch",
  batchController.createBatch
);

app.post(
  "/addCourse",
  addCourse
);

app.post(
  "/addMcq",
  addMcq
);

app.get(
  "/batch/get",
  batchController.getBatches
);

app.get(
  "/batch/get-by-year-and-campus",
  batchController.getBatchesByYearAndCampus
);

app.post('/getStudentDetails', studentController.getUser);

app.post('/getSubmissionsByBatch', getSubmissionsByBatch);


/* ===================== ADMIN ===================== */
app.use("/api/admin", adminRoutes);

/* ===================== COURSES ===================== */
// Create Course (Admin only)
app.post(
  "/courses",
  authMiddleware(["admin"]),
  courseController.createCourse
);

app.get(
  "/courses",
  authMiddleware(["admin", "student"]),
  courseController.getCourses
);

// Get All Courses
app.post(
  "/courses/student",
  authMiddleware(["admin", "student"]),
  courseController.getCourses
);

/* ===================== CATEGORIES ===================== */
// Create Category (Admin only)
app.post(
  "/categories",
   authMiddleware(["admin", "student"]),
  categoryController.createCategory
);


// Get Categories by Course
app.get(
  "/categories",
  authMiddleware(["admin", "student"]),
  categoryController.getCategoriesByCourse
);

/* ===================== QUESTIONS ===================== */
// Create Question (Admin only)
app.post(
  "/questions",
  authMiddleware(["admin"]),
  questionController.createQuestion
);

// Get Questions by Category
app.get(
  "/questions",
   authMiddleware(["admin", "student"]),
  questionController.getQuestionsByCategory
);

// Get Single Question (Solve Page)
app.get(
  "/questions/:id",
  authMiddleware(["admin", "student"]),
  questionController.getQuestionById
);

app.get("/questionsforadmin/:id", questionController.getQuestionByIdforAdmin);

app.put("/questions/:id", questionController.updateQuestion);
app.get("/", (req, res) => {
  res.send("Judge API is running...");
});


/* ===================== SERVER ===================== */
let PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("🚀 Judge API running at http://localhost:3000");
});
