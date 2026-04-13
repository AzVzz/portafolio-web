import { useEffect, useState } from 'react';
import { type Experience } from '../lib/store';
import { fetchExperience } from '../lib/api';

export default function ExperienceSection() {
  const [items, setItems] = useState<Experience[]>([]);

  useEffect(() => {
    fetchExperience().then(setItems).catch(console.error);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Título */}
        <div className="flex items-center gap-3 mb-12">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
          <h2 className="text-3xl font-bold text-white">Experiencia laboral</h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-[7px] top-3 bottom-3 w-[2px] bg-slate-700" />

          <div className="space-y-12">
            {items.map((item) => (
              <div key={item.id} className="relative grid grid-cols-1 md:grid-cols-[300px_1fr] gap-x-8 gap-y-2 pl-10">
                {/* Punto */}
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-yellow-400 border-[3px] border-slate-950 z-10" />

                {/* Columna izquierda */}
                <div>
                  <h3 className="text-yellow-400 font-bold text-lg leading-tight">{item.role}</h3>
                  <p className="text-white font-semibold mt-0.5">{item.company}</p>
                  <p className="text-slate-400 text-sm mt-0.5">{item.date}</p>
                </div>

                {/* Columna derecha */}
                <div>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-yellow-400 font-bold text-sm mt-3 hover:text-yellow-300 transition-colors"
                    >
                      visitar página web
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
