import PageIntro from '../components/PageIntro'
import MiniChart from '../components/MiniChart'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/sanityContext'
import { formatDateTime } from '../utils/format'

export default function History() {
  const { history, alerts, bathrooms } = useApp()
  return <><PageIntro eyebrow="Registros simulados" title="Historial" description="Evolución de las lecturas disponibles durante la jornada." /><section className="history-grid"><article className="panel chart-panel"><span className="eyebrow">FC-51</span><h3>Usuarios por hora</h3><p>Conteo de personas detectadas</p><MiniChart data={history} dataKey="people" color="#2d7a78" /></article><article className="panel chart-panel"><span className="eyebrow">MQ-135</span><h3>Condiciones del aire</h3><p>Lectura raw del sensor</p><MiniChart data={history} dataKey="air" color="#d18b36" /></article></section><article className="panel"><div className="panel-heading"><div><span className="eyebrow">Registro</span><h3>Historial de alertas</h3></div></div><div className="history-list">{alerts.map((alert) => <div key={alert.id}><span className="history-dot" /><div><strong>{alert.message}</strong><small>{bathrooms.find((b) => b.id === alert.bathroomId)?.name} · {formatDateTime(alert.createdAt)}</small></div><StatusBadge tone={alert.status === 'attended' ? 'success' : 'warning'}>{alert.status === 'attended' ? 'Atendida' : 'Pendiente'}</StatusBadge></div>)}</div></article></>
}
