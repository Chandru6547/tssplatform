const Curriculum = require("../models/Curriculum");

async function findOrCreateCurriculum(college, year, batch) {
  let curriculum = await Curriculum.findOne({ college, year, batch });

  if (!curriculum) {
    curriculum = await Curriculum.create({
      college,
      year,
      batch,
      courses: [],
      mcqs: [],
      assignments: [],
    });
  }

  return curriculum;
}

module.exports = { findOrCreateCurriculum };
