import { useState, useEffect, useRef, useCallback } from 'react';
import { iconOptions, type HeroData, type SocialLink } from '../../lib/store';
import { fetchHero, saveHero, uploadFile } from '../../lib/api';
import SocialIcon from '../icons/SocialIcon';

const defaultHero: HeroData = {
  photo: '', title: '', badge: '', description: '', links: [],
};

export default function HeroManager() {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const originalData = useRef<string>('');

  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [linkForm, setLinkForm] = useState({ icon: 'globe', label: '', url: '' });

  useEffect(() => {
    const cached = localStorage.getItem('dashboard_hero_draft');
    fetchHero().then((data) => {
      const serverData = data || defaultHero;
      originalData.current = JSON.stringify(serverData);
      if (cached && cached !== JSON.stringify(serverData)) {
        const useDraft = window.confirm('Tienes cambios sin guardar. ¿Deseas restaurarlos?');
        if (useDraft) {
          setHero(JSON.parse(cached));
          setHasChanges(true);
        } else {
          setHero(serverData);
          localStorage.removeItem('dashboard_hero_draft');
        }
      } else {
        setHero(serverData);
      }
      setLoading(false);
    }).catch(console.error);
  }, []);

  const updateHero = useCallback((newHero: HeroData) => {
    setHero(newHero);
    setHasChanges(JSON.stringify(newHero) !== originalData.current);
    localStorage.setItem('dashboard_hero_draft', JSON.stringify(newHero));
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleSave = async () => {
    await saveHero(hero);
    originalData.current = JSON.stringify(hero);
    setHasChanges(false);
    localStorage.removeItem('dashboard_hero_draft');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    updateHero({ ...hero, photo: url });
  };

  if (loading) return <p className="text-slate-400">Cargando...</p>;

  // Links CRUD
  const handleSaveLink = () => {
    if (!linkForm.label.trim() || !linkForm.url.trim()) return;

    if (editingLink) {
      updateHero({
        ...hero,
        links: hero.links.map((l) =>
          l.id === editingLink.id ? { ...l, icon: linkForm.icon, label: linkForm.label, url: linkForm.url } : l
        ),
      });
      setEditingLink(null);
    } else {
      updateHero({
        ...hero,
        links: [...hero.links, { id: crypto.randomUUID(), icon: linkForm.icon, label: linkForm.label, url: linkForm.url }],
      });
    }
    setLinkForm({ icon: 'globe', label: '', url: '' });
  };

  const handleEditLink = (link: SocialLink) => {
    setEditingLink(link);
    setLinkForm({ icon: link.icon, label: link.label, url: link.url });
  };

  const handleDeleteLink = (id: string) => {
    updateHero({ ...hero, links: hero.links.filter((l) => l.id !== id) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Hero / Encabezado</h2>
        <button
          onClick={handleSave}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            saved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {saved ? 'Guardado!' : 'Guardar cambios'}
        </button>
      </div>

      {/* Foto */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Foto de perfil</h3>
        <div className="flex items-center gap-6">
          <img src={hero.photo} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-slate-700" />
          <div>
            <label className="inline-block bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg cursor-pointer text-sm transition-colors">
              Cambiar foto
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
            <p className="text-slate-500 text-xs mt-2">O usa una URL:</p>
            <input
              type="text"
              value={hero.photo}
              onChange={(e) => updateHero({ ...hero, photo: e.target.value })}
              className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="/avatar.webp"
            />
          </div>
        </div>
      </div>

      {/* Textos */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Textos</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Título</label>
            <input
              type="text"
              value={hero.title}
              onChange={(e) => updateHero({ ...hero, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Badge (etiqueta)</label>
            <input
              type="text"
              value={hero.badge}
              onChange={(e) => updateHero({ ...hero, badge: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Disponible para trabajar"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Descripción</label>
            <textarea
              value={hero.description}
              onChange={(e) => updateHero({ ...hero, description: e.target.value })}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>
        </div>
      </div>

      {/* Links / Tarjetas */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Tarjetas de contacto</h3>

        {/* Formulario link */}
        <div className="bg-slate-800/50 rounded-lg p-4 mb-5">
          <p className="text-sm text-slate-400 mb-3">{editingLink ? 'Editar tarjeta' : 'Agregar tarjeta'}</p>
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-3 items-end">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Icono</label>
              <select
                value={linkForm.icon}
                onChange={(e) => setLinkForm({ ...linkForm, icon: e.target.value })}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Texto</label>
              <input
                type="text"
                value={linkForm.label}
                onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                placeholder="Github"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">URL</label>
              <input
                type="text"
                value={linkForm.url}
                onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                placeholder="https://github.com/usuario"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSaveLink}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {editingLink ? 'Actualizar' : 'Agregar'}
            </button>
            {editingLink && (
              <button
                onClick={() => { setEditingLink(null); setLinkForm({ icon: 'globe', label: '', url: '' }); }}
                className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Lista de links */}
        <div className="space-y-2">
          {hero.links.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-3 bg-slate-800/40 rounded-lg px-4 py-3"
            >
              <SocialIcon name={link.icon} className="w-5 h-5 text-slate-300 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-white text-sm font-medium">{link.label}</span>
                <span className="text-slate-500 text-xs ml-2 truncate">{link.url}</span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => handleEditLink(link)} className="text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
                  Editar
                </button>
                <button onClick={() => handleDeleteLink(link.id)} className="text-xs px-2.5 py-1 rounded bg-red-900/30 hover:bg-red-900/50 text-red-400 transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {hero.links.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-4">No hay tarjetas. Agrega una arriba.</p>
          )}
        </div>
      </div>
    </div>
  );
}
