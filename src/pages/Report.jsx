import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Calendar,
  MapPin,
  User,
  Home,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Camera,
  Building,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import PhotoGallery from '@/components/PhotoGallery'
import { generateInspectionPDF } from '@/utils/pdfGenerator'
import { ENVIRONMENTS, INSPECTION_CATEGORIES, INSPECTION_STATUS } from '@/utils/constants'

const Report = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [inspections, setInspections] = useState({})
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [stats, setStats] = useState({ total: 0, ok: 0, minor: 0, major: 0, critical: 0 })

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = () => {
    // Carregar dados do imóvel
    const savedProperties = JSON.parse(localStorage.getItem('vistoria_properties') || '{}')
    const propertyData = savedProperties[id]
    
    if (!propertyData) {
      navigate('/')
      return
    }
    
    setProperty(propertyData)

    // Carregar dados das inspeções
    const savedInspections = JSON.parse(localStorage.getItem(`vistoria_inspections_${id}`) || '{}')
    setInspections(savedInspections)

    // Calcular estatísticas
    calculateStats(savedInspections)
  }

  const calculateStats = (inspectionData) => {
    let total = 0
    let ok = 0
    let minor = 0
    let major = 0
    let critical = 0

    Object.values(inspectionData).forEach(envInspections => {
      Object.values(envInspections).forEach(item => {
        total++
        switch(item.status) {
          case 'ok': ok++; break
          case 'minor': minor++; break
          case 'major': major++; break
          case 'critical': critical++; break
        }
      })
    })

    setStats({ total, ok, minor, major, critical })
  }

  const handleGeneratePDF = async () => {
    if (!property) return

    setIsGeneratingPDF(true)
    try {
      // Dados do usuário (podem ser configurados nas configurações)
      const userProfile = {
        name: 'Vistoriador Responsável',
        company: 'Sistema de Vistoria Digital',
        email: 'contato@vistoriadigital.com',
        phone: '(11) 99999-9999'
      }

      await generateInspectionPDF(property, inspections, userProfile)
      
      // Feedback visual
      const button = document.querySelector('[data-pdf-button]')
      if (button) {
        button.textContent = '✓ PDF Gerado!'
        setTimeout(() => {
          button.textContent = 'Gerar PDF'
        }, 2000)
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const getStatusIcon = (status) => {
    const statusConfig = INSPECTION_STATUS[status] || INSPECTION_STATUS.ok
    const iconMap = {
      'CheckCircle': CheckCircle,
      'Info': Info,
      'AlertTriangle': AlertTriangle,
      'AlertCircle': AlertCircle
    }
    return iconMap[statusConfig.icon] || CheckCircle
  }

  const getEnvironmentIcon = (iconName) => {
    const iconMap = {
      'Home': Building,
      'ChefHat': Building,
      'Bed': Building,
      'Bath': Building,
      'TreePine': Building,
      'Car': Building,
      'Building': Building
    }
    return iconMap[iconName] || Building
  }

  const getCategoryIcon = (iconName) => {
    const iconMap = {
      'Layers': Building,
      'DoorOpen': Building,
      'Paintbrush': Building,
      'Zap': Building,
      'Droplets': Building,
      'Wrench': Building,
      'TreePine': Building,
      'Mountain': Building,
      'Car': Building,
      'Users': Building,
      'ArrowUpDown': Building
    }
    return iconMap[iconName] || Building
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando relatório...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'text-red-600'
      case 'major': return 'text-yellow-600'
      case 'minor': return 'text-blue-600'
      default: return 'text-green-600'
    }
  }

  const getStatusBg = (status) => {
    switch(status) {
      case 'critical': return 'bg-red-50'
      case 'major': return 'bg-yellow-50'
      case 'minor': return 'bg-blue-50'
      default: return 'bg-green-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/imovel/${id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold flex items-center gap-3 justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
              Relatório de Vistoria
            </h1>
            <p className="text-muted-foreground">
              {stats.total} item{stats.total !== 1 ? 's' : ''} inspecionado{stats.total !== 1 ? 's' : ''}
            </p>
          </div>

          <Button 
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2"
            data-pdf-button
          >
            {isGeneratingPDF ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isGeneratingPDF ? 'Gerando...' : 'Gerar PDF'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações do Imóvel */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Dados do Imóvel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                      <p className="font-medium">{property.client}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <p className="font-medium">{property.propertyType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p className="font-medium text-sm">{property.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data da Vistoria</p>
                      <p className="font-medium">{new Date(property.inspectionDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{property.area}m²</p>
                    <p className="text-sm text-muted-foreground">Área Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{property.rooms}</p>
                    <p className="text-sm text-muted-foreground">Quartos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo Executivo */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Resumo Executivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total de Itens</span>
                    <Badge variant="outline">{stats.total}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Aprovados
                    </span>
                    <Badge className="bg-green-100 text-green-800">{stats.ok}</Badge>
                  </div>
                  
                  {stats.minor > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        Observações
                      </span>
                      <Badge className="bg-blue-100 text-blue-800">{stats.minor}</Badge>
                    </div>
                  )}
                  
                  {stats.major > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        Atenção
                      </span>
                      <Badge className="bg-yellow-100 text-yellow-800">{stats.major}</Badge>
                    </div>
                  )}
                  
                  {stats.critical > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        Críticos
                      </span>
                      <Badge className="bg-red-100 text-red-800">{stats.critical}</Badge>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="text-center">
                  {stats.critical > 0 ? (
                    <div className="text-red-600">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-semibold">Ação Imediata Necessária</p>
                      <p className="text-sm">Itens críticos identificados</p>
                    </div>
                  ) : stats.major > 0 ? (
                    <div className="text-yellow-600">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-semibold">Acompanhamento Necessário</p>
                      <p className="text-sm">Alguns itens requerem atenção</p>
                    </div>
                  ) : (
                    <div className="text-green-600">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-semibold">Imóvel em Boas Condições</p>
                      <p className="text-sm">Sem problemas graves identificados</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalhes da Inspeção */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Detalhes da Inspeção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(inspections).map(([envId, envInspections]) => {
                    const environment = ENVIRONMENTS.find(env => env.id === envId)
                    if (!environment || Object.keys(envInspections).length === 0) return null

                    const EnvIcon = getEnvironmentIcon(environment.icon)

                    return (
                      <div key={envId} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 bg-${environment.color}-100 rounded-lg`}>
                            <EnvIcon className={`h-5 w-5 text-${environment.color}-600`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{environment.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {Object.keys(envInspections).length} item{Object.keys(envInspections).length !== 1 ? 's' : ''} inspecionado{Object.keys(envInspections).length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {Object.entries(envInspections)
                            .sort(([,a], [,b]) => new Date(b.timestamp) - new Date(a.timestamp))
                            .map(([key, item]) => {
                              const config = INSPECTION_STATUS[item.status] || INSPECTION_STATUS.ok
                              const category = INSPECTION_CATEGORIES.find(cat => cat.id === item.category)
                              const StatusIcon = getStatusIcon(item.status)
                              const CategoryIcon = getCategoryIcon(category?.icon)

                              return (
                                <div key={key} className={`p-4 rounded-lg border-l-4 ${config.bg} border-l-current ${getStatusColor(item.status)}`}>
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                      <StatusIcon className={`h-5 w-5 ${config.color}`} />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge className={config.badge}>
                                          {config.label}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                          {category?.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-auto">
                                          {new Date(item.timestamp).toLocaleString('pt-BR')}
                                        </span>
                                      </div>
                                      
                                      <p className="text-sm mb-3">{item.observation}</p>
                                      
                                      {item.photos && item.photos.length > 0 && (
                                        <div className="mt-3">
                                          <PhotoGallery
                                            photos={item.photos}
                                            title={`Fotos (${item.photos.length})`}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    )
                  })}

                  {Object.keys(inspections).length === 0 && (
                    <div className="text-center py-12">
                      <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">Nenhuma inspeção realizada</h3>
                      <p className="text-muted-foreground mb-4">
                        Comece a vistoria para gerar o relatório completo
                      </p>
                      <Button onClick={() => navigate(`/imovel/${id}`)}>
                        Iniciar Vistoria
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Report

