export default async function handler(req, res) {
  try {
    const apiKey = process.env.REALMARKET_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "REALMARKET_API_KEY no está configurada"
      });
    }

    const symbols = ["DXY", "USOIL", "AUDUSD"];

    const resultados = await Promise.all(
      symbols.map(async (symbolCode) => {

        const url =
          `https://api.realmarketapi.com/api/v1/price` +
          `?apiKey=${encodeURIComponent(apiKey)}` +
          `&symbolCode=${encodeURIComponent(symbolCode)}` +
          `&timeFrame=M1`;

        const response = await fetch(url);

        const data = await response.json();

        return {
          symbol: symbolCode,
          ok: response.ok,
          data
        };
      })
    );

    return res.status(200).json({
      DXY: resultados.find(x => x.symbol === "DXY"),
      USOIL: resultados.find(x => x.symbol === "USOIL"),
      AUDUSD: resultados.find(x => x.symbol === "AUDUSD")
    });

  } catch (error) {

    return res.status(500).json({
      error: "No se pudo consultar RealMarketAPI"
    });

  }
}
