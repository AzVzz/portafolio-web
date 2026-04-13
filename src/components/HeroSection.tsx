import { useEffect, useState } from 'react';
import { type HeroData } from '../lib/store';
import { fetchHero } from '../lib/api';
import SocialIcon from './icons/SocialIcon';

export default function HeroSection() {
  const [hero, setHero] = useState<HeroData | null>(null);

  useEffect(() => {
    fetchHero().then(setHero).catch(console.error);
  }, []);

  if (!hero) return null;

  return (
    <section className="min-h-screen flex items-center px-6 py-20">
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <img
            src={hero.photo}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover border-2 border-slate-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white">{hero.title}</h1>
          {hero.badge && (
            <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-full">
              {hero.badge}
            </span>
          )}
        </div>

        <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
          {hero.description}
        </p>

        <div className="flex flex-wrap gap-3">
          {hero.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.url.startsWith('mailto:') || link.url.startsWith('/') ? undefined : '_blank'}
              rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-200 px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              <SocialIcon name={link.icon} />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
