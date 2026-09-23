export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.twelvedata.com/price?symbol=XAU/USD",
      {
        headers: {
          Authorization: `apikey ${process.env.TWELVE_DATA_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || data.status === "error") {
      return res.status(500).json({
        error: data.message || "Error al consultar Twelve Data",
      });
    }

    return res.status(200).json({
      symbol: "XAU/USD",
      price: Number(data.price),
    });
  } catch (error) {
    return res.status(500).json({
      error: "No se pudo conectar con Twelve Data",
    });
  }
}
