// routes/venueRoutes.js
import express from "express";
import Venue from "../models/Venue.js";
import Event from "../models/Event.js";
import { auth } from "../middleware/auth.js";
import { allowDepartment } from "../middleware/departmentAccess.js";

const router = express.Router();

// 🏛️ Add a new venue
router.post("/", async (req, res) => {
  try {
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json({ message: "Venue added successfully!", venue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 📋 Get all venues
router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 📅 Book a venue
// 📅 Book a venue
router.post("/book", auth, async (req, res) => {
  try {
    const { venueId, eventId, date, startTime, endTime, bookedBy } = req.body;
  if (req.user.role === "Student") {
      return res.status(403).json({
        message: "❌ Students are not allowed to book venues.",
      });
    }
    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    // ✅ Combine date + time into actual JS Date objects for comparison
    const bookingDate = new Date(date);
    const now = new Date();

    // Build full datetime for comparison (for same day bookings)
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    // ✅ Check if the booking date/time is in the past
    if (startDateTime < now) {
      return res
        .status(400)
        .json({ message: "❌ You cannot book a venue for a past time or date." });
    }

    // ✅ Check if endTime is before startTime
    if (endDateTime <= startDateTime) {
      return res
        .status(400)
        .json({ message: "❌ End time must be later than start time." });
    }

    // ✅ Check for conflicting bookings
    const conflict = venue.bookings.find(
      (b) =>
        new Date(b.date).toDateString() === bookingDate.toDateString() &&
        ((startTime >= b.startTime && startTime < b.endTime) ||
          (endTime > b.startTime && endTime <= b.endTime))
    );

    if (conflict) {
      return res
        .status(400)
        .json({ message: "❌ Venue already booked for this time slot." });
    }

    // ✅ Add booking if everything passes
    venue.bookings.push({ eventId, date, startTime, endTime, bookedBy });
    await venue.save();

    res.json({ message: "✅ Venue booked successfully!", venue });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/department/bookings", auth, allowDepartment(), async (req, res) => {
  try {
    const filter = req.departmentFilter || {};

    // find events of department → list venue bookings
    const events = await Event.find(filter, "_id eventName");

    const venues = await Venue.find({
      "bookings.eventId": { $in: events.map((e) => e._id) }
    });

    res.json(venues);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});


// ✅ Check venue availability
router.post("/check-availability", async (req, res) => {
  try {
    const { venueId, date, startTime, endTime } = req.body;

    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    // Check conflicts
    const conflict = venue.bookings.find(
      (b) =>
        new Date(b.date).toDateString() === new Date(date).toDateString() &&
        ((startTime >= b.startTime && startTime < b.endTime) ||
          (endTime > b.startTime && endTime <= b.endTime))
    );

    if (conflict) {
      return res.status(200).json({ available: false, message: "❌ Venue already booked for this time." });
    }

    res.status(200).json({ available: true, message: "✅ Venue is available." });
  } catch (error) {
    console.error("Check availability error:", error);
    res.status(500).json({ available: false, message: "Server error" });
  }
});

router.get("/export/csv", auth, async (req, res) => {
  try {
    const venues = await Venue.find();

    const { Parser } = await import("json2csv");
    const parser = new Parser();
    const csv = parser.parse(venues);

    res.header("Content-Type", "text/csv");
    res.attachment("venues.csv");
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "CSV export failed", error });
  }
});

export default router;
