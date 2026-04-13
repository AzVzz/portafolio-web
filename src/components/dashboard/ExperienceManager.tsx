import { useState, useEffect } from 'react';
import { type Experience } from '../../lib/store';
import { fetchExperience, saveExperience } from '../../lib/api';

export default function ExperienceManager() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState({ role: '', company: '', date: '', description: '', url: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchExperience().then(setItems).catch(console.error);
  }, []);

  const handleSave = async () => {
    await saveExperience(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAdd = () => {
    if (!form.role.trim() || !form.company.trim()) return;

    if (editing) {
      setItems(items.map((i) =>
        i.id === editing.id
          ? { ...i, role: form.role, company: form.company, date: form.date, description: form.description, url: form.url }
          : i
      ));
      setEditing(null);
    } else {
      setItems([
        ...items,
        {
          id: crypto.randomUUID(),
          role: form.role,
          company: form.company,
          date: form.date,
          description: form.description,
          url: form.url,
        },
      ]);
    }
    setForm({ role: '', company: '', date: '', description: '', url: '' });
  };

  const handleEdit = (item: Experience) => {
    setEditing(item);
    setForm({ role: item.role, company: item.company, date: item.date, description: item.description, url: item.url });
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const copy = [...items];
    [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
    setItems(copy);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Experiencia laboral</h2>
        <button
          onClick={handleSave}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            saved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {saved ? 'Guardado!' : 'Guardar cambios'}
        </button>
      </div>

      {/* Formulario */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          {editing ? 'Editar experiencia' : 'Agregar experiencia'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Rol / Título</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Recreación de página web"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Empresa</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Nombre de la empresa"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Fecha</label>
            <input
              type="text"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="Noviembre 2023 a Abril 2025"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">URL (opcional)</label>
            <input
              type="text"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://ejemplo.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Describe tu rol y responsabilidades..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {editing ? 'Actualizar' : 'Agregar'}
          </button>
          {editing && (
            <button
              onClick={() => { setEditing(null); setForm({ role: '', company: '', date: '', description: '', url: '' }); }}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      {items.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No hay experiencias aún.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-yellow-400 font-bold">{item.role}</h4>
                  <p className="text-white font-medium text-sm">{item.company}</p>
                  <p className="text-slate-500 text-xs">{item.date}</p>
                  <p className="text-slate-400 text-sm mt-2 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="text-xs px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-30">
                    ↑
                  </button>
                  <button onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className="text-xs px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-30">
                    ↓
                  </button>
                  <button onClick={() => handleEdit(item)} className="text-xs px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs px-3 py-1.5 rounded bg-red-900/30 hover:bg-red-900/50 text-red-400 transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
