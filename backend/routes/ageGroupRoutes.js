import express from "express";

import {
  getAgeGroups,
  createAgeGroup,
  updateAgeGroup,
  deleteAgeGroup,
} from "../controllers/ageGroupController.js";

const router = express.Router();

router.get("/", getAgeGroups);
router.post("/", createAgeGroup);
router.put("/:id", updateAgeGroup);
router.delete("/:id", deleteAgeGroup);

export default router;