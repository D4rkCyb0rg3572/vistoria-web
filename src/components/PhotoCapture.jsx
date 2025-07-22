import { useState, useRef } from 'react'
import { Camera, Upload, X, Check, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'

const PhotoCapture = ({ isOpen, onClose, onPhotoCapture, title = "Capturar Foto" }) => {
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [stream, setStream] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  const startCamera = async () => {
    try {
      setIsCapturing(true)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Usar câmera traseira por padrão
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error)
      alert('Não foi possível acessar a câmera. Verifique as permissões.')
      setIsCapturing(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCapturing(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        setCapturedPhoto({
          blob,
          url,
          timestamp: new Date().toISOString()
        })
        stopCamera()
      }, 'image/jpeg', 0.8)
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setCapturedPhoto({
        blob: file,
        url,
        timestamp: new Date().toISOString()
      })
    }
  }

  const confirmPhoto = () => {
    if (capturedPhoto && onPhotoCapture) {
      onPhotoCapture(capturedPhoto)
      resetCapture()
      onClose()
    }
  }

  const resetCapture = () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto.url)
    }
    setCapturedPhoto(null)
    stopCamera()
  }

  const handleClose = () => {
    resetCapture()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!isCapturing && !capturedPhoto && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={startCamera}
                className="h-24 flex flex-col items-center gap-2"
                variant="outline"
              >
                <Camera className="h-8 w-8" />
                <span>Usar Câmera</span>
              </Button>
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="h-24 flex flex-col items-center gap-2"
                variant="outline"
              >
                <Upload className="h-8 w-8" />
                <span>Selecionar Arquivo</span>
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
          
          {isCapturing && (
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                    style={{ maxHeight: '400px' }}
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <Button onClick={capturePhoto} size="lg" className="rounded-full">
                      <Camera className="h-6 w-6" />
                    </Button>
                    <Button onClick={stopCamera} variant="outline" size="lg" className="rounded-full">
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {capturedPhoto && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <img 
                    src={capturedPhoto.url} 
                    alt="Foto capturada" 
                    className="w-full rounded-lg"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                  
                  <div className="flex gap-2 justify-center">
                    <Button onClick={confirmPhoto} className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Confirmar Foto
                    </Button>
                    
                    <Button onClick={resetCapture} variant="outline" className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Capturar Novamente
                    </Button>
                    
                    <Button onClick={handleClose} variant="outline" className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
}

export default PhotoCapture

