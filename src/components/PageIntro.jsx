export default function PageIntro({ eyebrow, title, description, children }) {
  return <div className="page-intro"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>{children}</div>
}
