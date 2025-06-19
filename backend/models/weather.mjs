import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  dateRange: {
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  temperature: Number,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Weather = mongoose.model("Weather", weatherSchema);
export default Weather;
