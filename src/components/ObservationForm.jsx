import { useState } from 'react'
import { Save, Camera, X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import PhotoCapture from './PhotoCapture'
import PhotoGallery from './PhotoGallery'
import { INSPECTION_STATUS } from '@/utils/constants'

const ObservationForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  category, 
  initialData = null 
}) => {
  const [formData, setFormData] = useState({
    observation: initialData?.observation || '',
    status: initialData?.status || 'ok',
    photos: initialData?.photos || [],
    description: initialData?.description || ''
  })
  const [isPhotoCaptureOpen, setIsPhotoCaptureOpen] = useState(false)

  const handleSave = () => {
    if (!formData.observation.trim()) {
      alert('Por favor, adicione uma observação.')
      return
    }

    const observationData = {
      ...formData,
      category: category?.id,
      timestamp: new Date().toISOString()
    }

    onSave(observationData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      observation: '',
      status: 'ok',
      photos: [],
      description: ''
    })
    onClose()
  }

  const handlePhotoCapture = (photo) => {
    // Converter blob para base64 para armazenamento local
    const reader = new FileReader()
    reader.onload = () => {
      const photoData = {
        url: reader.result, // base64 data URL
        timestamp: photo.timestamp,
        description: formData.description
      }
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, photoData]
      }))
    }
    reader.readAsDataURL(photo.blob)
  }

  const handleDeletePhoto = (photoIndex) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== photoIndex)
    }))
  }

  const getStatusIcon = (status) => {
    const config = INSPECTION_STATUS[status] || INSPECTION_STATUS.ok
    const iconMap = {
      'CheckCircle': CheckCircle,
      'Info': Info,
      'AlertTriangle': AlertTriangle,
      'AlertCircle': AlertCircle
    }
    return iconMap[config.icon] || CheckCircle
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {category && (
                <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                  <div className={`h-5 w-5 text-${category.color}-600`} />
                </div>
              )}
              Observação Detalhada - {category?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="status">Status da Inspeção *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INSPECTION_STATUS).map(([key, config]) => {
                    const StatusIcon = getStatusIcon(key)
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${config.color}`} />
                          {config.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Observation Text */}
            <div className="space-y-2">
              <Label htmlFor="observation">Observação *</Label>
              <Textarea
                id="observation"
                placeholder="Descreva detalhadamente o que foi observado..."
                value={formData.observation}
                onChange={(e) => setFormData(prev => ({ ...prev, observation: e.target.value }))}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Photo Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição das Fotos (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Adicione uma descrição para as fotos que serão capturadas..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Photo Gallery */}
            <div className="space-y-4">
              <PhotoGallery
                photos={formData.photos}
                onDeletePhoto={handleDeletePhoto}
                onAddPhoto={() => setIsPhotoCaptureOpen(true)}
                title="Fotos da Observação"
              />
            </div>

            {/* Status Preview */}
            {formData.status && (
              <Card className={INSPECTION_STATUS[formData.status]?.bg}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const StatusIcon = getStatusIcon(formData.status)
                      return <StatusIcon className={`h-5 w-5 ${INSPECTION_STATUS[formData.status]?.color}`} />
                    })()}
                    <span className="font-medium">
                      Status: {INSPECTION_STATUS[formData.status]?.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Salvar Observação
              </Button>
              
              <Button onClick={handleClose} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Capture Dialog */}
      <PhotoCapture
        isOpen={isPhotoCaptureOpen}
        onClose={() => setIsPhotoCaptureOpen(false)}
        onPhotoCapture={handlePhotoCapture}
        title={`Foto - ${category?.name}`}
      />
    </>
  )
}

export default ObservationForm

