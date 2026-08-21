export const BATHROOM_CATALOG = [
  {
    id: 'bathroom1',
    name: 'Baño FIEC - Planta Baja',
    location: 'Edificio FIEC · Planta baja'
  }
]

export const getBathroomMetadata = (id) => BATHROOM_CATALOG.find((bathroom) => bathroom.id === id) ?? {
  id,
  name: id,
  location: 'Ubicación no configurada'
}
