import { AlertTriangle, Check, Clock } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import PageIntro from '../components/PageIntro'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/sanityContext'
import { formatDate, formatTime } from '../utils/format'

const severityLabel = { critical: 'Crítica', high: 'Alta', medium: 'Media' }
export default function Alerts() {
  const { alerts, bathrooms, markAttended } = useApp()
  return <><PageIntro eyebrow="Centro de incidencias" title="Alertas" description="Revisa y gestiona las condiciones que requieren atención." /><div className="panel alert-panel"><div className="alert-toolbar"><span><strong>{alerts.filter((a) => a.status === 'pending').length}</strong> pendientes</span><span><strong>{alerts.filter((a) => a.status === 'attended').length}</strong> atendidas</span></div>{alerts.length ? <div className="alerts-table">{alerts.map((alert) => { const bathroom = bathrooms.find((b) => b.id === alert.bathroomId); return <article className={`alert-item ${alert.status}`} key={alert.id}><span className={`alert-symbol ${alert.severity}`}>{alert.status === 'attended' ? <Check /> : <AlertTriangle />}</span><div className="alert-copy"><div><span className="alert-id">#{alert.id}</span><StatusBadge tone={alert.status === 'pending' ? 'warning' : 'success'}>{alert.status === 'pending' ? 'Pendiente' : 'Atendida'}</StatusBadge></div><h3>{alert.message}</h3><p>{bathroom?.name ?? alert.bathroomId}</p><small><Clock size={13} /> {formatDate(alert.createdAt)} · {formatTime(alert.createdAt)} · Severidad {severityLabel[alert.severity]}</small></div>{alert.status === 'pending' && <button className="primary-button" onClick={() => markAttended(alert.id)}><Check size={16} />Marcar como atendida</button>}</article> })}</div> : <EmptyState />}</div></>
}
