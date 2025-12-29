import express from "express";
import { auth } from "../middleware/auth.js";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

const router = express.Router();

// SEND NOTIFICATION TO PARTICIPANTS OF AN EVENT
router.post("/send", auth, async (req, res) => {
  try {
    const { eventId, message } = req.body;

    if (!eventId || !message) {
      return res.status(400).json({ message: "Event ID and message required" });
    }

    // Get event
    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    // Get participants of this event
    const participants = await Registration.find({ eventId });

    // SIMULATION: We are not sending actual emails, just acknowledging
    console.log("Notification sent to:", participants.length, "participants");

    res.json({
      message: `Notification sent to ${participants.length} participants.`,
    });

  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ message: "Server error", err });
  }
});

export default router;
