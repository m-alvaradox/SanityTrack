import StatusBadge from './StatusBadge'

export default function StatusCard({ icon: Icon, label, value, detail, tone, accent }) {
  return <article className={`status-card accent-${accent}`}><div className="card-top"><span className="card-icon"><Icon size={22} /></span><StatusBadge tone={tone}>{detail}</StatusBadge></div><p>{label}</p><strong>{value}</strong></article>
}
