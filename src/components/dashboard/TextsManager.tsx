import { useState } from 'react';

interface TextBlock {
  id: string;
  key: string;
  value: string;
}

const defaultTexts: TextBlock[] = [
  { id: '1', key: 'hero_title', value: 'Hola, soy [Tu Nombre]' },
  { id: '2', key: 'hero_subtitle', value: 'Desarrollador Web' },
  { id: '3', key: 'about_description', value: 'Escribe aquí tu descripción...' },
  { id: '4', key: 'contact_email', value: 'tu@email.com' },
];

export default function TextsManager() {
  const [texts, setTexts] = useState<TextBlock[]>(defaultTexts);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleChange = (id: string, value: string) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, value } : t)));
  };

  const labelMap: Record<string, string> = {
    hero_title: 'Título principal (Hero)',
    hero_subtitle: 'Subtítulo (Hero)',
    about_description: 'Descripción (Sobre mí)',
    contact_email: 'Email de contacto',
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Textos del sitio</h2>

      <div className="space-y-4">
        {texts.map((text) => (
          <div
            key={text.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <label className="block text-sm font-medium text-slate-400 mb-2">
              {labelMap[text.key] || text.key}
              <span className="ml-2 text-xs text-slate-600 font-mono">{text.key}</span>
            </label>

            {editingId === text.id ? (
              <div className="space-y-3">
                <textarea
                  value={text.value}
                  onChange={(e) => handleChange(text.id, e.target.value)}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                />
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <div
                onClick={() => setEditingId(text.id)}
                className="bg-slate-800/50 rounded-lg px-4 py-2.5 text-slate-300 cursor-pointer hover:bg-slate-800 transition-colors"
              >
                {text.value}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-slate-600 text-sm mt-6">
        Haz clic en cualquier texto para editarlo.
      </p>
    </div>
  );
}
