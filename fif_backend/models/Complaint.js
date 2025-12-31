//models/Complaint.js
import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // 🔥 AUTO-FILLED BY YOLO
    issueType: {
      type: String,
      enum: ["pothole", "unknown"],
      default: "unknown",
    },

    aiDetection: {
      detected: { type: Boolean, default: false },
      confidence: { type: Number },
      boxes: [[Number]], // [[x1,y1,x2,y2]]
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);

