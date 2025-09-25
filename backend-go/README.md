# 📅 Calendar Frontend

Una aplicación de calendario moderna construida con React, Vite y Tailwind CSS.

## 🚀 Características

- **Calendario interactivo** con vista mensual, semanal y diaria
- **Gestión de eventos** - Crear, editar, eliminar eventos
- **Búsqueda y filtros** - Buscar eventos por título o descripción
- **Diseño responsivo** - Funciona en desktop y móvil
- **Interfaz moderna** - Diseño limpio con Tailwind CSS
- **Estado global** - Manejo de estado con React Context

## 🛠️ Tecnologías

- **React 18** - Framework de UI
- **Vite** - Herramienta de build rápida
- **Tailwind CSS** - Framework de CSS
- **React Big Calendar** - Componente de calendario
- **Date-fns** - Librería de manejo de fechas
- **Axios** - Cliente HTTP

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd calendar-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tu configuración
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

## 🔧 Configuración

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Configuration
VITE_API_URL=http://localhost:8080

# Development
VITE_APP_NAME=Calendar App
VITE_APP_VERSION=1.0.0
```

### Conectar con el backend

Asegúrate de que tu backend esté ejecutándose en la URL configurada en `VITE_API_URL`.

## 📱 Uso

### Navegación

- **Calendario**: Vista principal con todos los eventos
- **Crear evento**: Click en "Nuevo Evento" o en un slot del calendario
- **Editar evento**: Doble click en un evento existente
- **Ver detalles**: Click en un evento para ver detalles

### Funcionalidades

1. **Crear evento**
   - Título (requerido)
   - Descripción
   - Fecha y hora (requerido)
   - Hora de fin (opcional)
   - Ubicación
   - Categoría
   - Prioridad

2. **Editar evento**
   - Doble click en el evento
   - Modificar campos necesarios
   - Guardar cambios

3. **Eliminar evento**
   - Click en el evento
   - Botón "Eliminar" en los detalles

## 🎨 Personalización

### Colores

Los colores se pueden personalizar en `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        // ... más colores
      }
    }
  }
}
```

### Componentes

Los componentes están organizados en:

```
src/components/
├── Calendar/          # Componentes del calendario
├── EventForm/         # Formularios de eventos
├── EventList/         # Lista de eventos
├── Layout/            # Layout principal
└── UI/                # Componentes reutilizables
```

## 🚀 Deploy

### Build para producción

```bash
npm run build
```

### Deploy a Vercel

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Deploy a Netlify

1. Conectar repositorio a Netlify
2. Configurar build command: `npm run build`
3. Configurar publish directory: `dist`

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Tests con coverage
npm run test:coverage
```

## 📝 Scripts disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter
- `npm run test` - Tests

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

¡Disfruta usando tu aplicación de calendario! 🎉