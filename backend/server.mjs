import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.mjs';
import Weather from './models/weather.mjs'; // ensure this model is correctly defined

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware & DB
connectDB();
app.use(cors());
app.use(express.json());

/* ----------------- CRUD Routes ------------------- */

// CREATE – Save weather query (location + date range)
app.post("/api/weather", async (req, res) => {
  try {
    const { location, dateRange, temperature } = req.body;

    if (!location || !dateRange?.from || !dateRange?.to) {
      return res.status(400).json({ message: "Missing location or valid date range" });
    }

    if (new Date(dateRange.from) > new Date(dateRange.to)) {
      return res.status(400).json({ message: "Start date must be before end date" });
    }

    const newWeather = new Weather({ location, dateRange, temperature });
    await newWeather.save();
    res.status(201).json(newWeather);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating weather record." });
  }
});

// READ – Get all saved records
app.get("/api/weather", async (req, res) => {
  try {
    const records = await Weather.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching records." });
  }
});

// UPDATE – Update date range by ID
app.put("/api/weather/:id", async (req, res) => {
  try {
    const { dateRange } = req.body;

    if (!dateRange?.from || !dateRange?.to) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    if (new Date(dateRange.from) > new Date(dateRange.to)) {
      return res.status(400).json({ message: "Start date must be before end date" });
    }

    const updated = await Weather.findByIdAndUpdate(
      req.params.id,
      { dateRange },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Record not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating record" });
  }
});

// DELETE – Delete by ID
app.delete("/api/weather/:id", async (req, res) => {
  try {
    const deleted = await Weather.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting record" });
  }
});

/* ----------------- Start Server ------------------- */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});