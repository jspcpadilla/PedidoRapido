/**
 * historial.js
 * Módulo de historial de clientes.
 * Permite buscar clientes y ver todos sus pedidos anteriores.
 */

const Historial = (() => {

  /**
   * Inicializa el módulo: bindea el botón de búsqueda y el Enter del input.
   */
  function init() {
    const btnBuscar = document.getElementById('btnBuscarCliente');
    const inputBuscar = document.getElementById('inputBuscarCliente');

    // Buscar al hacer clic
    btnBuscar.addEventListener('click', () => {
      const query = inputBuscar.value.trim();
      _mostrarResultados(query);
    });

    // Buscar al presionar Enter
    inputBuscar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = inputBuscar.value.trim();
        _mostrarResultados(query);
      }
    });

    // Búsqueda en tiempo real (mientras escribe)
    inputBuscar.addEventListener('input', () => {
      const query = inputBuscar.value.trim();
      if (query.length >= 2 || query.length === 0) {
        _mostrarResultados(query);
      }
    });
  }

  /**
   * Realiza la búsqueda y renderiza los resultados.
   * @param {string} query - Texto a buscar
   */
  function _mostrarResultados(query) {
    const contenedor = document.getElementById('resultadosHistorial');

    // Si no hay query, mostrar todos los clientes únicos
    let pedidosFiltrados;
    if (!query) {
      pedidosFiltrados = Storage.obtenerPedidos();
    } else {
      pedidosFiltrados = Storage.buscarPorCliente(query);
    }

    // Sin resultados
    if (pedidosFiltrados.length === 0) {
      contenedor.innerHTML = `
        <div class="historial-empty">
          <i class="bi bi-search display-5 mb-3 d-block" style="color: var(--text-muted)"></i>
          <p>${query ? `No se encontraron pedidos para "${_escapar(query)}".` : 'No hay pedidos registrados todavía.'}</p>
        </div>
      `;
      return;
    }

    // Agrupar pedidos por cliente
    const grupos = _agruparPorCliente(pedidosFiltrados);

    // Generar HTML para cada cliente
    contenedor.innerHTML = Object.entries(grupos)
      .map(([cliente, pedidos]) => _crearGrupoHTML(cliente, pedidos))
      .join('');
  }

  /**
   * Agrupa un array de pedidos en un objeto { nombreCliente: [pedidos] }.
   * @param {Array} pedidos
   * @returns {Object}
   */
  function _agruparPorCliente(pedidos) {
    return pedidos.reduce((grupos, pedido) => {
      const clave = pedido.cliente;
      if (!grupos[clave]) grupos[clave] = [];
      grupos[clave].push(pedido);
      return grupos;
    }, {});
  }

  /**
   * Genera el HTML de un bloque de historial para un cliente.
   * @param {string} cliente - Nombre del cliente
   * @param {Array} pedidos - Sus pedidos
   * @returns {string} HTML
   */
  function _crearGrupoHTML(cliente, pedidos) {
    // Calcular total gastado
    const totalGastado = pedidos.reduce((sum, p) => sum + parseFloat(p.total), 0);
    const totalPedidos = pedidos.length;

    // Filas de la tabla interna
    const filas = [...pedidos].reverse().map(p => `
      <tr>
        <td>${_escapar(p.producto)}</td>
        <td>${p.cantidad}</td>
        <td><span class="price-val">$${parseFloat(p.total).toFixed(2)}</span></td>
        <td><span class="fecha-val">${_formatearFecha(p.fecha)}</span></td>
        <td>
          <span class="badge-estado ${_claseBadge(p.estado)}">${p.estado}</span>
        </td>
      </tr>
    `).join('');

    return `
      <div class="historial-cliente mb-4">
        <div class="historial-cliente-header">
          <span class="historial-nombre">
            <i class="bi bi-person-circle"></i>
            ${_escapar(cliente)}
          </span>
          <div class="historial-stats">
            <span>${totalPedidos} pedido${totalPedidos !== 1 ? 's' : ''}</span>
            <span>Total: <strong>$${totalGastado.toFixed(2)}</strong></span>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table custom-table mb-0">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  /**
   * Formatea una fecha ISO.
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
   * Devuelve la clase CSS del badge según el estado.
   * @param {string} estado
   * @returns {string}
   */
  function _claseBadge(estado) {
    const mapa = {
      'Pendiente':  'badge-estado badge-pendiente',
      'En proceso': 'badge-estado badge-proceso',
      'Entregado':  'badge-estado badge-entregado',
    };
    return mapa[estado] || 'badge-estado badge-pendiente';
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
  return { init };

})();
