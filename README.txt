ALERTA COMUNITARIA — SISTEMA LISTO PARA EJECUTAR (DEMOSTRACIÓN)

REQUISITOS
- Node.js 18 o superior: https://nodejs.org/
- Para usarlo en internet: un hosting que ejecute Node.js y mantenga el servidor activo.

EJECUTAR EN WINDOWS
1. Extraé este ZIP.
2. Instalá Node.js 18+.
3. Entrá a la carpeta alertas_comunitarias.
4. En la barra de dirección del Explorador escribí cmd y presioná Enter.
5. Ejecutá: node server.js
6. Abrí http://localhost:3000

API
GET  /api/health
GET  /api/alerts
POST /api/alerts
Content-Type: application/json

Ejemplo POST:
{"test":true,"location":"Estelí, Nicaragua","alert_type":"inundacion","message":"Alerta de prueba","rain_mm_h":95,"water_level_cm":88}

Tipos permitidos: normal, inundacion, deslave, inundacion_y_deslave.
Los datos se guardan en data/alerts.json.

PROTEGER POST (opcional)
Windows PowerShell:
$env:ALERT_API_KEY="cambia-esta-clave"; node server.js
Linux/macOS:
ALERT_API_KEY="cambia-esta-clave" node server.js
Si se activa, cada POST debe incluir el encabezado X-Alert-Key. No pongas una clave secreta en JavaScript público.

CONECTAR A STRIKINGLY GRATIS
1. Publicá este proyecto en un hosting compatible con Node.js.
2. Confirmá que el panel abre en una URL HTTPS pública.
3. En el editor de Strikingly, agregá un botón o enlace normal llamado “Consultar alertas” hacia esa URL. Así evitás necesitar inserción HTML.
4. El servidor debe permanecer en ejecución. localhost solo funciona en tu propia computadora.

IMPORTANTE
Es una demostración funcional para probar la recepción y el historial de señales ficticias. No detecta lluvia, nivel de río ni deslaves reales, no manda SMS/WhatsApp y no es un sistema oficial de protección civil. No usar para tomar decisiones de emergencia. Para producción se requiere sensor real validado, hosting fiable, base de datos gestionada, autenticación, límites de envío, monitorización, respaldo y coordinación con las autoridades.
