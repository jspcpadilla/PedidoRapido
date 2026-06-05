# ⚡ PedidoRápido

> Aplicación web para gestionar pedidos del día en pequeños negocios locales.  
> 100% frontend — sin backend, sin base de datos, sin instalación.

---

## 🚀 Inicio rápido

1. Descarga o clona el proyecto.
2. Abre **`index.html`** en tu navegador.
3. ¡Listo! No se requiere servidor ni instalación.

```
PedidoRapido/
├── index.html          ← Punto de entrada
├── css/
│   └── styles.css      ← Estilos (paleta oscura + acento azul)
├── js/
│   ├── storage.js      ← Abstracción de LocalStorage
│   ├── pedidos.js      ← Registro, tabla, cambio de estado y eliminación
│   ├── historial.js    ← Búsqueda y agrupación por cliente
│   ├── resumen.js      ← Estadísticas del día
│   ├── exportar.js     ← Exportación a CSV
│   └── app.js          ← Inicialización y navegación
└── README.md
```

---

## ✨ Funcionalidades

| Función | Descripción |
|---|---|
| **Registrar pedidos** | Cliente, producto, cantidad, total y fecha automática |
| **Ver pedidos activos** | Tabla con todos los pedidos y su estado |
| **Cambiar estado** | Pendiente → En proceso → Entregado (desde la tabla) |
| **Eliminar pedido** | Botón con modal de confirmación |
| **Historial de clientes** | Búsqueda por nombre, agrupación y totales |
| **Resumen del día** | Cards con estadísticas: pedidos, dinero, pendientes, entregados |
| **Exportar CSV** | Descarga automática compatible con Excel |

---

## 🛠 Tecnologías

- **HTML5** — Estructura semántica
- **CSS3** — Variables, animaciones, responsive design
- **JavaScript ES6+** — Módulos IIFE, eventos, LocalStorage
- **Bootstrap 5.3** — Grid, modales, toasts
- **Bootstrap Icons** — Iconografía
- **Google Fonts** — Syne + DM Sans

---

## 💾 Almacenamiento

Los datos se guardan automáticamente en **`localStorage`** del navegador bajo la clave `pedidorapido_pedidos`.

> ⚠️ Los datos son locales al navegador. Si abres la app en otro navegador o dispositivo, los datos no se comparten.

---

## 📁 Exportar a CSV

El botón **"Exportar CSV"** en la barra superior descarga un archivo `.csv` con todos los pedidos. El archivo incluye BOM UTF-8 para que Excel (en español) reconozca tildes y ñ correctamente.

**Columnas del CSV:**
```
ID, Cliente, Producto, Cantidad, Total, Estado, Fecha
```

---

## 📱 Responsive

La aplicación es completamente responsive:
- **Desktop** — Tabla completa con todas las columnas
- **Tablet** — Layout ajustado con Bootstrap Grid
- **Móvil** — Columnas secundarias ocultas, cards apiladas

---

## 🎨 Diseño

Paleta oscura profesional con acento azul:

| Variable | Valor | Uso |
|---|---|---|
| `--bg-base` | `#0d0f14` | Fondo principal |
| `--bg-card` | `#161923` | Tarjetas y modales |
| `--accent` | `#63b3ed` | Acento principal (azul) |
| `--accent-green` | `#68d391` | Precios y entregados |
| `--accent-orange` | `#f6ad55` | Pedidos pendientes |

---

## 📄 Licencia

Proyecto libre para uso personal y comercial.

---

*Hecho con ⚡ para negocios que se mueven rápido.*
