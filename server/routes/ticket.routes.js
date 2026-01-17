const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticket.controller");
const authMiddleware = require("../middleware/auth.middleware");

/* STUDENT */
router.post(
  "/create",
//   authMiddleware,
  ticketController.createTicket
);

router.post(
  "/my",
//   authMiddleware,
  ticketController.getMyTickets
);

/* ADMIN */
router.get(
  "/all",
//   authMiddleware,
  ticketController.getAllTickets
);

router.put(
  "/resolve",
//   authMiddleware,
  ticketController.resolveTicket
);

module.exports = router;
