/**
 * pedidos.js
 * Módulo principal de gestión de pedidos.
 * Maneja: registro, visualización, cambio de estado y eliminación.
 */

const Pedidos = (() => {

  // ID del pedido pendiente de eliminación (para el modal de confirmación)
  let idPendienteEliminar = null;

  // ── Referencia al modal de Bootstrap ─────────────────────────
  let modalEliminar = null;

  /**
   * Inicializa el módulo: bindea eventos y renderiza la tabla.
   */
  function init() {
    // Inicializar modal de Bootstrap
    modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));

    // Evento: envío del formulario
    document.getElementById('formPedido').addEventListener('submit', _onFormSubmit);

    // Evento: confirmar eliminación en el modal
    document.getElementById('btnConfirmarEliminar').addEventListener('click', _confirmarEliminar);

    // Renderizar tabla inicial
    renderizarTabla();
  }

  /**
   * Handler del submit del formulario. Valida y registra el pedido.
   * @param {Event} e
   */
  function _onFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const form = document.getElementById('formPedido');

    // Validación nativa de Bootstrap
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // Leer valores del formulario
    const cliente  = document.getElementById('inputCliente').value.trim();
    const producto = document.getElementById('inputProducto').value.trim();
    const cantidad = parseInt(document.getElementById('inputCantidad').value, 10);
    const total    = parseFloat(document.getElementById('inputTotal').value);

    // Validaciones adicionales
    if (cantidad < 1) {
      mostrarToast('La cantidad debe ser mínimo 1.', 'error');
      return;
    }
    if (total < 0) {
      mostrarToast('El total no puede ser negativo.', 'error');
      return;
    }

    // Construir objeto pedido
    const nuevoPedido = {
      cliente,
      producto,
      cantidad,
      total,
      fecha:  new Date().toISOString(), // Fecha automática en ISO para fácil comparación
      estado: 'Pendiente',
    };

    // Guardar en LocalStorage
    Storage.agregarPedido(nuevoPedido);

    // Limpiar formulario
    form.reset();
    form.classList.remove('was-validated');

    // Actualizar UI
    renderizarTabla();
    Resumen.actualizar();

    mostrarToast(`✓ Pedido de ${cliente} registrado.`, 'success');
  }

  /**
   * Renderiza la tabla completa de pedidos.
   * Refresca todo el tbody con los datos actuales de LocalStorage.
   */
  function renderizarTabla() {
    const pedidos = Storage.obtenerPedidos();
    const tbody   = document.getElementById('bodyPedidos');
    const empty   = document.getElementById('emptyState');
    const badge   = document.getElementById('badgeTotal');

    // Mostrar/ocultar estado vacío
    if (pedidos.length === 0) {
      tbody.innerHTML = '';
      empty.classList.remove('d-none');
      badge.textContent = '0 pedidos';
      return;
    }

    empty.classList.add('d-none');
    badge.textContent = `${pedidos.length} pedido${pedidos.length !== 1 ? 's' : ''}`;

    // Generar filas (orden inverso: los más nuevos primero)
    tbody.innerHTML = [...pedidos].reverse().map((p, i) =>
      _crearFilaHTML(p, pedidos.length - i)
    ).join('');

    // Bindear eventos de los selects de estado y botones eliminar
    _bindearEventosTabla();
  }

  /**
   * Genera el HTML de una fila de la tabla para un pedido.
   * @param {Object} p - Objeto pedido
   * @param {number} num - Número de fila visible
   * @returns {string} HTML de la fila <tr>
   */
  function _crearFilaHTML(p, num) {
    const fecha      = _formatearFecha(p.fecha);
    const badgeClass = _claseBadge(p.estado);
    const totalFmt   = `$${parseFloat(p.total).toFixed(2)}`;

    return `
      <tr data-id="${p.id}">
        <td><span class="pedido-num">#${num}</span></td>
        <td><span class="cliente-name">${_escapar(p.cliente)}</span></td>
        <td>${_escapar(p.producto)}</td>
        <td>${p.cantidad}</td>
        <td><span class="price-val">${totalFmt}</span></td>
        <td><span class="fecha-val col-fecha">${fecha}</span></td>
        <td>
          <select class="select-estado" data-id="${p.id}" title="Cambiar estado">
            <option value="Pendiente"  ${p.estado === 'Pendiente'  ? 'selected' : ''}>⏳ Pendiente</option>
            <option value="En proceso" ${p.estado === 'En proceso' ? 'selected' : ''}>🔄 En proceso</option>
            <option value="Entregado"  ${p.estado === 'Entregado'  ? 'selected' : ''}>✅ Entregado</option>
          </select>
        </td>
        <td class="text-center">
          <button
            class="btn-action btn-action--delete"
            data-id="${p.id}"
            title="Eliminar pedido"
            aria-label="Eliminar pedido de ${_escapar(p.cliente)}"
          >
            <i class="bi bi-trash3"></i>
          </button>
        </td>
      </tr>
    `;
  }

  /**
   * Bindea los eventos dinámicos de la tabla (select estado + botón eliminar).
   * Se llama después de cada renderizado.
   */
  function _bindearEventosTabla() {
    // Selects de cambio de estado
    document.querySelectorAll('.select-estado').forEach(sel => {
      sel.addEventListener('change', _onCambiarEstado);
    });

    // Botones de eliminar
    document.querySelectorAll('.btn-action--delete').forEach(btn => {
      btn.addEventListener('click', _onEliminarClick);
    });
  }

  /**
   * Handler para cambio de estado desde el select.
   * @param {Event} e
   */
  function _onCambiarEstado(e) {
    const id        = e.target.dataset.id;
    const nuevoEstado = e.target.value;

    Storage.actualizarPedido(id, { estado: nuevoEstado });
    renderizarTabla();
    Resumen.actualizar();

    const emojis = { 'Pendiente': '⏳', 'En proceso': '🔄', 'Entregado': '✅' };
    mostrarToast(`${emojis[nuevoEstado]} Estado actualizado: ${nuevoEstado}`, 'info');
  }

  /**
   * Handler para clic en botón eliminar — abre el modal de confirmación.
   * @param {Event} e
   */
  function _onEliminarClick(e) {
    const btn = e.currentTarget;
    idPendienteEliminar = btn.dataset.id;
    modalEliminar.show();
  }

  /**
   * Confirma la eliminación del pedido pendiente y cierra el modal.
   */
  function _confirmarEliminar() {
    if (!idPendienteEliminar) return;

    Storage.eliminarPedido(idPendienteEliminar);
    idPendienteEliminar = null;

    modalEliminar.hide();
    renderizarTabla();
    Resumen.actualizar();

    mostrarToast('🗑️ Pedido eliminado.', 'error');
  }

  /**
   * Formatea una fecha ISO a formato legible local.
   * @param {string} isoString
   * @returns {string} Fecha formateada
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
      'Pendiente':  'badge-pendiente',
      'En proceso': 'badge-proceso',
      'Entregado':  'badge-entregado',
    };
    return mapa[estado] || 'badge-pendiente';
  }

  /**
   * Escapa caracteres especiales HTML para evitar XSS.
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
  return { init, renderizarTabla };

})();
