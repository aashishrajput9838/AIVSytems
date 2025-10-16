import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative mt-16 bg-black text-white">
      {/* Watermark */}
      <div className="pointer-events-none absolute inset-x-0 -top-8 flex justify-center opacity-5 select-none">
        <div className="text-[20vw] leading-none font-extrabold">AIV</div>
      </div>

      <div className="relative z-10 mx-auto w-[95%] max-w-6xl px-4 py-16">
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
          {/* Menu */}
          <div>
            <div className="mb-4 text-xs uppercase text-gray-400">Menu</div>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
              <li><Link to="/capabilities" className="hover:underline">Capabilities</Link></li>
              <li><Link to="/insights" className="hover:underline">Insights</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Office */}
          <div>
            <div className="mb-4 text-xs uppercase text-gray-400">Office</div>
            <div className="space-y-1 text-sm text-gray-200">
              <div>AIV Systems</div>
              <div>Innovation Park</div>
              <div>Noida, Uttar Pradesh</div>
              <div>India</div>
            </div>
          </div>

          {/* Extras */}
          <div>
            <div className="mb-4 text-xs uppercase text-gray-400">Extras</div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Brandcheck sichern ↗</a></li>
              <li><a href="#" className="hover:underline">Webdesign Pakete ↗</a></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <div className="mb-4 text-xs uppercase text-gray-400">Socials</div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">LinkedIn</a></li>
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">TwitterX</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-white">Impressum</a>
            <a href="#" className="hover:text-white">Datenschutz</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
          <div>©{year}</div>
        </div>
      </div>
    </footer>
  )
}
