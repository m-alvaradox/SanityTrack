// Umbrales provisionales: deben calibrarse con el sensor MQ-135 instalado.
export const AIR_QUALITY_THRESHOLDS = { normalMax: 1800, moderateMax: 2600 }

export function getAirQuality(raw) {
  if (raw <= AIR_QUALITY_THRESHOLDS.normalMax) return { label: 'Normal', tone: 'success' }
  if (raw <= AIR_QUALITY_THRESHOLDS.moderateMax) return { label: 'Moderado', tone: 'warning' }
  return { label: 'Requiere atención', tone: 'danger' }
}
