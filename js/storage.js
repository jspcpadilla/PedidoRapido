/**
 * storage.js
 * Módulo de abstracción para LocalStorage.
 * Centraliza todas las operaciones de lectura y escritura
 * para mantener el resto del código limpio y desacoplado.
 */

const Storage = (() => {

  // Clave principal en LocalStorage
  const KEY = 'pedidorapido_pedidos';

  /**
   * Obtiene todos los pedidos almacenados.
   * @returns {Array} Lista de pedidos (puede estar vacía)
   */
  function obtenerPedidos() {
    try {
      const datos = localStorage.getItem(KEY);
      return datos ? JSON.parse(datos) : [];
    } catch (e) {
      console.error('Error al leer LocalStorage:', e);
      return [];
    }
  }

  /**
   * Guarda la lista completa de pedidos en LocalStorage.
   * @param {Array} pedidos - Array de objetos pedido
   */
  function guardarPedidos(pedidos) {
    try {
      localStorage.setItem(KEY, JSON.stringify(pedidos));
    } catch (e) {
      console.error('Error al guardar en LocalStorage:', e);
    }
  }

  /**
   * Agrega un pedido nuevo al almacenamiento.
   * @param {Object} pedido - Objeto con datos del pedido
   * @returns {Object} El pedido con su ID asignado
   */
  function agregarPedido(pedido) {
    const pedidos = obtenerPedidos();
    // Generar ID único basado en timestamp + número aleatorio
    pedido.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    pedidos.push(pedido);
    guardarPedidos(pedidos);
    return pedido;
  }

  /**
   * Actualiza un pedido existente por su ID.
   * @param {string} id - ID del pedido a actualizar
   * @param {Object} cambios - Propiedades a modificar
   * @returns {boolean} true si se actualizó, false si no se encontró
   */
  function actualizarPedido(id, cambios) {
    const pedidos = obtenerPedidos();
    const index = pedidos.findIndex(p => p.id === id);
    if (index === -1) return false;
    pedidos[index] = { ...pedidos[index], ...cambios };
    guardarPedidos(pedidos);
    return true;
  }

  /**
   * Elimina un pedido por su ID.
   * @param {string} id - ID del pedido a eliminar
   * @returns {boolean} true si se eliminó correctamente
   */
  function eliminarPedido(id) {
    const pedidos = obtenerPedidos();
    const nuevos = pedidos.filter(p => p.id !== id);
    if (nuevos.length === pedidos.length) return false; // No se encontró
    guardarPedidos(nuevos);
    return true;
  }

  /**
   * Filtra pedidos cuya fecha coincide con hoy.
   * @returns {Array} Pedidos del día actual
   */
  function obtenerPedidosHoy() {
    const hoy = new Date().toLocaleDateString('es-CO');
    return obtenerPedidos().filter(p => {
      const fechaPedido = new Date(p.fecha).toLocaleDateString('es-CO');
      return fechaPedido === hoy;
    });
  }

  /**
   * Filtra pedidos de un cliente específico (búsqueda parcial, insensible a mayúsculas).
   * @param {string} nombreCliente - Texto a buscar
   * @returns {Array} Pedidos que coinciden con el cliente
   */
  function buscarPorCliente(nombreCliente) {
    const query = nombreCliente.trim().toLowerCase();
    return obtenerPedidos().filter(p =>
      p.cliente.toLowerCase().includes(query)
    );
  }

  // API pública del módulo
  return {
    obtenerPedidos,
    guardarPedidos,
    agregarPedido,
    actualizarPedido,
    eliminarPedido,
    obtenerPedidosHoy,
    buscarPorCliente,
  };

})();
