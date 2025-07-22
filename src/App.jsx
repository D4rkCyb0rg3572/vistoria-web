import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ThemeProvider from './components/ThemeProvider'
import Home from './pages/Home'
import PropertyInspection from './pages/PropertyInspection'
import EnvironmentInspection from './pages/EnvironmentInspection'
import Report from './pages/Report'
import History from './pages/History'
import Settings from './pages/Settings'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/imovel/:id" element={<PropertyInspection />} />
            <Route path="/imovel/:id/ambiente/:environmentId" element={<EnvironmentInspection />} />
            <Route path="/imovel/:id/relatorio" element={<Report />} />
            <Route path="/historico" element={<History />} />
            <Route path="/configuracoes" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App

