import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get('/healthz', async(req, res) => {
    try{
        await mongoose.connection.db.admin().ping();
        res.status(200).json({
             ok: true
        })
    } catch (error){
        console.error(error);
        res.status(500).json({ ok : false});
    }
} );

export default router;








