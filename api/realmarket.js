export default async function handler(req, res) {
  try {
    const apiKey = process.env.REALMARKET_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "REALMARKET_API_KEY no está configurada"
      });
    }

    const symbols = ["DXY", "USOIL", "AUDUSD"];

    async function consultarSymbol(symbolCode) {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 7000);

      try {
        const url =
          `https://api.realmarketapi.com/api/v1/price` +
          `?apiKey=${encodeURIComponent(apiKey)}` +
          `&symbolCode=${encodeURIComponent(symbolCode)}` +
          `&timeFrame=M1`;

        const response = await fetch(url, {
          signal: controller.signal
        });

        const data = await response.json();

        return {
          symbol: symbolCode,
          ok: response.ok,
          data
        };

      } catch (error) {

        return {
          symbol: symbolCode,
          ok: false,
          data: {
            error:
              error.name === "AbortError"
                ? "Tiempo de espera agotado"
                : "No se pudo consultar el símbolo"
          }
        };

      } finally {
        clearTimeout(timeout);
      }
    }

    const resultados = await Promise.allSettled(
      symbols.map(symbol => consultarSymbol(symbol))
    );

    const datos = {};

    resultados.forEach(resultado => {

      if (resultado.status === "fulfilled") {

        const item = resultado.value;

        datos[item.symbol] = item;

      }

    });

    return res.status(200).json({
      DXY: datos.DXY || {
        symbol: "DXY",
        ok: false,
        data: {
          error: "Sin respuesta"
        }
      },

      USOIL: datos.USOIL || {
        symbol: "USOIL",
        ok: false,
        data: {
          error: "Sin respuesta"
        }
      },

      AUDUSD: datos.AUDUSD || {
        symbol: "AUDUSD",
        ok: false,
        data: {
          error: "Sin respuesta"
        }
      }
    });

  } catch (error) {

    console.error("Error RealMarketAPI:", error);

    return res.status(500).json({
      error: "No se pudo consultar RealMarketAPI"
    });

  }
}
