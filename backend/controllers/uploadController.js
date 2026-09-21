import fs from "fs";
import path from "path";

// Build full public URL for an uploaded file
const buildUrl = (req, filename) => {
  const base =
    process.env.BASE_URL ||
    `${req.protocol}://${req.get("host")}`;

  return `${base}/uploads/${filename}`;
};

// POST /api/upload  (field name: "images", max 5 files)
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No image selected",
      });
    }

    const urls = req.files.map((file) => buildUrl(req, file.filename));

    res.status(201).json({ urls });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/upload/:filename
export const deleteImage = async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);

    const filePath = path.join(process.cwd(), "uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    fs.unlinkSync(filePath);

    res.status(200).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};