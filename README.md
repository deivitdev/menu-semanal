# Menu Semanal

Aplicación web para planificar menús semanales y gestionar listas de compras, construida con SvelteKit y desplegada en Cloudflare Pages con persistencia de datos en Cloudflare D1.

## 🚀 Funcionalidades

### 📅 Planificación de Menús Semanales
- **Menú de 7 días**: Organiza desayuno, almuerzo y cena para cada día de la semana
- **Persistencia en la nube**: Los datos se guardan automáticamente en Cloudflare D1
- **Importación de menús**: Carga menús desde archivos JSON con formato predefinido
- **Visualización clara**: Interfaz intuitiva para ver el menú completo de la semana

### 🛒 Lista de Compras Inteligente
- **Categorización automática**: Los ingredientes se clasifican automáticamente en:
  - Frutas y Verduras
  - Proteínas
  - Lácteos y Huevos
  - Pan y Cereales
  - Despensa
  - Otros
- **Gestión de ingredientes**: Agrega, edita y elimina ingredientes fácilmente
- **Marcado de items**: Marca ingredientes como comprados mientras compras
- **Impresión optimizada**: Formato de impresión amigable para llevar al supermercado

### 📤 Importación de Datos
- **Carga de menús JSON**: Importa menús semanales completos desde archivos JSON
- **Extracción automática**: Extrae ingredientes automáticamente de las descripciones de las comidas
- **Validación de formatos**: Soporta múltiples formatos JSON para flexibilidad
- **Guardado automático**: Los datos importados se guardan persistentemente

### 💾 Persistencia de Datos
- **Base de datos Cloudflare D1**: Almacenamiento SQL en la nube
- **Datos persistentes**: La información sobrevive a reinicios y despliegues
- **Sincronización automática**: Los cambios se guardan instantáneamente

## 🛠️ Stack Tecnológico

- **Frontend**: SvelteKit con TypeScript
- **Estilos**: TailwindCSS
- **Base de datos**: Cloudflare D1 (SQLite)
- **Despliegue**: Cloudflare Pages
- **Package Manager**: pnpm

## 📁 Estructura del Proyecto

```text
/
├── src/
│   ├── lib/
│   │   ├── components/          # Componentes UI reutilizables
│   │   ├── composables/         # Lógica reutilizable (hooks)
│   │   ├── types/              # Definiciones TypeScript
│   │   └── utils/              # Utilidades varias
│   ├── routes/
│   │   ├── api/               # Endpoints API
│   │   │   ├── weekly-menu/   # Gestión de menús semanales
│   │   │   └── shopping-list/ # Gestión de lista de compras
│   │   ├── json-loader/       # Página de importación JSON
│   │   ├── shopping-list/     # Vista de lista de compras
│   │   └── +page.svelte       # Página principal (menú)
│   └── app.html               # Plantilla principal
├── static/                     # Assets estáticos
├── schema.sql                  # Esquema de base de datos D1
├── wrangler.toml              # Configuración Cloudflare
└── package.json               # Dependencias del proyecto
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+
- pnpm
- Cuenta de Cloudflare (para despliegue)

### Instalación Local
```bash
# Clonar el repositorio
git clone https://github.com/deivitdev/menu-semanal.git
cd menu-semanal

# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev
```

### Configuración de Base de Datos
```bash
# Crear base de datos D1
pnpm wrangler d1 create menu-semanal-db

# Aplicar esquema
pnpm wrangler d1 execute menu-semanal-db --file=schema.sql --local
pnpm wrangler d1 execute menu-semanal-db --file=schema.sql --remote
```

### Despliegue
```bash
# Construir para producción
pnpm build

# Desplegar a Cloudflare Pages
pnpm deploy
```

## 📖 Formato JSON para Importación

### Formato de Menú Semanal
```json
[
  {
    "day": "Lunes",
    "breakfast": "Yogur con avena",
    "breakfastDesc": "Yogur natural con avena y frutas",
    "lunch": "Lentejas guisadas",
    "lunchDesc": "Lentejas con arroz integral",
    "dinner": "Ensalada completa",
    "dinnerDesc": "Ensalada mixta con huevo"
  }
]
```

### Formato de Lista de Ingredientes
```json
[
  {
    "name": "Tomates",
    "quantity": "500",
    "unit": "g",
    "observations": "Bien maduros"
  }
]
```

## 🌐 Despliegue

La aplicación está desplegada en: **https://menu-semanal.pages.dev**

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.
