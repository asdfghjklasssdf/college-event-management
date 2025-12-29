import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventType: {
      type: String,
      enum: ["Technical", "Cultural", "Sports", "Workshop", "Seminar", "Other"],
      required: true,
    },
    eventDescription: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    eventEndTime: { type: String, required: true },
    venue: { type: String, required: true },
    organizerName: { type: String, required: true },
   department: { type: String, required: true },
    registrationLink: { type: String },
    posterImage: { type: String },
    maxParticipants: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    entryFee: { type: Number, default: 0 },
    contactPerson: { type: String },
    contactEmail: { type: String, required: true },
    contactNumber: { type: String },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
