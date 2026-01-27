const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const { runCodeController } = require("./controllers/judge.controller");
const questionController = require("./controllers/question.controller");
const courseController = require("./controllers/course.controller");
const categoryController = require("./controllers/category.controller");
const campusController = require("./controllers/campus.controller");
const yearController = require("./controllers/year.controller");
const batchController = require("./controllers/batch.controller");
const studentController = require("./controllers/student.controller");
const { getSubmissionsByBatch, getSubmissionByStudent, checkSolvedStatus } = require("./controllers/submissionController");
const assignmentController = require("./controllers/assignment.controller");
const assignmentSubmissionController = require("./controllers/assignmentSubmission.controller");
const userCourseController = require("./controllers/userCourse.controller");
const mcqController = require("./controllers/mcq.controller");
const mcqSubmissionController = require("./controllers/mcqSubmission.controller");
const adminController = require("./controllers/admin.controller");
const authController = require("./controllers/auth.controller");
const judgeController = require("./controllers/judge.controller");
const ticketController = require("./controllers/ticket.controller");
const authMiddleware = require("./middleware/auth.middleware");
const curriculumController = require("./controllers/curriculum.controller");
const staffController = require("./controllers/staff.controller");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
connectDB();

/* ===================== SUBMISSIONS ===================== */
app.get("/api/submissions/solved", authMiddleware(["student", "admin"]), checkSolvedStatus);
app.get("/api/submissions/getSubmissionbyBatch", authMiddleware(["admin"]), getSubmissionsByBatch);
app.post("/getSubmissionsByBatch", getSubmissionsByBatch);
app.post("/getSubmissionByStudent", getSubmissionByStudent);

/* ===================== ASSIGNMENT SUBMISSIONS ===================== */
app.post("/api/assignment-submissions/submit", assignmentSubmissionController.submitAssignment);
app.get("/api/assignment-submissions/assignment/:assignmentId", assignmentSubmissionController.getSubmissionsByAssignment);
app.post("/api/assignment-submissions/getReportByBatch", assignmentSubmissionController.getSubmissionByBatch);
app.get("/api/assignment-submissions/assignment/:assignmentId/student/:studentId", assignmentSubmissionController.getSubmissionByStudent);
app.post("/api/assignment-submissions/getSubmissionByCollegeAndAssignment", assignmentSubmissionController.getSubmissionByCollegeAndAssignment);

/* ===================== MCQS ===================== */
app.post("/api/mcqs/createmcq", mcqController.createMCQ);
app.post("/api/mcqs/getallmcq", mcqController.getAllMCQs);
app.get("/api/mcqs/getallmcq", mcqController.getAllMCQs);
app.get("/api/mcqs/category", mcqController.getMCQsByCategory);
app.get("/api/mcqs/topic", mcqController.getMCQsByTopic);
app.delete("/api/mcqs/:id", mcqController.deleteMCQ);
app.post("/api/mcqs/mcqs-student", mcqController.getMcqsForStudent);
app.get("/api/mcqs/:id", mcqController.getMCQByID);
app.post("/api/mcqs/getMcqsDetailForStudent", mcqController.getMcqsDetailForStudent);
app.get("/getAllMCQForAdmin", mcqController.getAllMCQsforAdmin);

/* ===================== MCQ SUBMISSIONS ===================== */
app.post("/api/mcq-submissions/submit", mcqSubmissionController.submitMCQ);
app.get("/api/mcq-submissions/student/:studentId", mcqSubmissionController.getMCQSubmissionsByStudent);
app.get("/api/mcq-submissions/mcq/:mcqId", mcqSubmissionController.getMCQSubmissionsByMCQ);
app.get("/api/mcq-submissions/student/:studentId/mcq/:mcqId", mcqSubmissionController.getMCQSubmissionByStudentAndMcq);
app.post("/api/mcq-submissions/getreporbytbatch", mcqSubmissionController.getMCQSubmissionbyBatch);
app.post("/api/mcq-submissions/getSubmissionForStudentAndMcq", mcqSubmissionController.getSubmissionForStudentAndMcq);
app.post("/api/mcq-submissions/getSubmissionByCollegeAndMcq", mcqSubmissionController.getSubmissionByCollegeAndMcq);


/* ===================== ASSIGNMENTS ===================== */
app.post("/api/assignments", assignmentController.createAssignment);
app.put("/api/assignments/:id", assignmentController.updateAssignment);
app.delete("/api/assignments/:id", assignmentController.deleteAssignment);
app.get("/api/assignments", assignmentController.getAllAssignments);
app.get("/api/assignments/:id", assignmentController.getAssignmentById);
app.post("/get-assignments-for-student", assignmentController.getAssignmentforStudent);

/* ===================== TICKETS ===================== */
app.post("/api/tickets/create", ticketController.createTicket);
app.post("/api/tickets/my", ticketController.getMyTickets);
app.get("/api/tickets/all", ticketController.getAllTickets);
app.put("/api/tickets/resolve", ticketController.resolveTicket);

/* ===================== AUTH ===================== */
app.post("/api/auth/login", authController.login);
app.post("/api/auth/register", authController.register);
app.post("/reset-password-request", authController.requestPasswordReset);
app.post("/reset-password/:token", authController.resetPassword);

/* ===================== STUDENTS ===================== */
app.get("/api/students/students", studentController.getStudentsByCollegeYearBatch);
app.post("/getStudentDetails", studentController.getUser);
app.post("/getStudentByEmail", studentController.getStudentByEmail);

/* ===================== ADMIN ===================== */
app.post("/api/admin/create", adminController.createAdmin);
app.post("/api/admin/create-staff", adminController.createStaff);
app.post("/api/admin/create-student", adminController.createStudent);
app.post("/api/admin/filternotcreated", adminController.findNotCreatedStudents);
app.post("/api/admin/bulkcreatestudent", adminController.bulkCreateStudents);
app.post("/api/admin/bulkdeletestudents", adminController.bulkDeleteStudentsByEmail);
app.post("/api/admin/sendBulkInvitationMails", adminController.sendBulkInvitationMails);
app.post("/api/admin/sendInvitationByEmails", adminController.sendInvitationByEmails);
app.post("/api/admin/sendAccountCreatedNotificationMails", adminController.sendAccountCreatedNotificationMails);

/* ===================== JUDGE ===================== */
app.post("/run", runCodeController);
app.post("/run-code-alone", judgeController.runOnlyCompilerController);

/* ===================== CAMPUS / YEAR / BATCH ===================== */
app.post("/campus", campusController.createCampus);
app.get("/campus/get", campusController.getCampuses);
app.post("/year", yearController.createYear);
app.get("/year/get", yearController.getYears);
app.get("/year/get-by-campus", yearController.getYearsByCampus);
app.post("/batch", batchController.createBatch);
app.get("/batch/get", batchController.getBatches);
app.get("/batch/get-by-campus-year", batchController.getBatchesByYearAndCampus);

/* ===================== USER COURSE / MCQ ===================== */
app.post("/addCourse", userCourseController.addCourse);
app.post("/addAssignmentToUser", userCourseController.addAssignment);
app.post("/addMcq", require("./controllers/userMcq.controller").addMcq);

/* ===================== COURSES ===================== */
app.post("/courses", authMiddleware(["admin"]), courseController.createCourse);
app.get("/courses", courseController.getCourses);
app.post("/courses/student", courseController.getCourses);

/* ===================== CATEGORIES ===================== */
app.post("/categories", authMiddleware(["admin", "student"]), categoryController.createCategory);
app.get("/categories", authMiddleware(["admin", "student"]), categoryController.getCategoriesByCourse);

/* ===================== QUESTIONS ===================== */
app.post("/questions", questionController.createQuestion);
app.get("/questionsforadmin", questionController.getAllQuestionsforAdmin);
app.get("/questions", questionController.getQuestionsByCategory);
app.get("/questions/:id", authMiddleware(["admin", "student"]), questionController.getQuestionById);
app.get("/questionsforadmin/:id", questionController.getQuestionByIdforAdmin);
app.put("/questions/:id", questionController.updateQuestion);

/*=========================CURRICULUM=========================*/
app.post("/api/curriculum/addCourse", curriculumController.addCourse);
app.post("/api/curriculum/addMCQ", curriculumController.addMCQ);
app.post("/api/curriculum/addAssignment", curriculumController.addAssignment);
app.post("/api/curriculum/getCourses", curriculumController.getCourses);
app.post("/api/curriculum/getMCQs", curriculumController.getMCQs);
app.post("/api/curriculum/getAssignments", curriculumController.getAssignments);


/*=====================STAFF========================*/
app.post("/api/staff/addAssignment", staffController.addAssignmenttoStaff);
app.post("/api/staff/addCourse", staffController.addCoursetoStaff);
app.post("/api/staff/addMcq", staffController.addMcqtoStaff);
app.get("/api/getStaffById/:id", staffController.getStaffById);

/* ===================== SERVER ===================== */
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`TSS - Backend is running on port ${PORT}`));
app.get("/", (req, res) => res.send("Judge API is running..."));
