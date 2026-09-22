import cloudinary from "../config/cloudinary.js";

// Upload a single buffer to Cloudinary via stream
const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "little-store" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// POST /api/upload  (field name: "images", max 5 files)
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No image selected",
      });
    }

    const results = await Promise.all(
      req.files.map((file) => uploadBufferToCloudinary(file.buffer))
    );

    const urls = results.map((r) => r.secure_url);

    res.status(201).json({ urls });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/upload/:publicId (URL-encoded, e.g. little-store%2Fabc123)
export const deleteImage = async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    res.status(200).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};