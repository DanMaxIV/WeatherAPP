export default async function handler(req, res) {
  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing latitude or longitude" });
  }

  try {
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    );

    const data = await geoRes.json();

    if (!data || data.length === 0 || !data[0].name) {
      return res.status(404).json({ error: "City not found" });
    }

    const city = data[0].name;
    res.status(200).json({ city });
  } catch (err) {
    console.error("Geo API Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
