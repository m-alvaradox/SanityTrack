import { Droplets, FileText, Radio, Users, Wind } from 'lucide-react'
import PageIntro from '../components/PageIntro'
import StatusBadge from '../components/StatusBadge'
import { getAirQuality } from '../config/airQuality'
import { useApp } from '../context/sanityContext'
import { formatDateTime } from '../utils/format'

export default function Monitoring() {
  const { selectedBathroom: b, loading } = useApp(); if (loading || !b) return <div className="loading">Cargando sensores…</div>
  const air = getAirQuality(b.air_raw)
  const sensors = [
    { icon: Droplets, name: 'Jabón', sensor: 'TCRT5000', value: b.soap_ok ? 'Disponible' : 'No disponible', tone: b.soap_ok ? 'success' : 'danger', note: 'Detección de disponibilidad' },
    { icon: FileText, name: 'Papel higiénico', sensor: 'TCRT5000', value: b.paper_ok ? 'Disponible' : 'No disponible', tone: b.paper_ok ? 'success' : 'danger', note: 'Detección de disponibilidad' },
    { icon: Wind, name: 'Calidad del aire', sensor: 'MQ-135', value: `${b.air_raw} raw`, tone: air.tone, note: air.label },
    { icon: Users, name: 'Conteo de usuarios', sensor: 'FC-51', value: `${b.people} personas`, tone: b.high_traffic ? 'warning' : 'success', note: b.high_traffic ? 'Alta afluencia' : 'Flujo normal' }
  ]
  return <><PageIntro eyebrow="Datos en tiempo real" title="Monitoreo de sensores" description={`Lecturas detalladas · ${b.name}`}><StatusBadge tone="success"><Radio size={14} /> Recepción activa</StatusBadge></PageIntro><section className="sensor-grid">{sensors.map(({ icon: Icon, ...item }) => <article className="sensor-card" key={item.name}><div className="sensor-icon"><Icon /></div><div className="sensor-main"><span className="sensor-name">{item.name}</span><h3>{item.value}</h3><StatusBadge tone={item.tone}>{item.note}</StatusBadge></div><div className="sensor-meta"><span>Sensor</span><strong>{item.sensor}</strong><span>Última lectura</span><strong>{formatDateTime(b.lastUpdate)}</strong></div></article>)}</section><p className="calibration-note">La lectura MQ-135 se presenta como valor raw. Su interpretación usa umbrales provisionales que deberán calibrarse con el sensor físico.</p></>
}
