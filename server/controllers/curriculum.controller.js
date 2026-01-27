const Curriculum = require("../models/Curriculum");
const { findOrCreateCurriculum } = require("../utils/findOrCreateCurriculum");

exports.addCourse = async (req, res) => {
  try {
    const { college, year, batch, course } = req.body;

    const curriculum = await findOrCreateCurriculum(college, year, batch);

    if (!curriculum.course.includes(course)) {
      curriculum.course.push(course);
      await curriculum.save();
    }

    res.json({
      message: "Course added successfully",
      courses: curriculum.courses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMCQ = async (req, res) => {
  try {
    const { college, year, batch, mcq } = req.body;

    const curriculum = await findOrCreateCurriculum(college, year, batch);

    if (!curriculum.mcqs.includes(mcq)) {
      curriculum.mcqs.push(mcq);
      await curriculum.save();
    }

    res.json({
      message: "MCQ added successfully",
      mcqs: curriculum.mcqs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addAssignment = async (req, res) => {
  try {
    const { college, year, batch, assignment } = req.body;

    const curriculum = await findOrCreateCurriculum(college, year, batch);

    if (!curriculum.assignments.includes(assignment)) {
      curriculum.assignments.push(assignment);
      await curriculum.save();
    }

    res.json({
      message: "Assignment added successfully",
      assignments: curriculum.assignments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { college, year, batch } = req.query;

    const curriculum = await Curriculum.findOne({ college, year, batch });

    res.json(curriculum ? curriculum.course : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMCQs = async (req, res) => {
  try {
    const { college, year, batch } = req.query;

    const curriculum = await Curriculum.findOne({ college, year, batch });

    res.json(curriculum ? curriculum.mcqs : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const { college, year, batch } = req.query;

    const curriculum = await Curriculum.findOne({ college, year, batch });

    res.json(curriculum ? curriculum.assignments : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
