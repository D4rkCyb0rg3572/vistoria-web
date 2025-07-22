# 🏠 Vistoria Digital - Sistema Web de Vistoria de Imóveis

Sistema profissional para vistoria de imóveis com checklist detalhado, upload de fotos e geração automática de relatórios em PDF.

## 🚀 Funcionalidades

### ✅ **Cadastro de Imóveis**
- Formulário completo com validação
- Tipos: Apartamento, Casa, Comercial, Terreno
- Dados: Cliente, área, quartos, endereço, data

### 🏗️ **Sistema de Vistoria**
- 9 ambientes pré-configurados (Sala, Cozinha, Quartos, Banheiros, etc.)
- 6 categorias de inspeção por ambiente
- Sistema de status: Aprovado, Observação, Atenção, Crítico

### 📸 **Upload de Fotos**
- Captura via câmera ou upload de arquivo
- Galeria integrada por observação
- Armazenamento local no navegador

### 📄 **Relatórios PDF**
- Geração automática de relatórios profissionais
- Resumo executivo com estatísticas
- Detalhes completos por ambiente
- Download direto pelo navegador

### 🎨 **Interface Moderna**
- Tema claro/escuro com alternância suave
- Design responsivo (desktop e mobile)
- Animações e transições elegantes
- Sidebar com navegação intuitiva

### 💾 **Armazenamento Local**
- Dados salvos no localStorage do navegador
- Múltiplas vistorias suportadas
- Histórico completo com filtros
- Sem necessidade de servidor

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização e responsividade
- **Shadcn/UI** - Componentes de interface
- **Lucide React** - Ícones modernos
- **jsPDF** - Geração de relatórios PDF
- **React Router** - Navegação entre páginas

## 📦 Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd vistoria-web

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm run dev
```

### Build para Produção
```bash
# Gerar build otimizado
pnpm run build

# Visualizar build localmente
pnpm run preview
```

## 🎯 Como Usar

### 1. **Criar Nova Vistoria**
- Acesse a página inicial
- Preencha os dados do imóvel
- Clique em "Iniciar Vistoria"

### 2. **Realizar Inspeção**
- Selecione um ambiente para inspecionar
- Navegue pelas categorias (Pisos, Portas, Elétrica, etc.)
- Adicione observações e fotos
- Marque o status apropriado

### 3. **Gerar Relatório**
- Acesse a página de relatório
- Revise o resumo executivo
- Clique em "Gerar PDF" para download

### 4. **Gerenciar Histórico**
- Acesse "Histórico" na sidebar
- Use filtros para buscar vistorias
- Abra ou gere relatórios de vistorias anteriores

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🎨 Temas

### Tema Claro
- Fundo branco/cinza claro
- Texto escuro
- Cores vibrantes para status

### Tema Escuro
- Fundo escuro/preto
- Texto claro
- Cores suaves para melhor contraste

## 📊 Estrutura de Dados

### Imóvel
```javascript
{
  id: "prop_timestamp",
  client: "Nome do Cliente",
  propertyType: "apartamento",
  area: 120,
  floors: 2,
  rooms: 3,
  address: "Endereço completo",
  inspectionDate: "2025-07-22",
  createdAt: timestamp
}
```

### Observação
```javascript
{
  category: "pisos",
  status: "ok|minor|major|critical",
  observation: "Texto da observação",
  photos: ["base64_image1", "base64_image2"],
  timestamp: timestamp
}
```

## 🔧 Configurações

### Ambientes Disponíveis
- Sala de Estar
- Cozinha
- Quarto Principal
- Quarto 2
- Banheiro Social
- Banheiro Suíte
- Varanda/Sacada
- Garagem
- Áreas Comuns

### Categorias de Inspeção
- Pisos e Azulejos
- Portas e Janelas
- Pintura e Acabamentos
- Instalações Elétricas
- Instalações Hidráulicas
- Outros

### Status de Inspeção
- **Aprovado** (Verde) - Item em perfeitas condições
- **Observação** (Azul) - Pequenos detalhes a observar
- **Atenção** (Amarelo) - Requer acompanhamento
- **Crítico** (Vermelho) - Ação imediata necessária

## 🚀 Deploy

### Opções de Deploy
1. **Netlify** - Arraste a pasta `dist` após build
2. **Vercel** - Conecte o repositório Git
3. **GitHub Pages** - Configure workflow de deploy
4. **Servidor próprio** - Sirva arquivos estáticos

### Configuração de Build
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 📝 Licença

Este projeto foi desenvolvido como sistema profissional de vistoria de imóveis.

## 🤝 Suporte

Para dúvidas ou suporte:
- Consulte a documentação
- Verifique os exemplos de uso
- Entre em contato com o desenvolvedor

---

**Vistoria Digital** - Sistema profissional para vistoria de imóveis com tecnologia moderna e interface intuitiva.

