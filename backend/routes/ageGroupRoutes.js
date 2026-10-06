import express from "express";
import { requireAdmin } from "../middleware/adminAuth.js";

import {
  getAgeGroups,
  getAllAgeGroups,
  createAgeGroup,
  updateAgeGroup,
  deleteAgeGroup,
} from "../controllers/ageGroupController.js";

const router = express.Router();

router.get("/", getAgeGroups);
router.get("/admin/all", requireAdmin, getAllAgeGroups);
router.post("/", requireAdmin, createAgeGroup);
router.put("/:id", requireAdmin, updateAgeGroup);
router.delete("/:id", requireAdmin, deleteAgeGroup);

export default router;
