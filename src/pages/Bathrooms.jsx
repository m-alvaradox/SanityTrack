import { ArrowRight, Building2, MapPin, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/sanityContext'
import { formatDateTime } from '../utils/format'

export default function Bathrooms() {
  const { bathrooms, alerts, selectedId, setSelectedId } = useApp(); const navigate = useNavigate()
  const select = (id) => { setSelectedId(id); navigate('/') }
  return <><PageIntro eyebrow="Espacios conectados" title="Baños" description="Selecciona un espacio para consultar sus sensores y alertas." /><section className="bathroom-grid">{bathrooms.map((bathroom) => { const active = alerts.filter((a) => a.bathroomId === bathroom.id && a.status === 'pending').length; const healthy = active === 0; return <article className={`bathroom-card ${selectedId === bathroom.id ? 'selected' : ''}`} key={bathroom.id}><div className="bathroom-visual"><Building2 /><StatusBadge tone={healthy ? 'success' : 'warning'}>{healthy ? 'Operativo' : 'Requiere atención'}</StatusBadge></div><span className="bathroom-id">{bathroom.id}</span><h3>{bathroom.name}</h3><p><MapPin size={15} />{bathroom.location}</p><div className="bathroom-stats"><div><Users /><strong>{bathroom.people}</strong><span>Usuarios</span></div><div><span className="alert-number">{active}</span><strong>{active}</strong><span>Alertas activas</span></div></div><small>Actualizado: {formatDateTime(bathroom.lastUpdate)}</small><button className="select-button" onClick={() => select(bathroom.id)}>Visualizar baño <ArrowRight size={17} /></button></article> })}</section></>
}
