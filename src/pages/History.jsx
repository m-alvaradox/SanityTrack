import PageIntro from '../components/PageIntro'
import EmptyState from '../components/EmptyState'
import MiniChart from '../components/MiniChart'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/sanityContext'
import { formatDateTime } from '../utils/format'

export default function History() {
  const { history, alerts, bathrooms } = useApp()
  return <><PageIntro eyebrow="Registros almacenados" title="Historial" description="Evolución de las lecturas recibidas durante cada ciclo de atención." />{history.length ? <section className="history-grid"><article className="panel chart-panel"><span className="eyebrow">FC-51</span><h3>Conteo acumulado por lectura</h3><p>Se reinicia cuando el conserje registra una atención</p><MiniChart data={history} dataKey="people" color="#2d7a78" /></article><article className="panel chart-panel"><span className="eyebrow">MQ-135 · interpretación no estandarizada</span><h3>Condiciones del aire</h3><p>Lectura raw del sensor</p><MiniChart data={history} dataKey="air" color="#d18b36" /></article></section> : <div className="panel"><EmptyState text="Firestore todavía no contiene lecturas históricas." /></div>}<article className="panel"><div className="panel-heading"><div><span className="eyebrow">Registro</span><h3>Historial de alertas</h3></div></div>{alerts.length ? <div className="history-list">{alerts.map((alert) => <div key={alert.id}><span className="history-dot" /><div><strong>{alert.message}</strong><small>{bathrooms.find((b) => b.id === alert.bathroomId)?.name} · {formatDateTime(alert.createdAt)}</small></div><StatusBadge tone={alert.status === 'attended' ? 'success' : 'warning'}>{alert.status === 'attended' ? 'Atendida' : 'Pendiente'}</StatusBadge></div>)}</div> : <EmptyState text="No hay alertas derivadas de lecturas reales." />}</article></>
}
