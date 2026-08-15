import mqtt from 'mqtt'
import { MQTT_CONFIG } from '../config/mqtt'

const EXPECTED_FIELDS = ['people', 'soap_ok', 'paper_ok', 'air_raw', 'high_traffic']

export function parseSensorMessage(payload) {
  let data
  try { data = JSON.parse(payload.toString()) } catch { throw new Error('El mensaje MQTT no contiene JSON válido') }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('El mensaje MQTT debe ser un objeto JSON')
  const missing = EXPECTED_FIELDS.filter((field) => !(field in data))
  if (missing.length) throw new Error(`Faltan campos: ${missing.join(', ')}`)
  if (!Number.isInteger(data.people) || data.people < 0) throw new Error('people debe ser un entero no negativo')
  if (typeof data.air_raw !== 'number' || !Number.isFinite(data.air_raw) || data.air_raw < 0) throw new Error('air_raw debe ser un número no negativo')
  for (const field of ['soap_ok', 'paper_ok', 'high_traffic']) {
    if (typeof data[field] !== 'boolean') throw new Error(`${field} debe ser booleano`)
  }
  return { people: data.people, soap_ok: data.soap_ok, paper_ok: data.paper_ok, air_raw: data.air_raw, high_traffic: data.high_traffic, lastUpdate: new Date().toISOString() }
}

export function subscribeToBathroom({ onData, onStatus, onError }) {
  if (!MQTT_CONFIG.enabled) { onStatus('mock'); return () => {} }
  onStatus('connecting')
  const client = mqtt.connect(MQTT_CONFIG.brokerUrl, { clientId: `sanitytrack-web-${crypto.randomUUID()}`, clean: true, connectTimeout: 10_000, reconnectPeriod: 5_000 })
  client.on('connect', () => client.subscribe(MQTT_CONFIG.topic, { qos: 0 }, (error) => { if (error) { onStatus('error'); onError(error) } else onStatus('connected') }))
  client.on('reconnect', () => onStatus('connecting'))
  client.on('offline', () => onStatus('offline'))
  client.on('error', (error) => { onStatus('error'); onError(error) })
  client.on('message', (topic, payload) => {
    if (topic !== MQTT_CONFIG.topic) return
    try { onData(MQTT_CONFIG.bathroomId, parseSensorMessage(payload)) } catch (error) { onError(error) }
  })
  return () => client.end(true)
}
