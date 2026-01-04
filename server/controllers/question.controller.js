const Question = require("../models/Question");

// CREATE
exports.createQuestion = async (req, res) => {
  const question = await Question.create(req.body);
  res.status(201).json(question);
};

// LIST BY CATEGORY
exports.getQuestionsByCategory = async (req, res) => {
  const { categoryId } = req.query;
  const questions = await Question.find(
    { categoryId },
    "title difficulty"
  );
  res.json(questions);
};

// SINGLE QUESTION
exports.getQuestionById = async (req, res) => {
  const question = await Question.findById(req.params.id)
    .select("-hiddenTestcases");
  res.json(question);
};

exports.getQuestionByIdforAdmin = async (req, res) => {
  const question = await Question.findById(req.params.id)
  res.json(question);
};

exports.getQuestionTitleById = async (questionId) => {
  const question = await Question.findById(questionId).select("title");
  return question ? question.title : null;
}
// UPDATE QUESTION
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,          // return updated document
        runValidators: true // enforce schema validation
      }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    res.json(updatedQuestion);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

