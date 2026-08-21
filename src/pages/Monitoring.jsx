import { Activity, Battery, DoorOpen, Droplets, FileText, Radio, RotateCcw, Server, UserRoundCheck, Users, Wind } from 'lucide-react'
import PageIntro from '../components/PageIntro'
import StatusBadge from '../components/StatusBadge'
import { getAirQuality } from '../config/airQuality'
import { MQTT_CONFIG } from '../config/mqtt'
import { useApp } from '../context/sanityContext'
import { formatDateTime } from '../utils/format'

export default function Monitoring() {
  const { selectedBathroom: b, loading, connectionStatus, mqttError, mqttLastMessageAt } = useApp(); if (loading || !b) return <div className="loading">Cargando sensores…</div>
  const air = getAirQuality(b.air_raw)
  const sensors = [
    { icon: Droplets, name: 'Jabón', sensor: 'TCRT5000', value: b.soap_ok ? 'Disponible' : 'No disponible', tone: b.soap_ok ? 'success' : 'danger', note: 'Detección de disponibilidad' },
    { icon: FileText, name: 'Papel higiénico', sensor: 'TCRT5000', value: b.paper_ok ? 'Disponible' : 'No disponible', tone: b.paper_ok ? 'success' : 'danger', note: 'Detección de disponibilidad' },
    { icon: Wind, name: 'Condición del aire', sensor: 'MQ-135', value: `${b.air_raw} raw`, tone: air.tone, note: `${air.label} (provisional)` },
    { icon: Users, name: 'Usos desde última atención', sensor: 'FC-51', value: `${b.people} estimados`, tone: b.high_traffic ? 'warning' : 'success', note: b.high_traffic ? 'Alta afluencia' : 'Conteo acumulado' }
  ]
  const state = { connected: ['Conectado', 'success'], connecting: ['Conectando', 'warning'], offline: ['Sin conexión', 'danger'], error: ['Error', 'danger'], mock: ['Modo simulado', 'neutral'] }[connectionStatus]
  const deviceMetrics = [
    { icon: DoorOpen, label: 'Señales del sensor', value: b.door_signals_total ?? '—', detail: `${b.door_signals_window ?? '—'} señales en la ventana actual` },
    { icon: UserRoundCheck, label: 'Entradas/salidas estimadas', value: b.people_estimated_total ?? b.people, detail: `${b.people_estimated_window ?? '—'} en la ventana actual` },
    { icon: Battery, label: 'Batería', value: b.battery_v == null ? '—' : `${b.battery_v.toFixed(2)} V`, detail: 'Lectura reportada por el dispositivo' },
    { icon: RotateCcw, label: 'Inicio del ciclo actual', value: b.last_janitor_reset || 'No reportado', detail: b.person_inside_pending ? 'Detección pendiente de confirmar' : 'Reinicio por atención del conserje' }
  ]
  return <><PageIntro eyebrow="Datos en tiempo real" title="Monitoreo de sensores" description={`Lecturas detalladas · ${b.name}`}><StatusBadge tone={state[1]}><Radio size={14} /> {state[0]}</StatusBadge></PageIntro><article className="mqtt-panel"><div className="mqtt-title"><span><Activity /></span><div><span className="eyebrow">Canal de pruebas</span><h3>Diagnóstico MQTT</h3></div><StatusBadge tone={state[1]}>{state[0]}</StatusBadge></div><div className="mqtt-details"><div><Server /><span>Broker</span><strong>{MQTT_CONFIG.brokerUrl}</strong></div><div><Radio /><span>Topic suscrito</span><strong>{MQTT_CONFIG.topic}</strong></div><div><Activity /><span>Último mensaje MQTT</span><strong>{mqttLastMessageAt ? formatDateTime(mqttLastMessageAt) : 'Esperando primera publicación'}</strong></div></div>{mqttError && <p className="mqtt-error">Último error: {mqttError}</p>}</article><section className="sensor-grid">{sensors.map(({ icon: Icon, ...item }) => <article className="sensor-card" key={item.name}><div className="sensor-icon"><Icon /></div><div className="sensor-main"><span className="sensor-name">{item.name}</span><h3>{item.value}</h3><StatusBadge tone={item.tone}>{item.note}</StatusBadge></div><div className="sensor-meta"><span>Sensor</span><strong>{item.sensor}</strong><span>Última lectura</span><strong>{formatDateTime(b.lastUpdate)}</strong></div></article>)}</section><article className="panel device-panel"><div className="panel-heading"><div><span className="eyebrow">Telemetría ampliada</span><h3>Dispositivo y conteo</h3></div></div><div className="device-metrics">{deviceMetrics.map(({ icon: Icon, label, value, detail }) => <div key={label}><Icon /><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>)}</div></article><p className="calibration-note">La lectura MQ-135 se presenta como valor raw. Su interpretación usa umbrales provisionales que deberán calibrarse con el sensor físico.</p></>
}
