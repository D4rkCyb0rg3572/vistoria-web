// Constantes do sistema de vistoria

export const PROPERTY_TYPES = [
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'terreno', label: 'Terreno' }
]

export const ENVIRONMENTS = [
  { 
    id: 'sala', 
    name: 'Sala de Estar', 
    icon: 'Home', 
    isCustom: false, 
    color: 'blue',
    description: 'Área social principal do imóvel'
  },
  { 
    id: 'cozinha', 
    name: 'Cozinha', 
    icon: 'ChefHat', 
    isCustom: false, 
    color: 'orange',
    description: 'Área de preparo de alimentos'
  },
  { 
    id: 'quarto1', 
    name: 'Quarto Principal', 
    icon: 'Bed', 
    isCustom: false, 
    color: 'purple',
    description: 'Dormitório principal/suíte'
  },
  { 
    id: 'quarto2', 
    name: 'Quarto 2', 
    icon: 'Bed', 
    isCustom: false, 
    color: 'indigo',
    description: 'Segundo dormitório'
  },
  { 
    id: 'banheiro1', 
    name: 'Banheiro Social', 
    icon: 'Bath', 
    isCustom: false, 
    color: 'cyan',
    description: 'Banheiro de uso comum'
  },
  { 
    id: 'banheiro2', 
    name: 'Banheiro Suíte', 
    icon: 'Bath', 
    isCustom: false, 
    color: 'teal',
    description: 'Banheiro privativo da suíte'
  },
  { 
    id: 'varanda', 
    name: 'Varanda/Sacada', 
    icon: 'TreePine', 
    isCustom: false, 
    color: 'green',
    description: 'Área externa coberta'
  },
  { 
    id: 'garagem', 
    name: 'Garagem', 
    icon: 'Car', 
    isCustom: false, 
    color: 'gray',
    description: 'Área para estacionamento'
  },
  { 
    id: 'areas_comuns', 
    name: 'Áreas Comuns', 
    icon: 'Building', 
    isCustom: false, 
    color: 'yellow',
    description: 'Espaços compartilhados do edifício'
  }
]

export const INSPECTION_CATEGORIES = [
  { 
    id: 'pisos', 
    name: 'Pisos e Azulejos', 
    icon: 'Layers', 
    color: 'amber',
    description: 'Revestimentos de piso e parede'
  },
  { 
    id: 'portas', 
    name: 'Portas e Janelas', 
    icon: 'DoorOpen', 
    color: 'brown',
    description: 'Esquadrias e vedações'
  },
  { 
    id: 'pintura', 
    name: 'Pintura e Acabamentos', 
    icon: 'Paintbrush', 
    color: 'pink',
    description: 'Acabamentos e pintura'
  },
  { 
    id: 'eletrica', 
    name: 'Instalações Elétricas', 
    icon: 'Zap', 
    color: 'yellow',
    description: 'Sistema elétrico e iluminação'
  },
  { 
    id: 'hidraulica', 
    name: 'Instalações Hidráulicas', 
    icon: 'Droplets', 
    color: 'blue',
    description: 'Sistema hidráulico e sanitário'
  },
  { 
    id: 'loucas', 
    name: 'Louças e Metais', 
    icon: 'Wrench', 
    color: 'gray',
    description: 'Louças sanitárias e metais'
  },
  { 
    id: 'varanda_cat', 
    name: 'Varanda/Sacada', 
    icon: 'TreePine', 
    color: 'green',
    description: 'Estrutura e acabamentos da varanda'
  },
  { 
    id: 'externas', 
    name: 'Áreas Externas', 
    icon: 'Mountain', 
    color: 'emerald',
    description: 'Jardins, quintais e áreas descobertas'
  },
  { 
    id: 'garagem_cat', 
    name: 'Vaga de Garagem', 
    icon: 'Car', 
    color: 'slate',
    description: 'Estrutura e demarcação da garagem'
  },
  { 
    id: 'comuns', 
    name: 'Áreas Comuns', 
    icon: 'Users', 
    color: 'orange',
    description: 'Espaços compartilhados do condomínio'
  },
  { 
    id: 'elevadores', 
    name: 'Elevadores e Escadas', 
    icon: 'ArrowUpDown', 
    color: 'red',
    description: 'Sistemas de circulação vertical'
  }
]

export const INSPECTION_STATUS = {
  ok: { 
    icon: 'CheckCircle', 
    color: 'text-green-600', 
    bg: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-800',
    label: 'Aprovado',
    description: 'Item sem problemas identificados'
  },
  minor: { 
    icon: 'Info', 
    color: 'text-blue-600', 
    bg: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    label: 'Observação',
    description: 'Item com observações menores'
  },
  major: { 
    icon: 'AlertTriangle', 
    color: 'text-yellow-600', 
    bg: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800',
    label: 'Atenção',
    description: 'Item que requer atenção'
  },
  critical: { 
    icon: 'AlertCircle', 
    color: 'text-red-600', 
    bg: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-800',
    label: 'Crítico',
    description: 'Problema grave identificado'
  }
}

export const ROUTES = {
  HOME: '/',
  PROPERTY: '/imovel/:id',
  ENVIRONMENT: '/imovel/:id/ambiente/:environmentId',
  REPORT: '/imovel/:id/relatorio',
  HISTORY: '/historico',
  SETTINGS: '/configuracoes'
}

export const LOCAL_STORAGE_KEYS = {
  PROPERTIES: 'vistoria_properties',
  INSPECTIONS: 'vistoria_inspections',
  SETTINGS: 'vistoria_settings',
  ENVIRONMENTS: 'vistoria_environments'
}

export const DEFAULT_SETTINGS = {
  theme: 'light',
  autoSave: true,
  photoQuality: 'high',
  pdfFormat: 'a4',
  language: 'pt-BR'
}

export const PHOTO_SETTINGS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles: 10,
  quality: 0.8
}

export const PDF_SETTINGS = {
  format: 'a4',
  orientation: 'portrait',
  margin: 20,
  fontSize: {
    title: 18,
    subtitle: 14,
    body: 12,
    caption: 10
  }
}

