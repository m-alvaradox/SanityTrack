# Sanity Track

Sanity Track es un prototipo universitario de un sistema inteligente para monitorear y gestionar baños públicos. La aplicación presenta el estado de jabón, papel higiénico, condiciones del aire, conteo de usuarios y alertas operativas.

## Arquitectura

La solución prevista separa la adquisición IoT de la interfaz:

```text
Sensores → ESP32 → WiFi → MQTT → HiveMQ → subscriber/backend → Firebase → aplicación web
```

En esta etapa, la aplicación usa datos simulados detrás de `dataService`. Las páginas nunca dependen directamente del archivo mock, lo que permite reemplazar ese servicio por Firebase sin reescribir la interfaz.

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
```

No se incluyen credenciales ni claves ficticias. `src/services/firebase.js` centraliza la configuración, pero el SDK y la lectura real todavía no están habilitados. Sin variables, toda la aplicación continúa funcionando con datos simulados.

## Integración MQTT prevista

El navegador no se conectará directamente al broker ni almacenará credenciales MQTT. Un servicio subscriber/backend recibirá los mensajes de HiveMQ, los validará y persistirá en Firebase. Topic previsto:

```text
espol/sanitytrack/bathroom1/data
```

Formato esperado del ESP32:

```json
{
  "people": 5,
  "soap_ok": true,
  "paper_ok": false,
  "air_raw": 2459,
  "high_traffic": false
}
```

`air_raw` es una lectura cruda, no un valor en ppm. Los límites en `src/config/airQuality.js` son provisionales y deben calibrarse con el MQ-135 físico.

## Estado actual

Están implementadas las cinco pantallas, navegación responsive, selección entre baños, alertas derivadas sin duplicados, gestión local de alertas, historial simulado y preparación de servicios. Permanecen pendientes el subscriber MQTT, la persistencia en Firebase y la sustitución del proveedor mock cuando la infraestructura esté disponible.
