import express from "express";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// 🧩 Register for an event
router.post("/register", async (req, res) => {
  try {
    const { eventId, name, email, phone, collegeId, department, year } = req.body;

    // ✅ Check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
  if (event.status === "Completed") {
      return res.status(400).json({
        message: "❌ Registration closed. Event is already completed.",
      });
    }

    if (event.status === "Ongoing") {
      return res.status(400).json({
        message: "❌ Registration closed. Event has already started.",
      });
    }

    
    // ✅ Combine date and time into a real Date object for comparison
   const eventDate = event.eventDate.toISOString().split("T")[0];
    const eventStartTime = new Date(`${eventDate}T${event.eventTime}`);
    const now = new Date();

    if (eventStartTime <= now) {
      return res.status(400).json({
        message: "❌ Event registration closed. Start time has passed.",
      });
    }

    // Optional: prevent duplicate registration
    const existing = await Registration.findOne({ eventId, email });
    if (existing) return res.status(400).json({ message: "Already registered" });

    const newReg = new Registration({
      eventId,
      name,
      email,
      phone,
      collegeId,
      department,
      year,
    });

    await newReg.save();

    res.status(201).json({
      message: "✅ Registration successful!",
      registration: newReg,
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// 🧩 Get all registrations (optional admin view)
router.get("/", async (req, res) => {
  try {
    const regs = await Registration.find().populate("eventId");
    res.json(regs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/event/:eventId", auth, async (req, res) => {
  try {
    const participants = await Registration.find({ eventId: req.params.eventId });
    res.json(participants);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

router.get("/department/total", auth, async (req, res) => {
  try {
    const events = await Event.find({ department: req.user.department });
    const eventIds = events.map((e) => e._id);

    const count = await Registration.countDocuments({
      eventId: { $in: eventIds },
    });

    res.json({ totalParticipants: count });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});


export default router;
