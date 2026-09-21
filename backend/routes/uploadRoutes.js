import express from "express";
import multer from "multer";
import upload from "../middleware/upload.js";
import {
  uploadImages,
  deleteImage,
} from "../controllers/uploadController.js";

const router = express.Router();

// Wrap multer so errors come back as clean JSON instead of HTML
const handleUpload = (req, res, next) => {
  upload.array("images", 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "Each image must be under 5 MB",
        });
      }

      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          message: "You can upload maximum 5 images",
        });
      }

      return res.status(400).json({ message: err.message });
    }

    if (err) {
      return res.status(400).json({ message: err.message });
    }

    next();
  });
};

router.post("/", handleUpload, uploadImages);
router.delete("/:filename", deleteImage);

export default router;