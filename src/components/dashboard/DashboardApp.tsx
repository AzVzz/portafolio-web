import { useState } from 'react';
import Sidebar from './Sidebar';
import HeroManager from './HeroManager';
import PostsManager from './PostsManager';
import ProjectsManager from './ProjectsManager';
import TextsManager from './TextsManager';
import ExperienceManager from './ExperienceManager';

export default function DashboardApp() {
  const [activeSection, setActiveSection] = useState('hero');

  const renderSection = () => {
    switch (activeSection) {
      case 'hero':
        return <HeroManager />;
      case 'experience':
        return <ExperienceManager />;
      case 'posts':
        return <PostsManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'texts':
        return <TextsManager />;
      case 'settings':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Configuración</h2>
            <p className="text-slate-400">Próximamente...</p>
          </div>
        );
      default:
        return <PostsManager />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
