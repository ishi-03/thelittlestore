import Subscriber from "../models/Subscriber.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// PUBLIC: POST /api/newsletter  { email }
export const subscribe = async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();

    if (!EMAIL.test(email) || email.length > 120) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    // Already subscribed is treated as success (no duplicates, no error)
    await Subscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });

    res.status(201).json({ message: "Thanks for joining the little circle!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// ADMIN: GET /api/newsletter  → all subscribers, newest first
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
