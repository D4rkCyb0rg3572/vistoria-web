import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  FileText, 
  Camera, 
  TrendingUp, 
  Shield, 
  Search, 
  Filter,
  Settings,
  Cloud,
  Building
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ENVIRONMENTS, INSPECTION_STATUS } from '@/utils/constants'

const PropertyInspection = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [inspections, setInspections] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

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

  const getInspectionProgress = () => {
    const totalEnvironments = ENVIRONMENTS.length
    const inspectedEnvironments = Object.keys(inspections).filter(envId => 
      Object.keys(inspections[envId] || {}).length > 0
    ).length
    return Math.round((inspectedEnvironments / totalEnvironments) * 100)
  }

  const getOverallStats = () => {
    let total = 0
    let ok = 0
    let minor = 0
    let major = 0
    let critical = 0

    Object.values(inspections).forEach(envInspections => {
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

    return { total, ok, minor, major, critical }
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

  const filteredEnvironments = ENVIRONMENTS.filter(env => 
    env.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando dados da vistoria...</p>
        </div>
      </div>
    )
  }

  const progress = getInspectionProgress()
  const stats = getOverallStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold">Vistoria em Andamento</h1>
            <p className="text-muted-foreground">{property.client}</p>
          </div>

          <Button 
            onClick={() => navigate(`/imovel/${id}/relatorio`)}
            className="btn-primary"
          >
            <FileText className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>

        {/* Progress and Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progresso da Vistoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Ambientes inspecionados</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {Object.keys(inspections).filter(envId => Object.keys(inspections[envId] || {}).length > 0).length} de {ENVIRONMENTS.length} ambientes
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Resumo dos Achados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.ok}</div>
                  <div className="text-xs text-muted-foreground">Aprovados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
                  <div className="text-xs text-muted-foreground">Críticos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.major}</div>
                  <div className="text-xs text-muted-foreground">Atenção</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.minor}</div>
                  <div className="text-xs text-muted-foreground">Observações</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dados do Imóvel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><strong>Tipo:</strong> {property.propertyType}</div>
              <div><strong>Área:</strong> {property.area}m²</div>
              <div><strong>Andares:</strong> {property.floors}</div>
              <div><strong>Quartos:</strong> {property.rooms}</div>
              <div className="col-span-2 md:col-span-4"><strong>Endereço:</strong> {property.address}</div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ambiente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="ok">Aprovados</SelectItem>
              <SelectItem value="critical">Críticos</SelectItem>
              <SelectItem value="major">Atenção</SelectItem>
              <SelectItem value="minor">Observações</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Environments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredEnvironments.map((env) => {
            const Icon = getEnvironmentIcon(env.icon)
            const envInspections = inspections[env.id] || {}
            const totalItems = Object.keys(envInspections).length
            const criticalItems = Object.values(envInspections).filter(item => item.status === 'critical').length
            const majorItems = Object.values(envInspections).filter(item => item.status === 'major').length
            const minorItems = Object.values(envInspections).filter(item => item.status === 'minor').length
            const okItems = Object.values(envInspections).filter(item => item.status === 'ok').length
            
            return (
              <Card key={env.id} className="card-hover cursor-pointer group">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-${env.color}-100 rounded-lg group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-5 w-5 text-${env.color}-600`} />
                      </div>
                      <span className="group-hover:text-primary transition-colors">{env.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {criticalItems > 0 && (
                        <Badge className="bg-red-100 text-red-800">{criticalItems}</Badge>
                      )}
                      {majorItems > 0 && (
                        <Badge className="bg-yellow-100 text-yellow-800">{majorItems}</Badge>
                      )}
                      {minorItems > 0 && (
                        <Badge className="bg-blue-100 text-blue-800">{minorItems}</Badge>
                      )}
                      {okItems > 0 && (
                        <Badge className="bg-green-100 text-green-800">{okItems}</Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {totalItems > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {totalItems} item{totalItems > 1 ? 's' : ''} inspecionado{totalItems > 1 ? 's' : ''}
                      </div>
                    )}
                    <Link to={`/imovel/${id}/ambiente/${env.id}`}>
                      <Button className="w-full btn-primary group-hover:shadow-md transition-shadow">
                        <Camera className="h-4 w-4 mr-2" />
                        {totalItems > 0 ? 'Continuar Inspeção' : 'Iniciar Inspeção'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            className="flex-1 btn-primary py-3" 
            size="lg"
            onClick={() => navigate(`/imovel/${id}/relatorio`)}
          >
            <FileText className="h-5 w-5 mr-2" />
            Gerar Relatório PDF
          </Button>
          
          <Button variant="outline" size="lg" className="px-8">
            <Cloud className="h-5 w-5 mr-2" />
            Sincronizar
          </Button>
          
          <Button variant="outline" size="lg">
            <Settings className="h-5 w-5 mr-2" />
            Configurar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PropertyInspection

