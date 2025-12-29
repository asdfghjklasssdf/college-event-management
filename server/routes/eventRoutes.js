// routes/eventRoutes.js
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Event from "../models/Event.js";
import Venue from "../models/Venue.js";
import { auth } from "../middleware/auth.js";
import { allowDepartment } from "../middleware/departmentAccess.js";

const router = express.Router();

// Configure multer for temporary storage
const storage = multer.diskStorage({});
const upload = multer({ storage });

// 🧩 CREATE NEW EVENT
router.post("/create", upload.single("posterImage"), async (req, res) => {
  try {
    const {
      eventName,
      eventType,
      eventDescription,
      eventDate,
      eventTime,
      eventEndTime, 
      venue,
      organizerName,
      department,
      registrationLink,
      maxParticipants,
      isPaid,
      entryFee,
      contactPerson,
      contactEmail,
      contactNumber,
      status,
      createdBy,
    } = req.body;

    let posterImageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "college_event_posters",
      });
      posterImageUrl = result.secure_url;
    }

      const autoStatus = autoUpdateStatus({
      eventDate,
      eventTime,
      eventEndTime,
    });

    if (req.user && req.user.role !== "Admin") {
      req.body.department = req.user.department;
    }

    const newEvent = new Event({
      
      eventName,
      eventType,
      eventDescription,
      eventDate,
      eventTime,
      eventEndTime,
      venue,
      organizerName,
      department,
      registrationLink,
      posterImage: posterImageUrl,
      maxParticipants,
      isPaid,
      entryFee,
      contactPerson,
      contactEmail,
      contactNumber,
       status: autoStatus,
      createdBy,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully!", event: newEvent });
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

/* ---------------------------------------------------------
    2️⃣ UPDATE EVENT (EDIT)
--------------------------------------------------------- */
router.patch("/edit/:id", upload.single("posterImage"), async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "college_event_posters",
      });
      updateData.posterImage = result.secure_url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event updated!", event: updatedEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating event" });
  }
});

/* ---------------------------------------------------------
    3️⃣ DELETE EVENT
--------------------------------------------------------- */
router.delete("/delete/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting event" });
  }
});

/* ---------------------------------------------------------
    4️⃣ EXTEND REGISTRATION DEADLINE
--------------------------------------------------------- */
router.patch("/extend-deadline/:id", async (req, res) => {
  try {
    const { registrationDeadline } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { registrationDeadline },
      { new: true }
    );

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Deadline updated!", event });
  } catch (err) {
    console.error("Deadline error:", err);
    res.status(500).json({ message: "Error extending deadline" });
  }
});

router.get("/department/stats/events", auth, async (req, res) => {
  try {
    const result = await Event.countDocuments({
      department: req.user.department,
    });

    res.json({ totalEvents: result });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------------------------------------------
    5️⃣ UPDATE STATUS MANUALLY
--------------------------------------------------------- */
router.patch("/update-status/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ message: "Status updated!", event });
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

router.post("/publish-results", auth, async (req, res) => {
  try {
    const { eventId, results } = req.body;

    if (!eventId || !results) {
      return res.status(400).json({ message: "Event ID and results required" });
    }

    // Update event results
    const event = await Event.findByIdAndUpdate(
      eventId,
      { results },
      { new: true }
    );

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Results published successfully!", event });

  } catch (err) {
    console.error("Publish results error:", err);
    res.status(500).json({ message: "Server error", err });
  }
});


function autoUpdateStatus(event) {
  const now = new Date();
  const eventDate = new Date(event.eventDate);

  // 🛑 If missing data → avoid crash
  if (!event.eventTime || !event.eventEndTime) {
    return event.status || "Upcoming";
  }

  const [startH, startM] = event.eventTime.split(":").map(Number);
  const [endH, endM] = event.eventEndTime.split(":").map(Number);

  const start = new Date(eventDate);
  start.setHours(startH, startM, 0);

  const end = new Date(eventDate);
  end.setHours(endH, endM, 0);

  if (now < start) return "Upcoming";
  if (now >= start && now <= end) return "Ongoing";
  return "Completed";
}

// 🔒 Department-based event list
router.get("/department/only", auth, allowDepartment(), async (req, res) => {
  try {
    const filter = req.departmentFilter || {}; // Admin → empty filter (all)
    const events = await Event.find(filter);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});


// 🧩 GET ALL EVENTS with filters
router.get("/", async (req, res) => {
  try {
    const { search, type, department, status, year, month, day, from, to, page = 1, limit = 100 } = req.query;
    let filter = {};

    if (search) filter.eventName = { $regex: search, $options: "i" };
    if (type) filter.eventType = type;
    if (department) filter.department = department;
    if (status) filter.status = status;

    if (from || to) {
      filter.eventDate = {};
      if (from) filter.eventDate.$gte = new Date(from);
      if (to) filter.eventDate.$lt = new Date(to);
    } else if (year || month || day) {
      const y = parseInt(year, 10);
      const m = month ? parseInt(month, 10) : undefined;
      const d = day ? parseInt(day, 10) : undefined;
      if (!isNaN(y)) {
        let start, end;
        if (m && !isNaN(m)) {
          if (d && !isNaN(d)) {
            start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
            end = new Date(Date.UTC(y, m - 1, d + 1, 0, 0, 0));
          } else {
            start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
            end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
          }
        } else {
          start = new Date(Date.UTC(y, 0, 1, 0, 0, 0));
          end = new Date(Date.UTC(y + 1, 0, 1, 0, 0, 0));
        }
        filter.eventDate = { $gte: start, $lt: end };
      }
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const events = await Event.find(filter)
      .sort({ eventDate: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // ✅ Load all venues to map names easily
    const Venue = (await import("../models/Venue.js")).default;
    const venues = await Venue.find({}, { _id: 1, name: 1 });

    // ✅ Replace venue ID string with its readable name
   const mappedEvents = await Promise.all(
      events.map(async (event) => {
        const venueMatch = venues.find((v) => v._id.toString() === event.venue);

        const updatedStatus = autoUpdateStatus(event);

        if (event.status !== updatedStatus) {
          await Event.findByIdAndUpdate(event._id, { status: updatedStatus });
        }

        return {
          ...event.toObject(),
          venueName: venueMatch ? venueMatch.name : event.venue,
          status: updatedStatus,
        };
      })
    );


    const total = await Event.countDocuments(filter);

res.json({ events: mappedEvents, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Auto-update status
    const updatedStatus = autoUpdateStatus(event);

    if (event.status !== updatedStatus) {
      await Event.findByIdAndUpdate(event._id, { status: updatedStatus });
      event.status = updatedStatus;
    }

    // Get venue name
    const venue = await Venue.findById(event.venue); // event.venue is ID

    res.json({
      ...event.toObject(),
      venueName: venue ? venue.name : "Unknown Venue",
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



export default router;
