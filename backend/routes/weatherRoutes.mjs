import express from 'express';
import fetch from 'node-fetch';
import Weather from './weatherModel.mjs';

const router = express.Router();

router.post('/weather', async (req, res) => {
  const { location } = req.body;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.API_KEY}&units=metric`
    );
    const data = await response.json();
    const weather = new Weather({ location, data });
    await weather.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

router.get('/weather', async (req, res) => {
  const weatherData = await Weather.find();
  res.json(weatherData);
});

router.put('/weather/:id', async (req, res) => {
  const { id } = req.params;
  const updated = await Weather.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});

router.delete('/weather/:id', async (req, res) => {
  await Weather.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

export default router;
