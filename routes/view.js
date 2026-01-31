import express from "express";
import Paste from "../models/Paste.js";

const router = express.Router();

router.get("/p/:id", async (req, res) => {
  const id = req.params.id;

  // current time for test
  const testNow = req.headers['x-test-now-ms'];

  let now;
  if (process.env.TEST_MODE === '1' && testNow) {
    now = Number(testNow);
  } else {
    now = Date.now();
  }

  const paste = await Paste.findById(id);
  if (!paste) return res.status(404).send('Paste not found');

  // TTL check
  const expiresAt = paste.ttl_seconds
    ? paste.created_at.getTime() + paste.ttl_seconds * 1000
    : null;

  if (expiresAt && now > expiresAt) {
    return res.status(404).send('Paste expired');
  }

  const maxViews = paste.max_views;

  // Max views check
  if (maxViews && paste.views_count >= maxViews) {
    return res.status(404).send('Max Views Exceeded');
  }

  paste.views_count += 1;
  await paste.save();

  res.render('paste', { content: paste.content });
});

export default router;

