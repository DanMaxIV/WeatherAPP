// api/weather.js

export default async function handler(req, res) {
  const city = req.query.q;
  const apiKey = process.env.WEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.status !== 200) {
      return res.status(response.status).json({ error: data.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
}
