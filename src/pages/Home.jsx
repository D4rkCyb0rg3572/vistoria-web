import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Building, 
  Camera, 
  FileText, 
  CheckCircle, 
  User, 
  MapPin, 
  Layers, 
  Hash, 
  Home as HomeIcon,
  Calendar,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PROPERTY_TYPES } from '@/utils/constants'

const Home = () => {
  const navigate = useNavigate()
  const [property, setProperty] = useState({
    client: '',
    propertyType: 'apartamento',
    area: '',
    floors: '',
    rooms: '',
    address: '',
    inspectionDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validação básica
    if (!property.client || !property.area || !property.floors || !property.rooms || !property.address) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    // Gerar ID único para a propriedade
    const propertyId = `prop_${Date.now()}`
    
    // Salvar no localStorage
    const savedProperties = JSON.parse(localStorage.getItem('vistoria_properties') || '{}')
    savedProperties[propertyId] = {
      ...property,
      id: propertyId,
      createdAt: new Date().toISOString(),
      status: 'in_progress'
    }
    localStorage.setItem('vistoria_properties', JSON.stringify(savedProperties))
    
    // Navegar para a página de vistoria
    navigate(`/imovel/${propertyId}`)
  }

  const handleInputChange = (field, value) => {
    setProperty(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <Building className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Vistoria Digital
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plataforma profissional para vistoria de imóveis com checklist detalhado e relatórios automatizados
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="card-hover animate-slide-in-up">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Checklist Completo</h3>
              <p className="text-sm text-muted-foreground">
                Sistema abrangente de verificação para todos os ambientes
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover animate-slide-in-up" style={{animationDelay: '0.1s'}}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Fotos Integradas</h3>
              <p className="text-sm text-muted-foreground">
                Capture e organize evidências fotográficas automaticamente
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover animate-slide-in-up" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Relatórios PDF</h3>
              <p className="text-sm text-muted-foreground">
                Gere relatórios profissionais prontos para entrega
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl animate-scale-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <Plus className="h-6 w-6" />
                Nova Vistoria
              </CardTitle>
              <p className="text-muted-foreground">Preencha os dados do imóvel para iniciar</p>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <Label htmlFor="client" className="form-label">
                      <User className="h-4 w-4" />
                      Nome do Cliente *
                    </Label>
                    <Input
                      id="client"
                      placeholder="Nome completo do cliente"
                      value={property.client}
                      onChange={(e) => handleInputChange('client', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="propertyType" className="form-label">
                      <Building className="h-4 w-4" />
                      Tipo do Imóvel *
                    </Label>
                    <Select 
                      value={property.propertyType} 
                      onValueChange={(value) => handleInputChange('propertyType', value)}
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="form-group">
                    <Label htmlFor="area" className="form-label">
                      <Layers className="h-4 w-4" />
                      Área (m²) *
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="85"
                      value={property.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor="floors" className="form-label">
                      <Hash className="h-4 w-4" />
                      Andares *
                    </Label>
                    <Input
                      id="floors"
                      type="number"
                      placeholder="1"
                      value={property.floors}
                      onChange={(e) => handleInputChange('floors', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor="rooms" className="form-label">
                      <HomeIcon className="h-4 w-4" />
                      Quartos *
                    </Label>
                    <Input
                      id="rooms"
                      type="number"
                      placeholder="3"
                      value={property.rooms}
                      onChange={(e) => handleInputChange('rooms', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="address" className="form-label">
                    <MapPin className="h-4 w-4" />
                    Endereço Completo *
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Rua, número, bairro, cidade, CEP"
                    value={property.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="form-input min-h-[80px]"
                    required
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="inspectionDate" className="form-label">
                    <Calendar className="h-4 w-4" />
                    Data da Vistoria *
                  </Label>
                  <Input
                    id="inspectionDate"
                    type="date"
                    value={property.inspectionDate}
                    onChange={(e) => handleInputChange('inspectionDate', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full btn-primary py-3 text-lg font-semibold">
                  <Camera className="h-5 w-5 mr-2" />
                  Iniciar Vistoria
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Home

