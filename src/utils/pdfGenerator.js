import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { ENVIRONMENTS, INSPECTION_CATEGORIES, INSPECTION_STATUS } from './constants'

export class PDFGenerator {
  constructor() {
    this.doc = null
    this.currentY = 20
    this.pageHeight = 297 // A4 height in mm
    this.pageWidth = 210 // A4 width in mm
    this.margin = 20
    this.lineHeight = 6
  }

  async generateReport(property, inspections, userProfile = {}) {
    this.doc = new jsPDF()
    this.currentY = this.margin

    // Configurar fonte
    this.doc.setFont('helvetica')

    // Gerar capa
    this.generateCover(property, userProfile)
    
    // Nova página para dados do imóvel
    this.addNewPage()
    this.generatePropertyInfo(property)
    
    // Gerar resumo executivo
    this.addSection()
    this.generateExecutiveSummary(inspections)
    
    // Gerar detalhes da inspeção
    this.addSection()
    this.generateInspectionDetails(inspections)
    
    // Gerar conclusão
    this.addSection()
    this.generateConclusion(inspections)

    return this.doc
  }

  generateCover(property, userProfile) {
    // Título principal
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.centerText('RELATÓRIO DE VISTORIA', this.currentY)
    this.currentY += 15

    this.doc.setFontSize(18)
    this.doc.setFont('helvetica', 'normal')
    this.centerText('IMOBILIÁRIA', this.currentY)
    this.currentY += 20

    // Informações do imóvel
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.centerText(`Cliente: ${property.client}`, this.currentY)
    this.currentY += 8

    this.doc.setFont('helvetica', 'normal')
    this.centerText(`Tipo: ${property.propertyType} | Área: ${property.area}m²`, this.currentY)
    this.currentY += 6
    this.centerText(`Quartos: ${property.rooms} | Andares: ${property.floors}`, this.currentY)
    this.currentY += 10

    // Endereço
    this.doc.setFontSize(12)
    this.centerText(property.address, this.currentY)
    this.currentY += 20

    // Data da vistoria
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.centerText(`Data da Vistoria: ${new Date(property.inspectionDate).toLocaleDateString('pt-BR')}`, this.currentY)
    this.currentY += 6
    this.centerText(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, this.currentY)
    this.currentY += 30

    // Informações do responsável
    if (userProfile.name || userProfile.company) {
      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      
      if (userProfile.company) {
        this.centerText(userProfile.company, this.currentY)
        this.currentY += 5
      }
      
      if (userProfile.name) {
        this.centerText(`Responsável: ${userProfile.name}`, this.currentY)
        this.currentY += 5
      }
      
      if (userProfile.email) {
        this.centerText(`E-mail: ${userProfile.email}`, this.currentY)
        this.currentY += 5
      }
      
      if (userProfile.phone) {
        this.centerText(`Telefone: ${userProfile.phone}`, this.currentY)
        this.currentY += 5
      }
    }

    // Logo ou marca d'água (simulado)
    this.currentY = this.pageHeight - 40
    this.doc.setFontSize(8)
    this.doc.setTextColor(150, 150, 150)
    this.centerText('Relatório gerado pelo Sistema de Vistoria Digital', this.currentY)
  }

  generatePropertyInfo(property) {
    this.addTitle('DADOS DO IMÓVEL')
    
    const info = [
      ['Cliente:', property.client],
      ['Tipo do Imóvel:', property.propertyType],
      ['Área Total:', `${property.area}m²`],
      ['Número de Quartos:', property.rooms],
      ['Número de Andares:', property.floors],
      ['Endereço:', property.address],
      ['Data da Vistoria:', new Date(property.inspectionDate).toLocaleDateString('pt-BR')],
      ['Data de Criação:', new Date(property.createdAt).toLocaleDateString('pt-BR')]
    ]

    this.doc.setFontSize(11)
    info.forEach(([label, value]) => {
      this.checkPageBreak()
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(label, this.margin, this.currentY)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(String(value), this.margin + 40, this.currentY)
      this.currentY += this.lineHeight
    })
  }

  generateExecutiveSummary(inspections) {
    this.addTitle('RESUMO EXECUTIVO')
    
    const stats = this.calculateStats(inspections)
    
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'normal')
    
    this.doc.text('Este relatório apresenta os resultados da vistoria realizada no imóvel,', this.margin, this.currentY)
    this.currentY += this.lineHeight
    this.doc.text('identificando o estado geral dos ambientes e sistemas inspecionados.', this.margin, this.currentY)
    this.currentY += this.lineHeight * 2

    // Estatísticas
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('ESTATÍSTICAS GERAIS:', this.margin, this.currentY)
    this.currentY += this.lineHeight

    const summaryData = [
      ['Total de itens inspecionados:', stats.total],
      ['Itens aprovados:', `${stats.ok} (${stats.total > 0 ? Math.round((stats.ok / stats.total) * 100) : 0}%)`],
      ['Itens com observações:', stats.minor],
      ['Itens que requerem atenção:', stats.major],
      ['Itens críticos:', stats.critical]
    ]

    this.doc.setFont('helvetica', 'normal')
    summaryData.forEach(([label, value]) => {
      this.checkPageBreak()
      this.doc.text(`• ${label}`, this.margin + 5, this.currentY)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(String(value), this.margin + 80, this.currentY)
      this.doc.setFont('helvetica', 'normal')
      this.currentY += this.lineHeight
    })

    this.currentY += this.lineHeight

    // Recomendações gerais
    if (stats.critical > 0) {
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(200, 0, 0)
      this.doc.text('⚠ ATENÇÃO: Foram identificados itens críticos que requerem ação imediata.', this.margin, this.currentY)
      this.doc.setTextColor(0, 0, 0)
      this.currentY += this.lineHeight * 2
    } else if (stats.major > 0) {
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(200, 100, 0)
      this.doc.text('⚠ Alguns itens requerem atenção e acompanhamento.', this.margin, this.currentY)
      this.doc.setTextColor(0, 0, 0)
      this.currentY += this.lineHeight * 2
    } else {
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(0, 150, 0)
      this.doc.text('✓ Imóvel em boas condições gerais.', this.margin, this.currentY)
      this.doc.setTextColor(0, 0, 0)
      this.currentY += this.lineHeight * 2
    }
  }

  generateInspectionDetails(inspections) {
    this.addTitle('DETALHES DA INSPEÇÃO')
    
    Object.entries(inspections).forEach(([envId, envInspections]) => {
      const environment = ENVIRONMENTS.find(env => env.id === envId)
      if (!environment || Object.keys(envInspections).length === 0) return

      this.checkPageBreak(20) // Garantir espaço para o ambiente
      
      // Título do ambiente
      this.doc.setFontSize(13)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(`${environment.name.toUpperCase()}`, this.margin, this.currentY)
      this.currentY += this.lineHeight * 1.5

      // Observações do ambiente
      Object.entries(envInspections)
        .sort(([,a], [,b]) => new Date(b.timestamp) - new Date(a.timestamp))
        .forEach(([key, item]) => {
          this.checkPageBreak(15) // Garantir espaço para a observação
          
          const config = INSPECTION_STATUS[item.status] || INSPECTION_STATUS.ok
          const category = INSPECTION_CATEGORIES.find(cat => cat.id === item.category)
          
          // Status e categoria
          this.doc.setFontSize(11)
          this.doc.setFont('helvetica', 'bold')
          
          // Definir cor baseada no status
          switch(item.status) {
            case 'critical':
              this.doc.setTextColor(200, 0, 0)
              break
            case 'major':
              this.doc.setTextColor(200, 100, 0)
              break
            case 'minor':
              this.doc.setTextColor(0, 100, 200)
              break
            default:
              this.doc.setTextColor(0, 150, 0)
          }
          
          this.doc.text(`${config.label} - ${category?.name || item.category}`, this.margin + 5, this.currentY)
          this.doc.setTextColor(0, 0, 0)
          this.currentY += this.lineHeight

          // Data
          this.doc.setFontSize(9)
          this.doc.setFont('helvetica', 'normal')
          this.doc.setTextColor(100, 100, 100)
          this.doc.text(new Date(item.timestamp).toLocaleString('pt-BR'), this.margin + 5, this.currentY)
          this.doc.setTextColor(0, 0, 0)
          this.currentY += this.lineHeight

          // Observação
          this.doc.setFontSize(10)
          this.doc.setFont('helvetica', 'normal')
          const observationLines = this.splitText(item.observation, this.pageWidth - (this.margin * 2) - 10)
          observationLines.forEach(line => {
            this.checkPageBreak()
            this.doc.text(line, this.margin + 5, this.currentY)
            this.currentY += this.lineHeight
          })

          // Fotos
          if (item.photos && item.photos.length > 0) {
            this.doc.setFontSize(9)
            this.doc.setTextColor(100, 100, 100)
            this.doc.text(`📷 ${item.photos.length} foto${item.photos.length > 1 ? 's' : ''} anexada${item.photos.length > 1 ? 's' : ''}`, this.margin + 5, this.currentY)
            this.doc.setTextColor(0, 0, 0)
            this.currentY += this.lineHeight
          }

          this.currentY += this.lineHeight * 0.5 // Espaço entre observações
        })

      this.currentY += this.lineHeight // Espaço entre ambientes
    })
  }

  generateConclusion(inspections) {
    this.addTitle('CONCLUSÃO')
    
    const stats = this.calculateStats(inspections)
    
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'normal')
    
    let conclusion = ''
    
    if (stats.critical > 0) {
      conclusion = `A vistoria identificou ${stats.critical} item${stats.critical > 1 ? 's' : ''} crítico${stats.critical > 1 ? 's' : ''} que requer${stats.critical === 1 ? '' : 'm'} atenção imediata. `
      conclusion += 'Recomenda-se a correção destes problemas antes da ocupação do imóvel.'
    } else if (stats.major > 0) {
      conclusion = `A vistoria identificou ${stats.major} item${stats.major > 1 ? 's' : ''} que requer${stats.major === 1 ? '' : 'm'} atenção. `
      conclusion += 'Recomenda-se o acompanhamento e correção destes itens em prazo adequado.'
    } else if (stats.minor > 0) {
      conclusion = `A vistoria identificou ${stats.minor} observação${stats.minor > 1 ? 'ões' : ''} menor${stats.minor > 1 ? 'es' : ''}. `
      conclusion += 'O imóvel encontra-se em boas condições gerais.'
    } else {
      conclusion = 'O imóvel encontra-se em excelentes condições, sem problemas identificados na vistoria.'
    }

    const conclusionLines = this.splitText(conclusion, this.pageWidth - (this.margin * 2))
    conclusionLines.forEach(line => {
      this.checkPageBreak()
      this.doc.text(line, this.margin, this.currentY)
      this.currentY += this.lineHeight
    })

    this.currentY += this.lineHeight * 2

    // Assinatura
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('_' + '_'.repeat(40), this.margin, this.currentY)
    this.currentY += this.lineHeight
    this.doc.text('Responsável pela Vistoria', this.margin, this.currentY)
    this.currentY += this.lineHeight
    this.doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, this.margin, this.currentY)
  }

  // Métodos auxiliares
  addTitle(title) {
    this.checkPageBreak(15)
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, this.margin, this.currentY)
    this.currentY += this.lineHeight * 2
  }

  addSection() {
    this.currentY += this.lineHeight * 2
  }

  addNewPage() {
    this.doc.addPage()
    this.currentY = this.margin
  }

  checkPageBreak(requiredSpace = 10) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.addNewPage()
    }
  }

  centerText(text, y) {
    const textWidth = this.doc.getTextWidth(text)
    const x = (this.pageWidth - textWidth) / 2
    this.doc.text(text, x, y)
  }

  splitText(text, maxWidth) {
    return this.doc.splitTextToSize(text, maxWidth)
  }

  calculateStats(inspections) {
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

  async save(filename) {
    if (!this.doc) {
      throw new Error('Nenhum documento foi gerado')
    }
    
    this.doc.save(filename || `vistoria-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  getBlob() {
    if (!this.doc) {
      throw new Error('Nenhum documento foi gerado')
    }
    
    return this.doc.output('blob')
  }
}

// Função auxiliar para gerar PDF
export const generateInspectionPDF = async (property, inspections, userProfile = {}) => {
  const generator = new PDFGenerator()
  const doc = await generator.generateReport(property, inspections, userProfile)
  
  const filename = `vistoria-${property.client.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`
  await generator.save(filename)
  
  return generator
}

