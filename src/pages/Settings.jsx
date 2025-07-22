import { useState, useEffect } from 'react'
import { 
  Settings as SettingsIcon, 
  User, 
  Palette, 
  Download, 
  Upload,
  Trash2,
  Save,
  RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { DEFAULT_SETTINGS } from '@/utils/constants'

const Settings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [userProfile, setUserProfile] = useState({
    name: '',
    company: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    loadSettings()
    loadUserProfile()
  }, [])

  const loadSettings = () => {
    const savedSettings = JSON.parse(localStorage.getItem('vistoria_settings') || '{}')
    setSettings({ ...DEFAULT_SETTINGS, ...savedSettings })
  }

  const loadUserProfile = () => {
    const savedProfile = JSON.parse(localStorage.getItem('vistoria_user_profile') || '{}')
    setUserProfile(savedProfile)
  }

  const saveSettings = () => {
    localStorage.setItem('vistoria_settings', JSON.stringify(settings))
    alert('Configurações salvas com sucesso!')
  }

  const saveUserProfile = () => {
    localStorage.setItem('vistoria_user_profile', JSON.stringify(userProfile))
    alert('Perfil salvo com sucesso!')
  }

  const resetSettings = () => {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      setSettings(DEFAULT_SETTINGS)
      localStorage.setItem('vistoria_settings', JSON.stringify(DEFAULT_SETTINGS))
      alert('Configurações restauradas!')
    }
  }

  const exportData = () => {
    const data = {
      properties: JSON.parse(localStorage.getItem('vistoria_properties') || '{}'),
      settings: settings,
      userProfile: userProfile,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vistoria-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        if (confirm('Importar dados irá sobrescrever todas as informações atuais. Continuar?')) {
          if (data.properties) {
            localStorage.setItem('vistoria_properties', JSON.stringify(data.properties))
          }
          if (data.settings) {
            localStorage.setItem('vistoria_settings', JSON.stringify(data.settings))
            setSettings(data.settings)
          }
          if (data.userProfile) {
            localStorage.setItem('vistoria_user_profile', JSON.stringify(data.userProfile))
            setUserProfile(data.userProfile)
          }
          
          alert('Dados importados com sucesso!')
        }
      } catch (error) {
        alert('Erro ao importar dados. Verifique se o arquivo está correto.')
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = () => {
    if (confirm('ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema. Esta ação não pode ser desfeita. Continuar?')) {
      if (confirm('Tem certeza absoluta? Todos os imóveis, vistorias e configurações serão perdidos.')) {
        localStorage.clear()
        setSettings(DEFAULT_SETTINGS)
        setUserProfile({ name: '', company: '', email: '', phone: '' })
        alert('Todos os dados foram apagados.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-6 w-6" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Personalize o sistema de acordo com suas preferências
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Perfil do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={userProfile.company}
                    onChange={(e) => setUserProfile({...userProfile, company: e.target.value})}
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              
              <Button onClick={saveUserProfile} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Perfil
              </Button>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Salvamento Automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Salvar dados automaticamente durante a vistoria
                  </p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
                />
              </div>
              
              <Separator />
              
              <div>
                <Label>Qualidade das Fotos</Label>
                <Select 
                  value={settings.photoQuality} 
                  onValueChange={(value) => setSettings({...settings, photoQuality: value})}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa (menor arquivo)</SelectItem>
                    <SelectItem value="medium">Média (balanceado)</SelectItem>
                    <SelectItem value="high">Alta (melhor qualidade)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Formato do PDF</Label>
                <Select 
                  value={settings.pdfFormat} 
                  onValueChange={(value) => setSettings({...settings, pdfFormat: value})}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4 (210 x 297 mm)</SelectItem>
                    <SelectItem value="letter">Carta (216 x 279 mm)</SelectItem>
                    <SelectItem value="legal">Ofício (216 x 356 mm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={saveSettings} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button onClick={resetSettings} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restaurar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Gerenciamento de Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Download className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold mb-2">Exportar Dados</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Baixe um backup completo de todas as suas vistorias
                  </p>
                  <Button onClick={exportData} variant="outline" className="w-full">
                    Exportar Backup
                  </Button>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold mb-2">Importar Dados</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Restaure dados de um backup anterior
                  </p>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="w-full">
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>
                
                <div className="text-center p-4 border rounded-lg border-red-200">
                  <Trash2 className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <h3 className="font-semibold mb-2">Limpar Dados</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Apague todos os dados do sistema
                  </p>
                  <Button 
                    onClick={clearAllData} 
                    variant="outline" 
                    className="w-full text-red-600 hover:bg-red-50"
                  >
                    Apagar Tudo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings

