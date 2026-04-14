const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:4400';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: authHeaders(),
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  return res.json();
}

async function put<T>(path: string, data: T): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/api/uploads`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  const data = await res.json();
  return `${API_URL}${data.url}`;
}

// Auth
export async function login(user: string, password: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Error al iniciar sesión');
  }
  const { token } = await res.json();
  localStorage.setItem('auth_token', token);
  return token;
}

export function logout() {
  localStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
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
