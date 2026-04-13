import { useState } from 'react';

const navItems = [
  { label: 'Hero', key: 'hero', icon: '🏠' },
  { label: 'Experiencia', key: 'experience', icon: '💼' },
  { label: 'Publicaciones', key: 'posts', icon: '📝' },
  { label: 'Proyectos', key: 'projects', icon: '💼' },
  { label: 'Textos', key: 'texts', icon: '📄' },
  { label: 'Configuración', key: 'settings', icon: '⚙️' },
];

interface SidebarProps {
  activeSection: string;
  onNavigate: (key: string) => void;
}

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 min-h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!collapsed && <span className="text-lg font-bold text-white">Dashboard</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="p-2 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeSection === item.key
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <div className="absolute bottom-4 left-4">
          <a
            href="/"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Volver al portafolio
          </a>
        </div>
      )}
    </aside>
  );
}
