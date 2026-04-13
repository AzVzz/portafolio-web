const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:4400';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  return res.json();
}

async function put<T>(path: string, data: T): Promise<void> {
  await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/api/uploads`, { method: 'POST', body: formData });
  const data = await res.json();
  return `${API_URL}${data.url}`;
}

// Hero
import type { HeroData } from './store';
export const fetchHero = () => get<HeroData>('/api/hero');
export const saveHero = (data: HeroData) => put('/api/hero', data);

// Experience
import type { Experience } from './store';
export const fetchExperience = () => get<Experience[]>('/api/experience');
export const saveExperience = (data: Experience[]) => put('/api/experience', data);

// Projects
import type { Project } from './store';
export const fetchProjects = () => get<Project[]>('/api/projects');
export const saveProjects = (data: Project[]) => put('/api/projects', data);
