// routes/analyticsRoutes.js
import express from "express";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

const router = express.Router();

// 📊 Get analytics overview
router.get("/", async (req, res) => {
  try {
    // Total events
    const totalEvents = await Event.countDocuments();

    // Count by status
    const statusCounts = await Event.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Department-wise counts
    const departmentCounts = await Event.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly counts
    const monthlyCounts = await Event.aggregate([
      {
        $group: {
          _id: { $month: "$eventDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Paid vs Free
    const paidStats = await Event.aggregate([
      {
        $group: {
          _id: "$isPaid",
          count: { $sum: 1 },
        },
      },
    ]);

    // ✅ Registration count per event
    const registrationsPerEvent = await Registration.aggregate([
      {
        $group: {
          _id: "$eventId",
          registrationCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "events", // collection name in MongoDB (lowercase plural)
          localField: "_id",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          _id: 1,
          registrationCount: 1,
          eventName: "$event.eventName",
          department: "$event.department",
          eventDate: "$event.eventDate",
        },
      },
      { $sort: { registrationCount: -1 } },
    ]);

    res.json({
      totalEvents,
      statusCounts,
      departmentCounts,
      monthlyCounts,
      paidStats,
      registrationsPerEvent,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/registrations", async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments();

    // Top 5 most registered events
    const topEvents = await Registration.aggregate([
      { $group: { _id: "$eventId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      { $project: { eventName: "$event.eventName", count: 1 } },
    ]);

    // Department-wise registrations
    const departmentStats = await Registration.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly registrations trend
    const monthlyTrend = await Registration.aggregate([
      {
        $group: {
          _id: { $month: "$timestamp" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json({
      totalRegistrations,
      topEvents,
      departmentStats,
      monthlyTrend,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


export default router;
