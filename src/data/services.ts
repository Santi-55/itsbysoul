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
    priceRange: 'Desde $150.000 COP',
    details: [
      'Duración típica: 1–2 horas',
      'Entrega: 10–20 fotos editadas en alta resolución',
      'Opcional: maquillaje/estilismo (costo adicional)',
    ],
  },
  {
    key: 'eventos',
    title: 'Eventos',
    short: 'Cobertura para eventos culturales, empresariales y sociales.',
    priceRange: 'Desde $300.000 COP',
    details: [
      'Cobertura por horas',
      'Galería online para descarga',
      'Entrega en 48–72h según volumen',
    ],
  },
  {
    key: 'moda',
    title: 'Moda',
    short: 'Editoriales y catálogos con estética cuidada.',
    priceRange: 'Desde $400.000 COP',
    details: [
      'Preproducción: moodboard y scouting básico',
      'Dirección de arte y poses',
      'Opcional: equipo de iluminación y locación',
    ],
  },
  {
    key: 'producto',
    title: 'Producto',
    short: 'Producto para e-commerce y campañas.',
    priceRange: 'Desde $250.000 COP',
    details: [
      'Set de iluminación controlado',
      'Fondo neutro o creativo',
      'Optimización para web y redes',
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
