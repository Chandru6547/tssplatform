const Ticket = require("../models/Ticket");

/* ================= CREATE TICKET ================= */
exports.createTicket = async (req, res) => {
  try {
    const { createdByEmail, createdByName, issue } = req.body;
    console.log(req.body);
    

    const ticket = await Ticket.create({
      createdByEmail,
      createdByName,
      issue
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket
    });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET STUDENT TICKETS ================= */
exports.getMyTickets = async (req, res) => {
  try {
    const { createdByEmail } = req.body;

    const tickets = await Ticket.find({ createdByEmail }).sort({
      createdAt: -1
    });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL TICKETS ================= */
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESOLVE TICKET ================= */
exports.resolveTicket = async (req, res) => {
  try {
    const { ticketId, resolvedBy, answer } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = "resolved";
    ticket.resolvedBy = resolvedBy;
    ticket.answer = answer;        // ✅ STORE ADMIN ANSWER
    ticket.resolvedOn = new Date();

    await ticket.save();

    res.json({
      message: "Ticket resolved successfully",
      ticket
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

