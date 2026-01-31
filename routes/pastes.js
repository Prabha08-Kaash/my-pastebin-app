import express, { Router } from "express";
import Paste from "../models/Paste.js";
import { nanoid } from "nanoid";

const router = express.Router();

//  POST REQ -->
router.post("/", async (req, res) => {
    const { content, ttl_seconds, max_views } = req.body

    //validation     
    if (!content || content.trim() === "") {
        return res.status(400).json({ error: "content is required" })
    }

    //  Parse TTL and max_views safely
   const ttl = ttl_seconds !== undefined && ttl_seconds !== "" ? parseInt(ttl_seconds) : undefined;
   const maxViews = max_views !== undefined && max_views !== "" ? parseInt(max_views) : undefined;

    // Validate TTL and max_views
    if (ttl !== undefined && (isNaN(ttl) || ttl < 1)) {
        return res.status(400).json({ error: "ttl_seconds must be ≥ 1" });
    }
    if (maxViews !== undefined && (isNaN(maxViews) || maxViews < 1)) {
        return res.status(400).json({ error: "max_views must be ≥ 1" });
    }

    // generate id
    const id = nanoid(10); 

    // create new paste
    const paste = new Paste({
        _id: id,
        content,
        ttl_seconds: ttl,
        max_views: maxViews,
    })

    //save to DB
    await paste.save();

    //send response
    res.status(200).json({
        id,
        url: `${req.protocol}://${req.get("host")}/p/${id}`,
    });
});


// GET REQ -->
router.get("/:id", async (req, res) => {
    const id = req.params.id;

    //current time (for testing or real time)
    const testNow = req.headers["x-test-now-ms"];

    let now;
    if (process.env.TEST_MODE === "1" && testNow) {
        now = Number(testNow);
    } else {
        now = Date.now();
    }

    //find paste from DB
    const paste = await Paste.findById(id);

    if (!paste) {
        return res.status(404).json({
            error: "Paste not found"
        })
    }

    
    const ttlExpired = paste.ttl_seconds && now > paste.created_at.getTime() + paste.ttl_seconds * 1000;
    const maxViewsExceeded = paste.max_views && paste.views_count >= paste.max_views;

    if (ttlExpired || maxViewsExceeded) {
        return res.status(404).json({ error: ttlExpired ? "Paste expired" : "Max Views exceeded" });
    }


    paste.views_count += 1;
    await paste.save();

    // send res
    res.status(200).json({
        content: paste.content,
        remaining_views: paste.max_views
            ? paste.max_views - paste.views_count
            : null,
        expires_at: paste.ttl_seconds
            ? new Date(
                paste.created_at.getTime() + paste.ttl_seconds * 1000
            )
            : null,
    });
});

export default router;

