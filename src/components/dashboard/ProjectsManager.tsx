import { useState, useEffect, useRef, useCallback } from 'react';
import { techCatalog, type Project, type TechTool } from '../../lib/store';
import { fetchProjects, saveProjects, uploadFile } from '../../lib/api';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: '', description: '', image: '', url: '' });
  const [selectedTools, setSelectedTools] = useState<TechTool[]>([]);
  const [toolSearch, setToolSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const originalData = useRef<string>('');

  useEffect(() => {
    const cached = localStorage.getItem('dashboard_projects_draft');
    fetchProjects().then((data) => {
      const serverData = data || [];
      originalData.current = JSON.stringify(serverData);
      if (cached && cached !== JSON.stringify(serverData)) {
        const useDraft = window.confirm('Tienes cambios sin guardar en Proyectos. ¿Deseas restaurarlos?');
        if (useDraft) {
          setProjects(JSON.parse(cached));
          setHasChanges(true);
        } else {
          setProjects(serverData);
          localStorage.removeItem('dashboard_projects_draft');
        }
      } else {
        setProjects(serverData);
      }
    }).catch(console.error);
  }, []);

  const updateProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
    setHasChanges(JSON.stringify(newProjects) !== originalData.current);
    localStorage.setItem('dashboard_projects_draft', JSON.stringify(newProjects));
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) { e.preventDefault(); }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleSave = async () => {
    await saveProjects(projects);
    originalData.current = JSON.stringify(projects);
    setHasChanges(false);
    localStorage.removeItem('dashboard_projects_draft');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAdd = () => {
    if (!form.title.trim()) return;

    if (editing) {
      updateProjects(
        projects.map((p) =>
          p.id === editing.id
            ? { ...p, title: form.title, description: form.description, image: form.image, url: form.url, tools: selectedTools }
            : p
        )
      );
      setEditing(null);
    } else {
      updateProjects([
        ...projects,
        {
          id: crypto.randomUUID(),
          title: form.title,
          description: form.description,
          image: form.image,
          url: form.url,
          tools: selectedTools,
        },
      ]);
    }
    setForm({ title: '', description: '', image: '', url: '' });
    setSelectedTools([]);
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setForm({ title: project.title, description: project.description, image: project.image, url: project.url });
    setSelectedTools(project.tools);
  };

  const handleDelete = (id: string) => {
    updateProjects(projects.filter((p) => p.id !== id));
  };

  const toggleTool = (tool: TechTool) => {
    if (selectedTools.some((t) => t.name === tool.name)) {
      setSelectedTools(selectedTools.filter((t) => t.name !== tool.name));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const filteredCatalog = techCatalog.filter((t) =>
    t.name.toLowerCase().includes(toolSearch.toLowerCase())
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    setForm({ ...form, image: url });
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Proyectos</h2>
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
          {editing ? 'Editar proyecto' : 'Nuevo proyecto'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Título</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Nombre del proyecto"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">URL del proyecto (opcional)</label>
            <input
              type="text"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://miproyecto.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Breve descripción del proyecto..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        {/* Imagen */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">Imagen del proyecto</label>
          <div className="flex items-center gap-4">
            {form.image && (
              <img src={form.image} alt="Preview" className="w-24 h-16 rounded-lg object-cover border border-slate-700" />
            )}
            <div className="flex-1">
              <label className="inline-block bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg cursor-pointer text-sm transition-colors">
                Subir imagen
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="O pega una URL de imagen..."
              />
            </div>
          </div>
        </div>

        {/* Herramientas */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-2">Herramientas / Tecnologías</label>

          {/* Seleccionadas */}
          {selectedTools.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => toggleTool(tool)}
                  className="inline-flex items-center gap-1.5 bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 text-xs px-2.5 py-1.5 rounded-full hover:bg-red-900/30 hover:border-red-500/50 hover:text-red-300 transition-colors"
                >
                  <img src={tool.icon} alt={tool.name} className="w-4 h-4" />
                  {tool.name}
                  <span className="ml-0.5">×</span>
                </button>
              ))}
            </div>
          )}

          {/* Buscador */}
          <input
            type="text"
            value={toolSearch}
            onChange={(e) => setToolSearch(e.target.value)}
            placeholder="Buscar tecnología..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          />

          {/* Catálogo */}
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-800/30 rounded-lg">
            {filteredCatalog.map((tool) => {
              const isSelected = selectedTools.some((t) => t.name === tool.name);
              return (
                <button
                  key={tool.name}
                  onClick={() => toggleTool(tool)}
                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <img src={tool.icon} alt={tool.name} className="w-4 h-4" />
                  {tool.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {editing ? 'Actualizar' : 'Crear'}
          </button>
          {editing && (
            <button
              onClick={() => {
                setEditing(null);
                setForm({ title: '', description: '', image: '', url: '' });
                setSelectedTools([]);
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Lista de proyectos */}
      {projects.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No hay proyectos aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 bg-slate-800/50 flex items-center justify-center">
                  <span className="text-slate-600 text-sm">Sin imagen</span>
                </div>
              )}
              <div className="p-4">
                <h4 className="text-white font-semibold mb-1">{project.title}</h4>
                <p className="text-slate-400 text-sm line-clamp-2 mb-3">{project.description}</p>
                {project.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tools.map((tool) => (
                      <img key={tool.name} src={tool.icon} alt={tool.name} title={tool.name} className="w-5 h-5" />
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(project)} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 transition-colors">
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
