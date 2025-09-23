# Calendar Backend API

Un sistema de calendario backend en Go que permite crear eventos y enviar notificaciones automáticas por email y WhatsApp.

## Características

- ✅ **API REST** para gestionar eventos del calendario
- ✅ **Base de datos SQLite** para almacenar eventos
- ✅ **Notificaciones por email** usando SendGrid
- ✅ **Notificaciones por WhatsApp** usando Twilio
- ✅ **Scheduler automático** para recordatorios
- ✅ **Recordatorios configurables**: un día antes y el mismo día

## Estructura del Proyecto

```
backend-go/
├── config/          # Configuración y variables de entorno
├── database/        # Conexión y migración de base de datos
├── handlers/        # Manejadores HTTP para la API
├── models/          # Modelos de datos
├── routes/          # Definición de rutas de la API
├── services/        # Servicios de negocio (notificaciones, scheduler)
├── main.go          # Punto de entrada de la aplicación
├── go.mod           # Dependencias de Go
└── README.md        # Este archivo
```

## Requisitos

- Go 1.21 o superior
- Cuenta de SendGrid (para emails)
- Cuenta de Twilio (para WhatsApp)

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd backend-go
   ```

2. **Instalar dependencias**
   ```bash
   go mod tidy
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   # Editar .env con tus credenciales
   ```

4. **Ejecutar la aplicación**
   ```bash
   go run main.go
   ```

## Configuración

### Variables de Entorno

Crea un archivo `.env` basado en `env.example`:

```bash
# Servidor
PORT=8080

# Base de datos
DATABASE_URL=calendar.db

# SendGrid (para emails)
SENDGRID_API_KEY=tu_api_key_de_sendgrid
FROM_EMAIL=noreply@tudominio.com

# Twilio (para WhatsApp)
TWILIO_ACCOUNT_SID=tu_account_sid_de_twilio
TWILIO_AUTH_TOKEN=tu_auth_token_de_twilio
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
```

### Configurar SendGrid

1. Crea una cuenta en [SendGrid](https://sendgrid.com/)
2. Genera una API Key
3. Verifica tu dominio de email remitente

### Configurar Twilio

1. Crea una cuenta en [Twilio](https://www.twilio.com/)
2. Obtén tu Account SID y Auth Token
3. Configura WhatsApp Business API

## API Endpoints

### Eventos

- `POST /api/v1/events` - Crear un nuevo evento
- `GET /api/v1/events` - Obtener todos los eventos
- `GET /api/v1/events/:id` - Obtener un evento específico
- `PUT /api/v1/events/:id` - Actualizar un evento
- `DELETE /api/v1/events/:id` - Eliminar un evento

### Otros

- `GET /health` - Estado de salud de la API
- `GET /` - Información de la API

## Ejemplo de Uso

### Crear un Evento

```bash
curl -X POST http://localhost:8080/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reunión de trabajo",
    "description": "Reunión semanal del equipo",
    "date": "2024-01-15",
    "time": "14:00",
    "location": "Oficina principal",
    "email": "usuario@ejemplo.com",
    "phone": "+1234567890",
    "reminder_day": true,
    "reminder_day_before": true
  }'
```

### Obtener Eventos

```bash
# Todos los eventos
curl http://localhost:8080/api/v1/events

# Eventos de una fecha específica
curl "http://localhost:8080/api/v1/events?date=2024-01-15"

# Eventos en un rango de fechas
curl "http://localhost:8080/api/v1/events?start_date=2024-01-01&end_date=2024-01-31"
```

## Sistema de Notificaciones

### Recordatorios Automáticos

- **Un día antes**: Se envían a las 9:00 AM UTC
- **El mismo día**: Se envían 1 hora antes del evento

### Tipos de Notificación

1. **Email**: Usando SendGrid
2. **WhatsApp**: Usando Twilio WhatsApp Business API

## Base de Datos

La aplicación usa SQLite por defecto, pero puede ser fácilmente modificada para usar PostgreSQL, MySQL u otras bases de datos.

### Esquema de la Tabla Events

```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    time TEXT,
    location TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    reminder_day BOOLEAN DEFAULT true,
    reminder_day_before BOOLEAN DEFAULT true,
    created_at DATETIME,
    updated_at DATETIME,
    deleted_at DATETIME
);
```

## Desarrollo

### Ejecutar en modo desarrollo

```bash
go run main.go
```

### Ejecutar tests

```bash
go test ./...
```

### Construir para producción

```bash
go build -o calendar-backend main.go
```

## Logs

La aplicación registra:
- Conexión a la base de datos
- Inicio del scheduler
- Envío de notificaciones
- Errores de la API

## Monitoreo

- Endpoint `/health` para verificar el estado de la API
- Logs detallados para debugging
- Métricas de notificaciones enviadas

## Seguridad

- Validación de entrada en todos los endpoints
- Sanitización de datos
- Manejo seguro de errores

## Escalabilidad

- Arquitectura modular para fácil extensión
- Servicios separados para diferentes funcionalidades
- Base de datos configurable

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Soporte

Para soporte, abre un issue en el repositorio o contacta al equipo de desarrollo.
