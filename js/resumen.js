/**
 * resumen.js
 * Módulo de resumen del día.
 * Calcula y muestra estadísticas de los pedidos del día actual.
 */

const Resumen = (() => {

  /**
   * Actualiza todas las estadísticas y la tabla del resumen.
   * Se llama cada vez que hay cambios en los pedidos.
   */
  function actualizar() {
    const pedidosHoy = Storage.obtenerPedidosHoy();

    _actualizarCards(pedidosHoy);
    _actualizarTabla(pedidosHoy);
  }

  /**
   * Actualiza las cards de estadísticas con los datos del día.
   * @param {Array} pedidosHoy - Pedidos filtrados de hoy
   */
  function _actualizarCards(pedidosHoy) {
    // Total de pedidos del día
    document.getElementById('statTotalPedidos').textContent = pedidosHoy.length;

    // Dinero total recaudado hoy
    const totalDinero = pedidosHoy.reduce((sum, p) => sum + parseFloat(p.total), 0);
    document.getElementById('statDineroTotal').textContent = `$${totalDinero.toFixed(2)}`;

    // Pedidos pendientes hoy
    const pendientes = pedidosHoy.filter(p => p.estado === 'Pendiente').length;
    document.getElementById('statPendientes').textContent = pendientes;

    // Pedidos entregados hoy
    const entregados = pedidosHoy.filter(p => p.estado === 'Entregado').length;
    document.getElementById('statEntregados').textContent = entregados;
  }

  /**
   * Renderiza la tabla de pedidos de hoy en la sección de resumen.
   * @param {Array} pedidosHoy
   */
  function _actualizarTabla(pedidosHoy) {
    const tbody    = document.getElementById('bodyResumen');
    const emptyMsg = document.getElementById('emptyResumen');

    if (pedidosHoy.length === 0) {
      tbody.innerHTML = '';
      emptyMsg.classList.remove('d-none');
      return;
    }

    emptyMsg.classList.add('d-none');

    tbody.innerHTML = [...pedidosHoy].reverse().map(p => `
      <tr>
        <td><span class="cliente-name">${_escapar(p.cliente)}</span></td>
        <td>${_escapar(p.producto)}</td>
        <td>${p.cantidad}</td>
        <td><span class="price-val">$${parseFloat(p.total).toFixed(2)}</span></td>
        <td>
          <span class="badge-estado ${_claseBadge(p.estado)}">${p.estado}</span>
        </td>
      </tr>
    `).join('');
  }

  /**
   * Devuelve la clase CSS del badge según el estado.
   * @param {string} estado
   * @returns {string}
   */
  function _claseBadge(estado) {
    const mapa = {
      'Pendiente':  'badge-pendiente',
      'En proceso': 'badge-proceso',
      'Entregado':  'badge-entregado',
    };
    return mapa[estado] || 'badge-pendiente';
  }

  /**
   * Escapa HTML para prevenir XSS.
   * @param {string} str
   * @returns {string}
   */
  function _escapar(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // API pública
  return { actualizar };

})();
