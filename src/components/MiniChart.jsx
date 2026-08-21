export default function MiniChart({ data, dataKey, color = '#2d7a78', suffix = '' }) {
  const values = data.map((item) => item[dataKey]); const max = Math.max(...values, 1); const min = Math.min(...values); const range = max - min || 1
  const x = (index) => data.length === 1 ? 50 : 5 + (index / (data.length - 1)) * 90
  const y = (value) => 38 - ((value - min) / range) * 27
  const points = values.map((value, index) => `${x(index)},${y(value)}`).join(' ')
  const middleIndex = Math.floor((data.length - 1) / 2)
  const labels = data.filter((_, index) => index === 0 || index === middleIndex || index === data.length - 1)
  return <div className="chart-wrap"><svg className="line-chart" viewBox="0 0 100 45" role="img" aria-label="Gráfico histórico"><line x1="5" y1="11" x2="95" y2="11" className="axis" /><line x1="5" y1="24.5" x2="95" y2="24.5" className="axis" /><line x1="5" y1="38" x2="95" y2="38" className="axis" /><polygon points={`5,38 ${points} 95,38`} fill={color} opacity=".1" /><polyline points={points} fill="none" stroke={color} strokeWidth="1.7" vectorEffect="non-scaling-stroke" />{values.map((value, index) => <circle key={data[index].hour} cx={x(index)} cy={y(value)} r="1.45" fill="white" stroke={color} strokeWidth="1.2" vectorEffect="non-scaling-stroke"><title>{data[index].hour}: {value}{suffix}</title></circle>)}</svg><div className="chart-labels">{labels.map((item) => <span key={item.hour}>{item.hour}</span>)}</div><div className="chart-range"><span>{max}{suffix}</span><span>{min}{suffix}</span></div></div>
}
