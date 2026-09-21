import AgeGroup from "../models/AgeGroups.js";

// Defaults that get seeded once, only if collection is empty
const defaultAgeGroups = [
  "0-6 Months",
  "6-12 Months",
  "12-18 Months",
  "18-24 Months",
  "2-4 Years",
  "4-6 Years",
];

// GET ALL AGE GROUPS
export const getAgeGroups = async (req, res) => {
  try {
    let ageGroups = await AgeGroup.find({ isActive: true }).sort({
      order: 1,
      createdAt: 1,
    });

    // First run: seed defaults so the dropdown is never empty
    if (ageGroups.length === 0) {
      await AgeGroup.insertMany(
        defaultAgeGroups.map((label, index) => ({
          label,
          order: index,
        }))
      );

      ageGroups = await AgeGroup.find({ isActive: true }).sort({
        order: 1,
        createdAt: 1,
      });
    }

    res.status(200).json(ageGroups);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE AGE GROUP
export const createAgeGroup = async (req, res) => {
  try {
    const { label, order } = req.body;

    if (!label || !label.trim()) {
      return res.status(400).json({
        message: "Age group label is required",
      });
    }

    const exists = await AgeGroup.findOne({ label: label.trim() });

    if (exists) {
      return res.status(400).json({
        message: "This age group already exists",
      });
    }

    const count = await AgeGroup.countDocuments();

    const ageGroup = await AgeGroup.create({
      label: label.trim(),
      order: order === undefined ? count : Number(order),
    });

    res.status(201).json(ageGroup);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE AGE GROUP
export const updateAgeGroup = async (req, res) => {
  try {
    const { label, order, isActive } = req.body;

    const ageGroup = await AgeGroup.findByIdAndUpdate(
      req.params.id,
      {
        ...(label !== undefined ? { label: label.trim() } : {}),
        ...(order !== undefined ? { order: Number(order) } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!ageGroup) {
      return res.status(404).json({
        message: "Age group not found",
      });
    }

    res.status(200).json(ageGroup);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE AGE GROUP
export const deleteAgeGroup = async (req, res) => {
  try {
    const ageGroup = await AgeGroup.findByIdAndDelete(req.params.id);

    if (!ageGroup) {
      return res.status(404).json({
        message: "Age group not found",
      });
    }

    res.status(200).json({
      message: "Age group deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};