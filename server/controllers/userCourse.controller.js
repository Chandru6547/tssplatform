// controllers/userCourse.controller.js
const User = require("../models/User");
const logger = require("../utils/logger");
const Course = require("../models/Course");
const nodemailer = require("nodemailer");

exports.addCourse = async (req, res) => {
  logger.info("addCourse API called");

  const { email, course } = req.body; // course = courseId

  try {
    /* ---------- USER ---------- */
    const user = await User.findOne({ email });
    if (!user) {
      logger.error("User not found in addCourse");
      return res.status(404).json({ message: "User not found" });
    }

    /* ---------- DUPLICATE CHECK ---------- */
    if (user.course.includes(course)) {
      logger.error("Course already exists in addCourse");
      return res.status(400).json({ message: "Course already exists" });
    }

    /* ---------- COURSE ---------- */
    const courseDetails = await Course.findById(course);
    if (!courseDetails) {
      logger.error("Course not found in addCourse");
      return res.status(404).json({ message: "Course not found" });
    }

    /* ---------- ADD COURSE ---------- */
    user.course.push(course);
    await user.save();

    /* ---------- SMTP ---------- */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "studentshub.tss@gmail.com", // studentshub.tss@gmail.com
        pass: "htzh fxjj rsxp hcsb"  // Gmail App Password
      }
    });

    /* ---------- MAIL ---------- */
    await transporter.sendMail({
      from: `"TSS Student Hub" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "📘 New Course Added to Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px;">
          
          <div style="text-align:center; margin-bottom:20px;">
            <img 
              src="https://lh3.googleusercontent.com/p/AF1QipPw0Zao_KYuaMipacLhym_O6Q-3APadfs67fvdf=s400"
              alt="TSS Student Hub"
              style="max-width:180px; border-radius:10px;"
            />
          </div>

          <h2 style="text-align:center;">📘 Course Added Successfully</h2>

          <p>Hello <b>${email}</b>,</p>

          <p>
            A new course has been added to your TSS Student Hub account.
          </p>

          <p style="font-size:16px;">
            <b>Course Name:</b> ${courseDetails.name}
          </p>

          <p>
            You can now access this course by logging into the platform.
          </p>

          <p>
            <b>Login:</b> 
            <a href="https://platform.teamtechsign.in">
              platform.teamtechsign.in
            </a>
          </p>

          <hr style="margin:20px 0"/>

          <p>Regards,<br/><b>TSS Team</b></p>
        </div>
      `
    });

    logger.success("Course added and email sent");

    res.json({
      message: "Course added successfully and email sent",
      course: user.course
    });

  } catch (err) {
    logger.error("Error in addCourse: " + err.message);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addAssignment = async (req, res) => {
  logger.info("addAssignment API called");
  const { email, assignmentId } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.error("User not found in addAssignment");
      return res.status(404).json({ message: "User not found" });
    }
    // prevent duplicate
    if (user.assignments.includes(assignmentId)) {
      logger.error("Assignment already exists in addAssignment");
      return res.status(400).json({ message: "Assignment already exists" });
    }
    user.assignments.push(assignmentId);
    await user.save();
    logger.success("Assignment added successfully");
    res.json({
      message: "Assignment added successfully",
      assignments: user.assignments
    });
  } catch (err) {
    logger.error("Error in addAssignment: " + err.message);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
