export default async function handler(req, res) {
  try {
    const apiKey = process.env.TWELVE_DATA_API_KEY;

    const response = await fetch(
      "https://api.twelvedata.com/bonds?country=United%20States&show_plan=true&outputsize=100",
      {
        headers: {
          Authorization: `apikey ${apiKey}`,
        },
      }
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "No se pudo consultar los bonos",
    });
  }
}
