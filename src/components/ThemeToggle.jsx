import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './ThemeProvider'

const ThemeToggle = ({ variant = "outline", size = "default" }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className="relative overflow-hidden transition-all duration-300 hover:scale-105"
      title={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <div className="relative flex items-center justify-center">
        <Sun 
          className={`h-4 w-4 transition-all duration-300 ${
            theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon 
          className={`absolute h-4 w-4 transition-all duration-300 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}

export default ThemeToggle

