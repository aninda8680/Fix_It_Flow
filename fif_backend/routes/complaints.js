import express from "express";
import multer from "multer";
import Complaint from "../models/Complaint.js";
import { uploadMultipleToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, "SECRET123");
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// CREATE COMPLAINT - Multiple images support
router.post(
  "/create",
  verifyToken,
  upload.array("images", 10), // Allow up to 10 images
  async (req, res) => {
    let complaint = null;
    
    try {
      const { description, lat, lng } = req.body;

      // Validate required fields
      if (!description || !lat || !lng) {
        return res.status(400).json({
          message: "Description and location are required",
        });
      }

      // Check if images were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "At least one image is required",
        });
      }

      // Create complaint document first to get the ID
      complaint = await Complaint.create({
        user: req.user._id,
        description,
        images: [], // Temporarily empty, will update after upload
        location: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
      });

      // Create folder path with complaint ID
      const folderPath = `fixitflow/complaints/${complaint._id}`;

      // Upload images to Cloudinary in the complaint-specific folder
      const fileBuffers = req.files.map((file) => file.buffer);
      const cloudinaryResults = await uploadMultipleToCloudinary(
        fileBuffers,
        folderPath
      );

      // Extract image URLs and public IDs
      const images = cloudinaryResults.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));

      // Update complaint with image URLs
      complaint.images = images;
      await complaint.save();

      res.status(201).json({
        message: "Complaint submitted successfully",
        complaint: {
          id: complaint._id,
          description: complaint.description,
          images: complaint.images,
          location: complaint.location,
          status: complaint.status,
          createdAt: complaint.createdAt,
        },
      });
    } catch (error) {
      console.error("Error creating complaint:", error);
      
      // If complaint was created but upload failed, try to delete it
      if (complaint && complaint._id) {
        try {
          await Complaint.findByIdAndDelete(complaint._id);
        } catch (deleteError) {
          console.error("Error deleting complaint after upload failure:", deleteError);
        }
      }
      
      res.status(500).json({
        message: "Failed to create complaint",
        error: error.message,
      });
    }
  }
);

// GET ALL COMPLAINTS (for a user)
router.get("/my-complaints", verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
});

// GET SINGLE COMPLAINT
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ complaint });
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({
      message: "Failed to fetch complaint",
      error: error.message,
    });
  }
});

export default router;

