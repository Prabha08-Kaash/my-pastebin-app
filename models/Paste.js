import mongoose from "mongoose";
const pasteSchema = new mongoose.Schema({

    _id: String,

    content: {
        type: String,
        required: true
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    ttl_seconds: Number,

    max_views: Number,

    views_count: {
        type: Number,
        default: 0
    }

});

const Paste = mongoose.model("Paste", pasteSchema);

export default Paste;