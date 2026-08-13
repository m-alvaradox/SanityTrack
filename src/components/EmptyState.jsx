import { CheckCircle2 } from 'lucide-react'
export default function EmptyState({ text = 'No hay información para mostrar.' }) { return <div className="empty"><CheckCircle2 /><p>{text}</p></div> }
