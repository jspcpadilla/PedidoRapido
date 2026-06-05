/**
 * app.js
 * Punto de entrada principal de PedidoRápido.
 * Responsabilidades:
 *   1. Inicializar todos los módulos
 *   2. Gestionar la navegación entre secciones
 *   3. Exponer la función global mostrarToast (utilizada por todos los módulos)
 */

// ── Función global de notificaciones ──────────────────────────────
/**
 * Muestra una notificación tipo toast en la esquina inferior derecha.
 * @param {string} mensaje - Texto a mostrar
 * @param {'success'|'error'|'info'} tipo - Tipo visual del toast
 */
function mostrarToast(mensaje, tipo = 'info') {
  const toast   = document.getElementById('toastMsg');
  const textoEl = document.getElementById('toastText');

  // Limpiar clases de tipo anteriores
  toast.classList.remove('toast-success', 'toast-error', 'toast-info');
  toast.classList.add(`toast-${tipo}`);

  // Setear texto
  textoEl.textContent = mensaje;

  // Mostrar con Bootstrap Toast API
  const bsToast = bootstrap.Toast.getOrCreateInstance(toast, {
    delay: 3000, // Autocierre a los 3 segundos
  });
  bsToast.show();
}

// ── Navegación SPA (Single Page) ──────────────────────────────────
/**
 * Activa una sección y desactiva las demás.
 * Actualiza también el estado visual de los links del navbar.
 * @param {string} seccion - Nombre de la sección: 'pedidos' | 'historial' | 'resumen'
 */
function navegarA(seccion) {
  // Ocultar todas las secciones
  document.querySelectorAll('.app-section').forEach(s => {
    s.classList.remove('active');
  });

  // Mostrar la sección seleccionada
  const seccionEl = document.getElementById(`section-${seccion}`);
  if (seccionEl) seccionEl.classList.add('active');

  // Actualizar estado active en el navbar
  document.querySelectorAll('.nav-pill').forEach(link => {
    const linkSeccion = link.dataset.section;
    link.classList.toggle('active', linkSeccion === seccion);
  });

  // Acciones al entrar a secciones específicas
  if (seccion === 'resumen') {
    Resumen.actualizar();
  }
}

// ── Inicialización de la aplicación ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // 1. Inicializar módulos (en este orden)
  Pedidos.init();
  Historial.init();
  Exportar.init();

  // 2. Actualizar el resumen al cargar
  Resumen.actualizar();

  // 3. Bindear links del navbar → navegación entre secciones
  document.querySelectorAll('.nav-pill[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const seccion = link.dataset.section;
      navegarA(seccion);

      // Cerrar el menú mobile si está abierto
      const navbarCollapse = document.getElementById('navbarMenu');
      if (navbarCollapse.classList.contains('show')) {
        const toggler = document.querySelector('.navbar-toggler');
        toggler.click();
      }
    });
  });

  // 4. Sección inicial: pedidos
  navegarA('pedidos');

  console.log('%cPedidoRápido cargado ✓', 'color: #63b3ed; font-weight: bold; font-size: 14px;');
});
