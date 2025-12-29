import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String },
    collegeId: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    role: { type: String, enum: ["Student", "Coordinator", "Admin"], default: "Student" },
    profilePhoto: { type: String }, // Cloudinary URL
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
