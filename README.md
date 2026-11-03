# Backend de la invitación

Servicio independiente de la aplicación React. Recibe la confirmación del formulario, valida los datos en el servidor y envía una notificación privada mediante Telegram Bot API. No guarda información en una base de datos.

## Requisitos

- Node.js 20.19 o posterior.
- Un bot de Telegram y el ID del chat privado que recibirá las notificaciones.
- Las credenciales se configuran localmente en `backend/.env`; no se guardan en Git ni se incluyen en el frontend.

## Instalación y ejecución local

Desde la raíz del repositorio:

```powershell
Copy-Item backend/.env.example backend/.env
cd backend
npm install
npm run dev
```

Completa `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` en `backend/.env`. El servidor escucha en el puerto 3001 por defecto. `FRONTEND_ORIGIN` acepta uno o varios orígenes separados por comas; en desarrollo también se permiten `http://localhost:5173` y `http://127.0.0.1:5173`.

Para el cliente, crea `frontend/.env.local` desde `frontend/.env.example` y configura `VITE_API_URL=http://localhost:3001`; luego inicia Vite desde `frontend/` con `npm run dev`.

## Comandos

```sh
npm run dev       # servidor de desarrollo con recarga
npm run build     # compila TypeScript a dist/
npm start         # ejecuta el build
npm test          # pruebas automatizadas sin credenciales
npm run typecheck # comprobación TypeScript sin emitir archivos
```

## Rutas

- `GET /health`: comprobación de disponibilidad; no contacta Telegram.
- `POST /api/invitacion/confirmar`: valida un plan, envía el mensaje a Telegram y solo entonces devuelve éxito.

Consulta [docs/api.md](docs/api.md) para el contrato y las validaciones, [docs/architecture.md](docs/architecture.md) para el flujo interno, [docs/testing.md](docs/testing.md) para la guía de pruebas y [docs/development-log.md](docs/development-log.md) para el registro incremental de creación y verificaciones.

## Estado de Telegram

Las pruebas automatizadas no usan credenciales reales ni envían mensajes. Se verificó una entrega real desde el servicio con un mensaje claramente marcado como prueba. Aún queda pendiente revisar manualmente el flujo completo desde el navegador.

## Producción

Configura `NODE_ENV=production`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `PORT` y `FRONTEND_ORIGIN` en el entorno privado del servicio. `FRONTEND_ORIGIN` es obligatorio con `NODE_ENV=production`. Configura `VITE_API_URL` en el frontend con la URL pública del backend. Nunca pongas el token en variables `VITE_*`, en logs o en respuestas HTTP.
