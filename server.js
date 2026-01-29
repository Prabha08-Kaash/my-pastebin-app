import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// all routes
import healthRoute from "./routes/health.js";
import pastesRoute from "./routes/pastes.js";
import viewRoute from "./routes/view.js";
dotenv.config();

const app = express();

// for vercel -> views/index
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

// connect To MongoDB
let isConnected = false;

async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error Connecting to MongoDB");
    }
}
app.use((req, res, next) => {
    if (!isConnected) {
        connectToMongoDB();
    }
    next();
})

//mongoose.connect(process.env.MONGO_URL)
//.then(() => console.log("MongoDB connected"))
// .catch((err) => console.log(err));

// render 
app.get("/", (req, res) => {
    res.render("index", { error: null, url: null });
});

// routes api
app.use("/api", healthRoute);
app.use("/api/pastes", pastesRoute)
app.use("/", viewRoute)

export default app;

