import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  FileText, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  Info,
  Plus,
  Clock,
  Building,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ObservationForm from '@/components/ObservationForm'
import PhotoGallery from '@/components/PhotoGallery'
import { ENVIRONMENTS, INSPECTION_CATEGORIES, INSPECTION_STATUS } from '@/utils/constants'

const EnvironmentInspection = () => {
  const { id, environmentId } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [inspections, setInspections] = useState({})
  const [showObservationForm, setShowObservationForm] = useState(false)
  const [currentCategory, setCurrentCategory] = useState('')
  const [editingObservation, setEditingObservation] = useState(null)

  useEffect(() => {
    loadPropertyData()
    loadInspectionData()
  }, [id])

  const loadPropertyData = () => {
    const savedProperties = JSON.parse(localStorage.getItem('vistoria_properties') || '{}')
    const propertyData = savedProperties[id]
    
    if (!propertyData) {
      navigate('/')
      return
    }
    
    setProperty(propertyData)
  }

  const loadInspectionData = () => {
    const savedInspections = JSON.parse(localStorage.getItem(`vistoria_inspections_${id}`) || '{}')
    setInspections(savedInspections)
  }

  const saveInspectionData = (newInspections) => {
    localStorage.setItem(`vistoria_inspections_${id}`, JSON.stringify(newInspections))
    setInspections(newInspections)
  }

  const addObservation = (category, observationData) => {
    const key = `${category}-${Date.now()}`
    const newInspections = {
      ...inspections,
      [environmentId]: {
        ...inspections[environmentId],
        [key]: {
          category,
          ...observationData,
          timestamp: new Date().toISOString()
        }
      }
    }
    saveInspectionData(newInspections)
  }

  const updateObservation = (observationKey, observationData) => {
    const newInspections = {
      ...inspections,
      [environmentId]: {
        ...inspections[environmentId],
        [observationKey]: {
          ...inspections[environmentId][observationKey],
          ...observationData,
          updatedAt: new Date().toISOString()
        }
      }
    }
    saveInspectionData(newInspections)
  }

  const deleteObservation = (observationKey) => {
    if (confirm('Tem certeza que deseja excluir esta observação?')) {
      const newInspections = {
        ...inspections,
        [environmentId]: {
          ...inspections[environmentId]
        }
      }
      delete newInspections[environmentId][observationKey]
      saveInspectionData(newInspections)
    }
  }

  const handleQuickObservation = (category, status) => {
    const observation = status === 'ok' ? 'Item inspecionado - Conforme' : 'Defeito identificado - Requer atenção'
    addObservation(category, { observation, status, photos: [] })
  }

  const handleDetailedObservation = (category) => {
    setCurrentCategory(category)
    setEditingObservation(null)
    setShowObservationForm(true)
  }

  const handleEditObservation = (observationKey, observationData) => {
    const category = INSPECTION_CATEGORIES.find(cat => cat.id === observationData.category)
    setCurrentCategory(category?.id || '')
    setEditingObservation({ key: observationKey, data: observationData })
    setShowObservationForm(true)
  }

  const handleSaveObservation = (observationData) => {
    if (editingObservation) {
      updateObservation(editingObservation.key, observationData)
    } else {
      addObservation(currentCategory, observationData)
    }
    setShowObservationForm(false)
    setCurrentCategory('')
    setEditingObservation(null)
  }

  const environment = ENVIRONMENTS.find(env => env.id === environmentId)
  const envInspections = inspections[environmentId] || {}

  if (!property || !environment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando dados da inspeção...</p>
        </div>
      </div>
    )
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

  const Icon = getEnvironmentIcon(environment.icon)
  const currentCategoryData = INSPECTION_CATEGORIES.find(cat => cat.id === currentCategory)

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
              <div className={`p-2 bg-${environment.color}-100 rounded-lg`}>
                <Icon className={`h-6 w-6 text-${environment.color}-600`} />
              </div>
              {environment.name}
            </h1>
            <p className="text-muted-foreground">
              {Object.keys(envInspections).length} item{Object.keys(envInspections).length !== 1 ? 's' : ''} inspecionado{Object.keys(envInspections).length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => navigate(`/imovel/${id}/relatorio`)}
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Relatório
            </Button>
          </div>
        </div>

        {/* Categories Tabs */}
        <Tabs defaultValue={INSPECTION_CATEGORIES[0].id} className="w-full">
          <div className="mb-6 overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 h-auto p-1">
              {INSPECTION_CATEGORIES.slice(0, 8).map((category) => {
                const CategoryIcon = getCategoryIcon(category.icon)
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id} 
                    className="flex items-center gap-2 p-3 text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <CategoryIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.name}</span>
                    <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
          
          {INSPECTION_CATEGORIES.map((category) => {
            const CategoryIcon = getCategoryIcon(category.icon)
            return (
              <TabsContent key={category.id} value={category.id}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                          <CategoryIcon className={`h-5 w-5 text-${category.color}-600`} />
                        </div>
                        {category.name}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDetailedObservation(category.id)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Observação Detalhada
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 text-left hover:bg-green-50 hover:border-green-200 transition-colors"
                        onClick={() => handleQuickObservation(category.id, 'ok')}
                      >
                        <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                        <div>
                          <div className="font-semibold text-green-700">Marcar como Conforme</div>
                          <div className="text-sm text-muted-foreground">Item sem problemas identificados</div>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 text-left hover:bg-red-50 hover:border-red-200 transition-colors"
                        onClick={() => handleQuickObservation(category.id, 'critical')}
                      >
                        <AlertCircle className="h-6 w-6 mr-3 text-red-600" />
                        <div>
                          <div className="font-semibold text-red-700">Marcar como Crítico</div>
                          <div className="text-sm text-muted-foreground">Problema grave identificado</div>
                        </div>
                      </Button>
                    </div>

                    {/* Existing Observations */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold">Observações Registradas</h4>
                      </div>
                      
                      {Object.entries(envInspections)
                        .filter(([_, item]) => item.category === category.id)
                        .sort(([,a], [,b]) => new Date(b.timestamp) - new Date(a.timestamp))
                        .map(([key, item]) => {
                          const config = INSPECTION_STATUS[item.status] || INSPECTION_STATUS.ok
                          const StatusIcon = getStatusIcon(item.status)
                          
                          return (
                            <div key={key} className={`p-4 rounded-xl border-2 ${config.bg} animate-slide-in-up`}>
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                                  <StatusIcon className={`h-5 w-5 ${config.color}`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className={config.badge}>
                                      {config.label}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(item.timestamp).toLocaleString('pt-BR')}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditObservation(key, item)}
                                      className="ml-auto"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <p className="text-sm font-medium mb-2">{item.observation}</p>
                                  
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
                      
                      {Object.entries(envInspections).filter(([_, item]) => item.category === category.id).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Nenhuma observação registrada ainda</p>
                          <p className="text-sm">Use os botões acima para adicionar observações</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>

      {/* Observation Form Dialog */}
      <ObservationForm
        isOpen={showObservationForm}
        onClose={() => {
          setShowObservationForm(false)
          setCurrentCategory('')
          setEditingObservation(null)
        }}
        onSave={handleSaveObservation}
        category={currentCategoryData}
        initialData={editingObservation?.data}
      />
    </div>
  )
}

export default EnvironmentInspection

