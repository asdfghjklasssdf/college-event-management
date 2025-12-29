// models/Venue.js
import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: Number,
  location: String,
  bookings: [
    {
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      bookedBy: String,
    },
  ],
});

export default mongoose.model("Venue", venueSchema);
