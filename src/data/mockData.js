const now = new Date().toISOString()

export const mockBathrooms = [
  { id: 'bathroom1', name: 'Baño FIEC - Planta Baja', location: 'Edificio FIEC · Planta baja', people: 5, soap_ok: true, paper_ok: false, air_raw: 2459, high_traffic: false, lastUpdate: now },
  { id: 'bathroom2', name: 'Baño FIEC - Primer Piso', location: 'Edificio FIEC · Primer piso', people: 12, soap_ok: true, paper_ok: true, air_raw: 1680, high_traffic: true, lastUpdate: now }
]

export const mockAlerts = [
  { id: 'alert-history-1', bathroomId: 'bathroom1', type: 'soap', message: 'Jabón no disponible', severity: 'high', status: 'attended', createdAt: new Date(Date.now() - 86400000).toISOString() }
]

export const hourlyHistory = [
  { hour: '08:00', people: 2, air: 1420 }, { hour: '10:00', people: 5, air: 1750 },
  { hour: '12:00', people: 9, air: 2210 }, { hour: '14:00', people: 7, air: 2459 },
  { hour: '16:00', people: 4, air: 1980 }, { hour: '18:00', people: 3, air: 1620 }
]
