import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Calendar, 
  Building, 
  FileText, 
  Trash2,
  Eye,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PROPERTY_TYPES } from '@/utils/constants'

const History = () => {
  const [properties, setProperties] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = () => {
    const savedProperties = JSON.parse(localStorage.getItem('vistoria_properties') || '{}')
    setProperties(savedProperties)
  }

  const deleteProperty = (propertyId) => {
    if (confirm('Tem certeza que deseja excluir esta vistoria? Esta ação não pode ser desfeita.')) {
      const updatedProperties = { ...properties }
      delete updatedProperties[propertyId]
      
      localStorage.setItem('vistoria_properties', JSON.stringify(updatedProperties))
      localStorage.removeItem(`vistoria_inspections_${propertyId}`)
      
      setProperties(updatedProperties)
    }
  }

  const getPropertyStats = (propertyId) => {
    const inspections = JSON.parse(localStorage.getItem(`vistoria_inspections_${propertyId}`) || '{}')
    let total = 0
    let critical = 0
    
    Object.values(inspections).forEach(envInspections => {
      Object.values(envInspections).forEach(item => {
        total++
        if (item.status === 'critical') critical++
      })
    })
    
    return { total, critical }
  }

  const filteredProperties = Object.values(properties).filter(property => {
    const matchesSearch = property.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || property.propertyType === filterType
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Histórico de Vistorias</h1>
            <p className="text-muted-foreground">
              {Object.keys(properties).length} vistoria{Object.keys(properties).length !== 1 ? 's' : ''} registrada{Object.keys(properties).length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <Link to="/">
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nova Vistoria
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente ou endereço..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tipo de imóvel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="in_progress">Em andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Properties List */}
        {filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma vistoria encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {Object.keys(properties).length === 0 
                  ? 'Você ainda não criou nenhuma vistoria.'
                  : 'Nenhuma vistoria corresponde aos filtros aplicados.'
                }
              </p>
              <Link to="/">
                <Button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Vistoria
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredProperties.map((property) => {
              const stats = getPropertyStats(property.id)
              const statusConfig = {
                in_progress: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-800' },
                completed: { label: 'Concluída', color: 'bg-green-100 text-green-800' },
                draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-800' }
              }
              
              return (
                <Card key={property.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{property.client}</h3>
                          <Badge className={statusConfig[property.status]?.color || statusConfig.draft.color}>
                            {statusConfig[property.status]?.label || 'Rascunho'}
                          </Badge>
                          {stats.critical > 0 && (
                            <Badge className="bg-red-100 text-red-800">
                              {stats.critical} crítico{stats.critical > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {PROPERTY_TYPES.find(t => t.value === property.propertyType)?.label}
                          </div>
                          <div>{property.area}m² • {property.rooms} quartos</div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(property.inspectionDate).toLocaleDateString('pt-BR')}
                          </div>
                          <div>{stats.total} item{stats.total !== 1 ? 's' : ''} inspecionado{stats.total !== 1 ? 's' : ''}</div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{property.address}</p>
                        
                        <div className="text-xs text-muted-foreground">
                          Criado em {new Date(property.createdAt).toLocaleDateString('pt-BR')} às {new Date(property.createdAt).toLocaleTimeString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Link to={`/imovel/${property.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Abrir
                          </Button>
                        </Link>
                        
                        <Link to={`/imovel/${property.id}/relatorio`}>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Relatório
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteProperty(property.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default History

