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

    const fechas = [...xml.matchAll(/<d:NEW_DATE>(.*?)<\/d:NEW_DATE>/g)];
    const rendimientos = [...xml.matchAll(/<d:BC_10YEAR>(.*?)<\/d:BC_10YEAR>/g)];

    if (!fechas.length || !rendimientos.length) {
      return res.status(500).json({
        error: "No se encontró el US10Y"
      });
    }

    const ultimo = rendimientos[rendimientos.length - 1][1];
    const fecha = fechas[fechas.length - 1][1];

    return res.status(200).json({
      symbol: "US10Y",
      price: Number(ultimo),
      unit: "%",
      date: fecha,
      source: "U.S. Treasury"
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error al consultar US10Y"
    });
  }
}
