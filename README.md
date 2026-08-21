# Sanity Track

Sanity Track es un prototipo universitario de un sistema inteligente para monitorear y gestionar baños públicos. La aplicación presenta el estado de jabón, papel higiénico, condiciones del aire, conteo de usuarios y alertas operativas.

## Arquitectura

La solución prevista separa la adquisición IoT de la interfaz:

```text
Sensores → ESP32 → WiFi → MQTT → HiveMQ → subscriber/backend → Firebase → aplicación web
```

Cuando Firebase está configurado, la aplicación carga exclusivamente documentos reales de Firestore y muestra estados vacíos hasta recibir la primera lectura. `dataService` y los mocks solo se cargan dinámicamente como fallback de desarrollo cuando faltan las variables de Firebase.

Para las pruebas del prototipo también existe un modo MQTT WebSocket opcional. Al activarlo, la UI escucha el broker público y conserva los mocks como estado inicial y respaldo.

## Tecnologías

- React y Vite
- JavaScript
- React Router
- Lucide React
- CSS responsive sin framework visual
- SVG nativo para gráficas simples

## Estructura

```text
src/
├── components/   Componentes reutilizables y layout
├── config/       Umbrales provisionales del MQ-135
├── context/      Estado compartido, selección y alertas
├── data/         Datos simulados
├── pages/        Dashboard, Monitoreo, Alertas, Historial y Baños
├── services/     Abstracción de datos y preparación de Firebase
├── styles/       Estilos globales y responsive
└── utils/        Alertas derivadas y formato de fechas
```

## Instalación y ejecución

Requiere una versión reciente de Node.js.

```bash
npm install
npm run dev
```

Vite mostrará la URL local de desarrollo. Para validar y compilar la aplicación:

```bash
npm run lint
npm run build
```

La compilación queda en `dist/` y puede revisarse con `npm run preview`.

## Variables de entorno y Firebase

Copia `.env.example` como `.env` y completa, cuando estén disponibles, estas variables:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_MQTT_ENABLED=false
VITE_MQTT_BROKER_URL=wss://mqtt-dashboard.com:8884/mqtt
VITE_MQTT_TOPIC=espol/sanitytrack/bathroom1/data
```

No se incluyen credenciales ni claves ficticias. `src/services/firebase.js` centraliza la configuración, pero el SDK y la lectura real todavía no están habilitados. Sin variables, toda la aplicación continúa funcionando con datos simulados.

Para probar directamente el broker público, cambia `VITE_MQTT_ENABLED=true` en tu archivo `.env` y reinicia Vite. Este modo valida el JSON recibido antes de actualizar `bathroom1` y muestra el estado de conexión en el encabezado. Se considera exclusivamente una ayuda de desarrollo.

La conectividad del broker también puede comprobarse sin abrir la interfaz. El comando se suscribe, publica un mensaje de prueba no retenido y confirma su recepción:

```bash
npm run mqtt:test
```

## Integración MQTT prevista

El navegador no se conectará directamente al broker ni almacenará credenciales MQTT. Un servicio subscriber/backend recibirá los mensajes de HiveMQ, los validará y persistirá en Firebase. Topic previsto:

```text
espol/sanitytrack/bathroom1/data
```

Formato esperado del ESP32:

```json
{
  "door_signals_window": 2,
  "people_estimated_window": 1,
  "door_signals_total": 38,
  "people_estimated_total": 19,
  "person_inside_pending": false,
  "last_janitor_reset": "2026-08-20 18:49:40",
  "soap_ok": true,
  "paper_ok": false,
  "air_raw": 2459,
  "battery_v": 4.58,
  "high_traffic": false
}
```

`air_raw` es una lectura cruda, no un valor en ppm. Los límites en `src/config/airQuality.js` son provisionales y deben calibrarse con el MQ-135 físico.

La interfaz usa `people_estimated_total` como conteo acumulado desde la última atención del conserje; el valor se reinicia cuando cambia `last_janitor_reset`. `door_signals_window` indica las señales detectadas en la ventana actual y `people_estimated_window` estima las entradas/salidas derivadas de esas señales. El campo antiguo `people` continúa aceptándose para mantener compatibilidad con firmware anterior.

El voltaje `battery_v` se muestra directamente, sin inventar un porcentaje de batería. `air_raw` tampoco equivale por sí solo a ppm o AQI: los estados Normal, Moderado y Requiere atención usan umbrales operativos provisionales hasta calibrar el MQ-135 instalado frente a mediciones de referencia.

## Estado actual

Están implementadas las cinco pantallas, navegación responsive, selección entre baños y alertas derivadas. Firestore comparte el estado actual y conserva lecturas históricas cuando el modo MQTT del navegador recibe publicaciones; si Firebase no está disponible se usan los mocks. Para producción permanece pendiente trasladar la suscripción MQTT a un servicio backend permanente y cerrar las escrituras públicas de las reglas provisionales.
