import { useState } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
}

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });

  const handleSave = () => {
    if (!form.title.trim()) return;

    if (editing) {
      setPosts(posts.map((p) =>
        p.id === editing.id ? { ...p, title: form.title, content: form.content } : p
      ));
      setEditing(null);
    } else {
      const newPost: Post = {
        id: crypto.randomUUID(),
        title: form.title,
        content: form.content,
        published: false,
        createdAt: new Date().toISOString(),
      };
      setPosts([newPost, ...posts]);
    }
    setForm({ title: '', content: '' });
  };

  const handleEdit = (post: Post) => {
    setEditing(post);
    setForm({ title: post.title, content: post.content });
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const togglePublished = (id: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Publicaciones</h2>

      {/* Formulario */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          {editing ? 'Editar publicación' : 'Nueva publicación'}
        </h3>
        <input
          type="text"
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          placeholder="Contenido..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={6}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        />
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {editing ? 'Actualizar' : 'Crear'}
          </button>
          {editing && (
            <button
              onClick={() => { setEditing(null); setForm({ title: '', content: '' }); }}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      {posts.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No hay publicaciones aún. Crea la primera.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white font-semibold truncate">{post.title}</h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      post.published
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                    }`}
                  >
                    {post.published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2">{post.content}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => togglePublished(post.id)}
                  className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {post.published ? 'Ocultar' : 'Publicar'}
                </button>
                <button
                  onClick={() => handleEdit(post)}
                  className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-sm px-3 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
