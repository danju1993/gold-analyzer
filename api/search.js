export default async function handler(req, res) {
  try {
    const apiKey = process.env.TWELVE_DATA_API_KEY;

    const consultas = ["DXY", "US10Y"];

    const resultados = await Promise.all(
      consultas.map(async (consulta) => {
        const response = await fetch(
          `https://api.twelvedata.com/symbol_search?symbol=${encodeURIComponent(consulta)}&outputsize=10&show_plan=true`,
          {
            headers: {
              Authorization: `apikey ${apiKey}`,
            },
          }
        );

        const data = await response.json();

        return {
          consulta,
          data,
        };
      })
    );

    return res.status(200).json({ resultados });
  } catch (error) {
    return res.status(500).json({
      error: "No se pudo realizar la búsqueda",
    });
  }
}
