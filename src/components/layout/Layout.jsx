import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Building, 
  FileText, 
  History, 
  Settings, 
  Menu, 
  X,
  ChevronRight,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ThemeToggle from '@/components/ThemeToggle'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Início', href: '/', icon: Home, current: location.pathname === '/' },
    { name: 'Histórico', href: '/historico', icon: History, current: location.pathname === '/historico' },
    { name: 'Configurações', href: '/configuracoes', icon: Settings, current: location.pathname === '/configuracoes' }
  ]

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ name: 'Início', href: '/' }]

    if (pathSegments.length > 0) {
      if (pathSegments[0] === 'imovel' && pathSegments[1]) {
        breadcrumbs.push({ name: 'Vistoria', href: `/imovel/${pathSegments[1]}` })
        
        if (pathSegments[2] === 'ambiente' && pathSegments[3]) {
          breadcrumbs.push({ name: 'Ambiente', href: location.pathname })
        } else if (pathSegments[2] === 'relatorio') {
          breadcrumbs.push({ name: 'Relatório', href: location.pathname })
        }
      } else if (pathSegments[0] === 'historico') {
        breadcrumbs.push({ name: 'Histórico', href: '/historico' })
      } else if (pathSegments[0] === 'configuracoes') {
        breadcrumbs.push({ name: 'Configurações', href: '/configuracoes' })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <Building className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Vistoria Digital</h1>
                <p className="text-xs text-muted-foreground">Sistema Profissional</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    item.current
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                    item.current ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                  {item.name}
                  {item.current && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Modo Escuro</span>
              </div>
              <ThemeToggle size="sm" />
            </div>
            
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Sistema Online</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Dados salvos localmente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center space-x-2">
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Link
                      to={crumb.href}
                      className={`transition-colors duration-200 ${
                        index === breadcrumbs.length - 1
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {crumb.name}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="hidden sm:flex">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Online
              </Badge>
              <ThemeToggle className="hidden lg:flex" />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

