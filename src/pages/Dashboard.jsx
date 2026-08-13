import { AlertTriangle, Droplets, FileText, Users, Wind } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import PageIntro from '../components/PageIntro'
import StatusBadge from '../components/StatusBadge'
import StatusCard from '../components/StatusCard'
import { getAirQuality } from '../config/airQuality'
import { useApp } from '../context/sanityContext'
import { formatDateTime } from '../utils/format'

export default function Dashboard() {
  const { selectedBathroom: bathroom, alerts, loading } = useApp()
  if (loading || !bathroom) return <div className="loading">Cargando datos del sistema…</div>
  const air = getAirQuality(bathroom.air_raw); const active = alerts.filter((item) => item.bathroomId === bathroom.id && item.status === 'pending')
  return <><PageIntro eyebrow="Vista general" title={bathroom.name} description={bathroom.location}><StatusBadge tone="success">Sensores conectados</StatusBadge></PageIntro>
    <section className="status-grid"><StatusCard icon={Droplets} label="Jabón" value={bathroom.soap_ok ? 'Disponible' : 'No disponible'} detail={bathroom.soap_ok ? 'Nivel adecuado' : 'Reponer'} tone={bathroom.soap_ok ? 'success' : 'danger'} accent="teal" /><StatusCard icon={FileText} label="Papel higiénico" value={bathroom.paper_ok ? 'Disponible' : 'Nivel bajo'} detail={bathroom.paper_ok ? 'Nivel adecuado' : 'Reponer'} tone={bathroom.paper_ok ? 'success' : 'danger'} accent="blue" /><StatusCard icon={Wind} label="Calidad del aire" value={bathroom.air_raw.toLocaleString('es-EC')} detail={air.label} tone={air.tone} accent="amber" /><StatusCard icon={Users} label="Usuarios detectados" value={bathroom.people} detail={bathroom.high_traffic ? 'Alta afluencia' : 'Flujo normal'} tone={bathroom.high_traffic ? 'warning' : 'success'} accent="violet" /></section>
    <section className="dashboard-bottom"><article className="panel"><div className="panel-heading"><div><span className="eyebrow">Atención requerida</span><h3>Alertas activas</h3></div><span className="count-pill">{active.length}</span></div>{active.length ? <div className="alert-list">{active.map((alert) => <div className="alert-row" key={alert.id}><span className={`alert-symbol ${alert.severity}`}><AlertTriangle size={18} /></span><div><strong>{alert.message}</strong><small>{bathroom.name}</small></div><StatusBadge tone={alert.severity === 'critical' ? 'danger' : 'warning'}>Pendiente</StatusBadge></div>)}</div> : <EmptyState text="Todo está en orden. No hay alertas activas." />}</article>
    <article className="panel update-panel"><span className="eyebrow">Estado del sistema</span><h3>Última actualización</h3><div className="update-time"><strong>{new Intl.DateTimeFormat('es-EC', { timeStyle: 'short' }).format(new Date(bathroom.lastUpdate))}</strong><span>{formatDateTime(bathroom.lastUpdate)}</span></div><div className="signal-bars"><i /><i /><i /><i /></div><p>Los datos se reciben actualmente desde la fuente de demostración.</p></article></section></>
}
