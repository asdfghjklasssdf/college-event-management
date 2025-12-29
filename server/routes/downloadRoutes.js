import express from "express";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import Venue from "../models/Venue.js";
import { auth } from "../middleware/auth.js";
import { allowDepartment } from "../middleware/departmentAccess.js";
import { Parser } from "json2csv";

const router = express.Router();

// 🎯 Download event list
router.get("/events/csv", auth, allowDepartment(), async (req, res) => {
  const filter = req.departmentFilter || {};
  const events = await Event.find(filter);

  const fields = ["eventName", "department", "eventType", "eventDate", "eventTime"];
  const parser = new Parser({ fields });
  const csv = parser.parse(events);

  res.header("Content-Type", "text/csv");
  res.attachment("events.csv");
  return res.send(csv);
});

// 🎯 Download registration list
router.get("/registrations/csv", auth, allowDepartment(), async (req, res) => {
  const filter = req.departmentFilter || {};
  const events = await Event.find(filter, "_id");
  const registrations = await Registration.find({
    eventId: { $in: events.map((e) => e._id) },
  });

  const fields = ["name", "email", "department", "year", "eventId"];
  const parser = new Parser({ fields });
  const csv = parser.parse(registrations);

  res.header("Content-Type", "text/csv");
  res.attachment("registrations.csv");
  return res.send(csv);
});

// 🎯 Download venue list
router.get("/venues/csv", auth, allowDepartment(), async (req, res) => {
  const venues = await Venue.find();
  const fields = ["name", "location", "capacity"];
  const parser = new Parser({ fields });
  const csv = parser.parse(venues);

  res.header("Content-Type", "text/csv");
  res.attachment("venues.csv");
  return res.send(csv);
});

export default router;
