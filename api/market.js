export default async function handler(req, res) {
  try {
    const apiKey = process.env.TWELVE_DATA_API_KEY;

    const symbols = ["XAU/USD", "DXY", "US10Y"];

    const resultados = await Promise.all(
      symbols.map(async (symbol) => {
        const response = await fetch(
          `https://api.twelvedata.com/price?symbol=${encodeURIComponent(symbol)}`,
          {
            headers: {
              Authorization: `apikey ${apiKey}`,
            },
          }
        );

        const data = await response.json();

        return {
          symbol,
          price:
            response.ok && data.status !== "error"
              ? Number(data.price)
              : null,
          error:
            response.ok && data.status !== "error"
              ? null
              : data.message || "No disponible",
        };
      })
    );

    return res.status(200).json({
      XAUUSD: resultados.find((x) => x.symbol === "XAU/USD"),
      DXY: resultados.find((x) => x.symbol === "DXY"),
      US10Y: resultados.find((x) => x.symbol === "US10Y"),
    });
  } catch (error) {
    return res.status(500).json({
      error: "No se pudieron consultar los datos de mercado",
    });
  }
}
