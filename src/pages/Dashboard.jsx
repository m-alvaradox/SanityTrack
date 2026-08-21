import { AlertTriangle, Check, Droplets, FileText, Users, Wind } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import PageIntro from '../components/PageIntro'
import StatusBadge from '../components/StatusBadge'
import StatusCard from '../components/StatusCard'
import { getAirQuality } from '../config/airQuality'
import { useApp } from '../context/sanityContext'
import { formatDateTime } from '../utils/format'

export default function Dashboard() {
  const { selectedBathroom: bathroom, alerts, loading, markAttended } = useApp()
  if (loading) return <div className="loading">Consultando Firestore…</div>
  if (!bathroom) return <><PageIntro eyebrow="Vista general" title="Sin lecturas registradas" description="El dashboard se habilitará cuando llegue el primer mensaje MQTT." /><EmptyState text="Firestore todavía no contiene datos de bathroom1." /></>
  const air = getAirQuality(bathroom.air_raw); const active = alerts.filter((item) => item.bathroomId === bathroom.id && item.status === 'pending')
  return <><PageIntro eyebrow="Turno de limpieza" title="Qué necesita atención" description={`${bathroom.name} · ${bathroom.location}`}><StatusBadge tone="success">Sensores conectados</StatusBadge></PageIntro>
    <section className="action-banner"><div className="action-banner-icon"><Check /></div><div><strong>{active.length ? `${active.length} tarea${active.length === 1 ? '' : 's'} pendiente${active.length === 1 ? '' : 's'}` : 'Todo listo por ahora'}</strong><span>{active.length ? 'Atiende las alertas y confirma cada reposición.' : 'Los insumos y el ambiente están dentro de los niveles esperados.'}</span></div></section>
    <section className="status-grid"><StatusCard icon={Droplets} label="Jabón" value={bathroom.soap_ok ? 'Disponible' : 'No disponible'} detail={bathroom.soap_ok ? 'Nivel adecuado' : 'Reponer'} tone={bathroom.soap_ok ? 'success' : 'danger'} accent="teal" /><StatusCard icon={FileText} label="Papel higiénico" value={bathroom.paper_ok ? 'Disponible' : 'Nivel bajo'} detail={bathroom.paper_ok ? 'Nivel adecuado' : 'Reponer'} tone={bathroom.paper_ok ? 'success' : 'danger'} accent="blue" /><StatusCard icon={Wind} label="Condición del aire" value={bathroom.air_raw.toLocaleString('es-EC')} detail={`${air.label} · provisional`} tone={air.tone} accent="amber" /><StatusCard icon={Users} label="Usos desde última atención" value={bathroom.people} detail={bathroom.high_traffic ? 'Alta afluencia' : 'Conteo acumulado'} tone={bathroom.high_traffic ? 'warning' : 'success'} accent="violet" /></section>
    <section className="dashboard-bottom"><article className="panel"><div className="panel-heading"><div><span className="eyebrow">Atención requerida</span><h3>Alertas activas</h3></div><span className="count-pill">{active.length}</span></div>{active.length ? <div className="alert-list">{active.map((alert) => <div className="alert-row" key={alert.id}><span className={`alert-symbol ${alert.severity}`}><AlertTriangle size={18} /></span><div><strong>{alert.message}</strong><small>{bathroom.name}</small></div><button className="confirm-button" onClick={() => markAttended(alert.id)}><Check size={15} />Listo</button></div>)}</div> : <EmptyState text="Todo está en orden. No hay alertas activas." />}</article>
    <article className="panel update-panel"><span className="eyebrow">Estado del sistema</span><h3>Última actualización</h3><div className="update-time"><strong>{new Intl.DateTimeFormat('es-EC', { timeStyle: 'short' }).format(new Date(bathroom.lastUpdate))}</strong><span>{formatDateTime(bathroom.lastUpdate)}</span></div><div className="signal-bars"><i /><i /><i /><i /></div><p>Lectura MQTT almacenada y sincronizada mediante Cloud Firestore.</p></article></section></>
}
