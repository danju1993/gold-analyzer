export default async function handler(req, res) {
  const apiKey = process.env.REALMARKET_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      symbol: "USOIL",
      ok: false,
      error: "REALMARKET_API_KEY no está configurada"
    });
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 20000);

  try {
    const url =
      "https://api.realmarketapi.com/api/v1/price" +
      "?apiKey=" + encodeURIComponent(apiKey) +
      "&symbolCode=USOIL" +
      "&timeFrame=M1";

    const response = await fetch(url, {
      signal: controller.signal
    });

    const data = await response.json();

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(500).json({
        symbol: "USOIL",
        ok: false,
        error: data?.message || "Error consultando USOIL",
        data
      });
    }

    return res.status(200).json({
      symbol: "USOIL",
      ok: true,
      data
    });

  } catch (error) {

    clearTimeout(timeout);

    return res.status(500).json({
      symbol: "USOIL",
      ok: false,
      error: error.name === "AbortError"
        ? "USOIL tardó más de 20 segundos"
        : "No se pudo consultar USOIL"
    });
  }
}
