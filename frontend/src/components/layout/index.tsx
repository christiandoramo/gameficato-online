import { Outlet, NavLink } from 'react-router-dom'
import { useTheme } from '@/lib/contexts/themeContext'
import { Sun, Moon, Gamepad, Ticket, Gift, History, Store, LogOut } from 'lucide-react'

export default function Layout() {
  const { toggleTheme, theme } = useTheme()
  const navs = [
    { to: '/', label: 'Jogos', icon: <Gamepad size={20}/> },
    { to: '/cupons', label: 'Meus Cupons', icon: <Ticket size={20}/> },
    { to: '/loja', label: 'Loja de Cupons', icon: <Store size={20}/> },
    { to: '/historico-recompensas', label: 'Histórico de Recompensas', icon: <Gift size={20}/> },
    { to: '/historico-compras', label: 'Histórico de Compras', icon: <History size={20}/> },
  ]

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-primary text-white dark:bg-darkaccent flex flex-col justify-between">
        <div className="mt-4">
          {navs.map(({to,label,icon}) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-r-xl mx-2 my-1
                 ${isActive 
                   ? 'bg-secondary text-primary dark:bg-darkbg dark:text-darkaccent' 
                   : 'hover:bg-secondary/20'}`
              }
            >
              {icon}
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="px-4 pb-4 flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-secondary text-primary dark:bg-darkbg dark:text-darkaccent"
          >
            {theme === 'light' ? <Moon/> : <Sun/>}
          </button>
          <button className="p-2 rounded-full hover:bg-secondary/20">
            <LogOut size={20}/>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-secondary dark:bg-darkbg p-6">
        <Outlet />
      </main>
    </div>
  )
}
