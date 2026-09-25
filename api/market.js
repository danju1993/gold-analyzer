export default async function handler(req, res) {
  try {
    const apiKey = process.env.TWELVE_DATA_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "TWELVE_DATA_API_KEY no está configurada"
      });
    }

    const response = await fetch(
      "https://api.twelvedata.com/price?symbol=XAU/USD",
      {
        headers: {
          Authorization: `apikey ${apiKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || data.status === "error") {
      return res.status(500).json({
        error: data.message || "Error al consultar Twelve Data"
      });
    }

    const price = Number(data.price);

    if (!Number.isFinite(price)) {
      return res.status(500).json({
        error: "Twelve Data no devolvió un precio válido"
      });
    }

    return res.status(200).json({
      symbol: "XAU/USD",
      price
    });

  } catch (error) {
    console.error("Error XAU/USD:", error);

    return res.status(500).json({
      error: "No se pudo consultar XAU/USD"
    });
  }
}
