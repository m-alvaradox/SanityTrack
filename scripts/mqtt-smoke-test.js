/* global process */
import mqtt from 'mqtt'

const brokerUrl = process.env.MQTT_BROKER_URL || 'wss://mqtt-dashboard.com:8884/mqtt'
const topic = process.env.MQTT_TOPIC || 'espol/sanitytrack/bathroom1/data'
const timeoutMs = 15_000
const testId = crypto.randomUUID()
const payload = JSON.stringify({
  door_signals_window: 2,
  people_estimated_window: 1,
  door_signals_total: 38,
  people_estimated_total: 19,
  person_inside_pending: false,
  last_janitor_reset: '2026-08-20 18:49:40',
  soap_ok: true,
  paper_ok: true,
  air_raw: 1750,
  battery_v: 4.58,
  high_traffic: false,
  test_id: testId
})

const client = mqtt.connect(brokerUrl, {
  clientId: `sanitytrack-smoke-${testId}`,
  clean: true,
  connectTimeout: 10_000,
  reconnectPeriod: 0
})

const timer = setTimeout(() => finish(new Error('Tiempo agotado esperando el mensaje MQTT')), timeoutMs)

function finish(error) {
  clearTimeout(timer)
  client.end(true, {}, () => {
    if (error) {
      console.error(`MQTT ERROR: ${error.message}`)
      process.exitCode = 1
    } else {
      console.log(`MQTT OK: mensaje recibido en ${topic}`)
    }
  })
}

client.on('connect', () => {
  console.log(`Conectado a ${brokerUrl}`)
  client.subscribe(topic, { qos: 0 }, (subscribeError) => {
    if (subscribeError) return finish(subscribeError)
    console.log(`Suscrito a ${topic}`)
    client.publish(topic, payload, { qos: 0, retain: false }, (publishError) => {
      if (publishError) finish(publishError)
    })
  })
})

client.on('message', (receivedTopic, receivedPayload) => {
  if (receivedTopic !== topic) return
  try {
    const message = JSON.parse(receivedPayload.toString())
    if (message.test_id === testId) finish()
  } catch {
    // Otros clientes pueden publicar mensajes no JSON en un broker público.
  }
})

client.on('error', finish)
