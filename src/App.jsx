import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './Home'
import Dashboard from './Dashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import HowItWorks from './pages/HowItWorks'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh">
        <header className="mx-auto w-full max-w-6xl px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-lg font-semibold">AIV</Link>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
              <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground">How it works</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
            </div>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App


