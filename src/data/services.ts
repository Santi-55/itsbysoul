export type Service = {
  key: string
  title: string
  short: string
  priceRange: string
  details: string[]
}

export const services: Service[] = [
  {
    key: 'retratos',
    title: 'Retratos',
    short: 'Sesiones individuales o grupales en estudio o exterior.',
    priceRange: 'Desde $50.000 COP',
    details: [
      'Duración típica: 1–2 horas',
      'Entrega: 10–20 fotos editadas en alta resolución',
    ],
  },
  {
    key: 'eventos',
    title: 'Eventos',
    short: 'Cobertura para eventos sociales, culturales yempresariales.',
    priceRange: 'Desde $200.000 COP',
    details: [
      'Cobertura por horas',
      'Galería online para descarga',
      'Entrega en 48–72h según volumen',
    ],
  },
  {
    key: 'moda',
    title: 'Moda',
    short: 'Fotografía de moda con enfoque comercial y estético. Ideal para marcas emergentes, catálogos y contenido digital.',
    priceRange: 'Desde $200.000 COP',
    details: [
      'Preproducción: moodboard y scouting básico',
      'Dirección de arte y poses',
      'Opcional: equipo de iluminación y locación',
    ],
  },
  {
    key: 'producto',
    title: 'Productos y alimentos',
    short: 'Fotografía de producto y comida con enfoque visual y cuidado estético.',
    priceRange: 'Desde $150.000 COP',
    details: [
      'Control de luz y dirección creativa',
      'Fondos y estilismo adaptados a la identidad de marca',
      'Edición profesional lista para campañas y redes',
    ],
  },
  {
    key: 'reels',
    title: 'Reels',
    short: 'Piezas audiovisuales cortas para redes.',
    priceRange: 'Desde $200.000 COP',
    details: [
      'Guion técnico simple y rodaje ágil',
      'Edición con música y color',
      'Aspectos 9:16 y 1:1 listos para redes',
    ],
  },
]
