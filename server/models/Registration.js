
import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  collegeId: { type: String },
  department: { type: String },
  year: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Registration", registrationSchema);
