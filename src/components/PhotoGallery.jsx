import { useState } from 'react'
import { X, Download, Eye, Trash2, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const PhotoGallery = ({ photos = [], onDeletePhoto, onAddPhoto, title = "Fotos" }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const openPhotoViewer = (photo) => {
    setSelectedPhoto(photo)
    setIsViewerOpen(true)
  }

  const closePhotoViewer = () => {
    setSelectedPhoto(null)
    setIsViewerOpen(false)
  }

  const downloadPhoto = (photo) => {
    const link = document.createElement('a')
    link.href = photo.url
    link.download = `foto-${photo.timestamp || Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const deletePhoto = (photoIndex) => {
    if (confirm('Tem certeza que deseja excluir esta foto?')) {
      onDeletePhoto(photoIndex)
      closePhotoViewer()
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Data não disponível'
    return new Date(timestamp).toLocaleString('pt-BR')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          <h3 className="font-semibold">{title}</h3>
          <Badge variant="secondary">{photos.length}</Badge>
        </div>
        
        {onAddPhoto && (
          <Button onClick={onAddPhoto} size="sm" variant="outline">
            <Camera className="h-4 w-4 mr-2" />
            Adicionar Foto
          </Button>
        )}
      </div>

      {photos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Nenhuma foto adicionada</p>
            {onAddPhoto && (
              <Button onClick={onAddPhoto} className="mt-4" variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Adicionar Primeira Foto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative group">
                  <img
                    src={photo.url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-32 object-cover"
                    onClick={() => openPhotoViewer(photo)}
                  />
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          openPhotoViewer(photo)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadPhoto(photo)
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      {onDeletePhoto && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            deletePhoto(index)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <p className="text-white text-xs truncate">
                      Foto {index + 1}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Photo Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={closePhotoViewer}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Visualizar Foto</span>
              <div className="flex gap-2">
                {selectedPhoto && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadPhoto(selectedPhoto)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                    
                    {onDeletePhoto && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePhoto(photos.indexOf(selectedPhoto))}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    )}
                  </>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="space-y-4">
              <img
                src={selectedPhoto.url}
                alt="Foto ampliada"
                className="w-full max-h-96 object-contain rounded-lg"
              />
              
              <div className="text-sm text-muted-foreground">
                <p><strong>Data:</strong> {formatDate(selectedPhoto.timestamp)}</p>
                {selectedPhoto.description && (
                  <p><strong>Descrição:</strong> {selectedPhoto.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PhotoGallery

