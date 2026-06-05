/**
 * exportar.js
 * Módulo de exportación de pedidos a formato CSV.
 * Genera un archivo descargable directamente en el navegador,
 * sin necesidad de servidor o backend.
 */

const Exportar = (() => {

  /**
   * Inicializa el módulo: bindea el botón de exportar.
   */
  function init() {
    document.getElementById('btnExportarCSV').addEventListener('click', exportarCSV);
  }

  /**
   * Genera y descarga el archivo CSV con todos los pedidos actuales.
   * El archivo se descarga automáticamente con nombre basado en la fecha.
   */
  function exportarCSV() {
    const pedidos = Storage.obtenerPedidos();

    if (pedidos.length === 0) {
      mostrarToast('⚠️ No hay pedidos para exportar.', 'error');
      return;
    }

    // Construir contenido CSV
    const csv = _construirCSV(pedidos);

    // Crear blob y disparar descarga
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);

    // Crear enlace temporal e iniciar descarga
    const enlace = document.createElement('a');
    enlace.href     = url;
    enlace.download = _nombreArchivo();
    enlace.style.display = 'none';

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

    // Liberar memoria del objeto URL
    URL.revokeObjectURL(url);

    mostrarToast(`📥 CSV exportado: ${pedidos.length} pedidos.`, 'success');
  }

  /**
   * Construye el contenido del CSV como string.
   * Incluye BOM (Byte Order Mark) para compatibilidad con Excel en español.
   * @param {Array} pedidos - Lista de pedidos
   * @returns {string} Contenido CSV listo para descargar
   */
  function _construirCSV(pedidos) {
    // BOM para que Excel reconozca tildes y ñ correctamente
    const BOM = '\uFEFF';

    // Cabecera del CSV
    const cabecera = ['ID', 'Cliente', 'Producto', 'Cantidad', 'Total', 'Estado', 'Fecha'];

    // Filas de datos
    const filas = pedidos.map(p => [
      p.id,
      _escaparCampo(p.cliente),
      _escaparCampo(p.producto),
      p.cantidad,
      parseFloat(p.total).toFixed(2),
      _escaparCampo(p.estado),
      _formatearFecha(p.fecha),
    ]);

    // Unir todo en una sola cadena CSV
    const lineas = [cabecera, ...filas].map(fila => fila.join(',')).join('\n');

    return BOM + lineas;
  }

  /**
   * Escapa un valor de campo CSV:
   * - Si contiene coma, salto de línea o comillas → lo envuelve en comillas dobles.
   * - Las comillas internas se escapan duplicándolas.
   * @param {string} valor
   * @returns {string}
   */
  function _escaparCampo(valor) {
    const str = String(valor ?? '');
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * Formatea una fecha ISO para incluirla en el CSV.
   * @param {string} isoString
   * @returns {string}
   */
  function _formatearFecha(isoString) {
    try {
      return new Date(isoString).toLocaleString('es-CO', {
        day:    '2-digit',
        month:  '2-digit',
        year:   'numeric',
        hour:   '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  }

  /**
   * Genera el nombre del archivo CSV con la fecha actual.
   * Formato: pedidorapido_2025-01-15.csv
   * @returns {string}
   */
  function _nombreArchivo() {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm   = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd   = String(hoy.getDate()).padStart(2, '0');
    return `pedidorapido_${yyyy}-${mm}-${dd}.csv`;
  }

  // API pública
  return { init, exportarCSV };

})();
