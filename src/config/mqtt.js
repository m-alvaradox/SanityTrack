export const MQTT_CONFIG = {
  enabled: import.meta.env.VITE_MQTT_ENABLED === 'true',
  brokerUrl: import.meta.env.VITE_MQTT_BROKER_URL || 'wss://mqtt-dashboard.com:8884/mqtt',
  topic: import.meta.env.VITE_MQTT_TOPIC || 'espol/sanitytrack/bathroom1/data',
  bathroomId: 'bathroom1'
}
