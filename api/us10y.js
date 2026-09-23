export default async function handler(req, res) {
  try {
    const url =
      "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value=2026";

    const response = await fetch(url);
    const xml = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: "No se pudo consultar el Tesoro de EE. UU."
      });
    }

    // Buscamos las fechas y los rendimientos US10Y
    const fechas = [
      ...xml.matchAll(/<d:NEW_DATE[^>]*>(.*?)<\/d:NEW_DATE>/g)
    ];

    const rendimientos = [
      ...xml.matchAll(/<d:BC_10YEAR[^>]*>(.*?)<\/d:BC_10YEAR>/g)
    ];

    if (fechas.length < 2 || rendimientos.length < 2) {
      return res.status(500).json({
        error: "No hay suficientes datos para comparar US10Y"
      });
    }

    // Último dato disponible
    const ultimo = Number(
      rendimientos[rendimientos.length - 1][1]
    );

    const anterior = Number(
      rendimientos[rendimientos.length - 2][1]
    );

    const fecha = fechas[fechas.length - 1][1];
    const fechaAnterior = fechas[fechas.length - 2][1];

    // Determinar dirección
    let direction = "neutral";

    if (ultimo > anterior) {
      direction = "up";
    } else if (ultimo < anterior) {
      direction = "down";
    }

    return res.status(200).json({
      symbol: "US10Y",
      price: ultimo,
      previousPrice: anterior,
      change: Number((ultimo - anterior).toFixed(3)),
      direction: direction,
      unit: "%",
      date: fecha,
      previousDate: fechaAnterior,
      source: "U.S. Treasury"
    });

  } catch (error) {

    return res.status(500).json({
      error: "Error al consultar US10Y"
    });

  }
}
