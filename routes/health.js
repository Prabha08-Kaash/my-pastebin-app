import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get('/healthz', async (req, res) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(500).json({ ok: false, message: "DB not ready" });
    }

    await db.command({ ping: 1 });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
});

export default router;








