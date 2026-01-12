const Question = require("../models/Question");
const logger = require("../utils/logger");

// CREATE
exports.createQuestion = async (req, res) => {
  logger.info("createQuestion API called");
  try {
    console.log(req.body);
    
    const question = await Question.create(req.body);
    logger.success("Question created successfully");
    res.status(201).json(question);
  } catch (err) {
    logger.error("Error in createQuestion: " + err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllQuestionsforAdmin= async (req, res) => {
  logger.info("getAllQuestionsforAdmin API called");
  try {
    const questions = await Question.find();
    logger.success("All Questions for admin retrieved successfully");
    res.json(questions);
  } catch (err) {
    logger.error("Error in getAllQuestionsforAdmin: " + err.message);
    res.status(500).json({ error: err.message });
  }
};
 
// LIST BY CATEGORY
exports.getQuestionsByCategory = async (req, res) => {
  logger.info("getQuestionsByCategory API called");
  try {
    const { categoryId } = req.query;
    const questions = await Question.find(
      { categoryId },
      "title difficulty"
    );
    logger.success("Questions by category retrieved successfully");
    res.json(questions);
  } catch (err) {
    logger.error("Error in getQuestionsByCategory: " + err.message);
    res.status(500).json({ error: err.message });
  }
};

// SINGLE QUESTION
exports.getQuestionById = async (req, res) => {
  logger.info("getQuestionById API called");
  try {
    const question = await Question.findById(req.params.id)
      .select("-hiddenTestcases");
    logger.success("Question by ID retrieved successfully");
    res.json(question);
  } catch (err) {
    logger.error("Error in getQuestionById: " + err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestionByIdforAdmin = async (req, res) => {
  logger.info("getQuestionByIdforAdmin API called");
  try {
    const question = await Question.findById(req.params.id)
    logger.success("Question by ID for admin retrieved successfully");
    res.json(question);
  } catch (err) {
    logger.error("Error in getQuestionByIdforAdmin: " + err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestionTitleById = async (questionId) => {
  logger.info("getQuestionTitleById called");
  try {
    const question = await Question.findById(questionId).select("title");
    logger.success("Question title retrieved successfully");
    return question ? question.title : null;
  } catch (err) {
    logger.error("Error in getQuestionTitleById: " + err.message);
    return null;
  }
}
// UPDATE QUESTION
exports.updateQuestion = async (req, res) => {
  logger.info("updateQuestion API called");
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
      logger.error("Question not found in updateQuestion");
      return res.status(404).json({
        message: "Question not found"
      });
    }

    logger.success("Question updated successfully");
    res.json(updatedQuestion);
  } catch (err) {
    logger.error("Error in updateQuestion: " + err.message);
    res.status(500).json({
      error: err.message
    });
  }
};

