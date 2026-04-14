export interface SocialLink {
  id: string;
  icon: string;
  label: string;
  url: string;
}

export interface HeroData {
  photo: string;
  title: string;
  badge: string;
  description: string;
  links: SocialLink[];
}

const HERO_KEY = 'portfolio_hero';

const defaultHero: HeroData = {
  photo: '/avatar.webp',
  title: 'Hola!, Soy Azael',
  badge: 'Disponible para trabajar',
  description:
    '+3 años de experiencia. Project Manager con base sólida en desarrollo de aplicaciones Full-Stack y páginas web.',
  links: [
    { id: '1', icon: 'github', label: 'Github', url: 'https://github.com' },
    { id: '2', icon: 'linkedin', label: 'Linkedin', url: 'https://linkedin.com' },
    { id: '3', icon: 'mail', label: 'azael@carrizales.dev', url: 'mailto:azael@carrizales.dev' },
    { id: '4', icon: 'download', label: 'CV Azael', url: '/cv-azael.pdf' },
  ],
};

export function getHeroData(): HeroData {
  if (typeof window === 'undefined') return defaultHero;
  const stored = localStorage.getItem(HERO_KEY);
  if (!stored) return defaultHero;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultHero;
  }
}

export function saveHeroData(data: HeroData): void {
  localStorage.setItem(HERO_KEY, JSON.stringify(data));
}

// ── Experience ──

export interface Experience {
  id: string;
  role: string;
  company: string;
  date: string;
  description: string;
  url: string;
}

const EXPERIENCE_KEY = 'portfolio_experience';

const defaultExperience: Experience[] = [
  {
    id: '1',
    role: 'Recreación de página web',
    company: 'Residente. Food&Drink Media',
    date: 'Actualmente',
    description:
      'Líder de equipo en el desarrollo de la página web de la revista Residente: Food & Drink Media. Desempeño funciones de Project Manager y programador, gestionando y coordinando el equipo de desarrollo para garantizar la máxima eficiencia en los proyectos, desde la planificación hasta la producción.',
    url: '',
  },
  {
    id: '2',
    role: 'Creación página web y correos',
    company: '3G-Logistics',
    date: 'Septiembre 2024',
    description:
      'Trabajé como desarrollador freelance 3G-Logistics diseñando y desarrollando su página web informativa utilizando React y Vite, encargandome de darle un diseño moderno que refleja la identidad de la empresa al igual de configurarle el dominio y los correos de la empresa.',
    url: '',
  },
  {
    id: '3',
    role: 'Desarrollador Web',
    company: 'Fama-technology',
    date: 'Noviembre 2023 a Abril 2025',
    description:
      'Responsable en mantener las páginas, dominios y correos en orden y procurar fallas futuras, empezando a trabajar ahi por soporte técnico.',
    url: '',
  },
];

export function getExperienceData(): Experience[] {
  if (typeof window === 'undefined') return defaultExperience;
  const stored = localStorage.getItem(EXPERIENCE_KEY);
  if (!stored) return defaultExperience;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultExperience;
  }
}

export function saveExperienceData(data: Experience[]): void {
  localStorage.setItem(EXPERIENCE_KEY, JSON.stringify(data));
}

// ── Projects ──

export interface TechTool {
  name: string;
  icon: string; // URL to SVG from svgl.app
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  tools: TechTool[];
}

const PROJECTS_KEY = 'portfolio_projects';

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Full-Stack',
    description: 'Tienda en línea con carrito de compras, pasarela de pagos y panel de administración.',
    image: '',
    url: '',
    tools: [
      { name: 'React', icon: 'https://svgl.app/library/react_dark.svg' },
      { name: 'Node.js', icon: 'https://svgl.app/library/nodejs.svg' },
      { name: 'MongoDB', icon: 'https://svgl.app/library/mongodb-icon-dark.svg' },
      { name: 'Tailwind CSS', icon: 'https://svgl.app/library/tailwindcss.svg' },
    ],
  },
  {
    id: '2',
    title: 'Dashboard Analytics',
    description: 'Panel de métricas en tiempo real con gráficas interactivas y reportes automatizados.',
    image: '',
    url: '',
    tools: [
      { name: 'Next.js', icon: 'https://svgl.app/library/nextjs_icon_dark.svg' },
      { name: 'TypeScript', icon: 'https://svgl.app/library/typescript.svg' },
      { name: 'PostgreSQL', icon: 'https://svgl.app/library/postgresql.svg' },
      { name: 'Prisma', icon: 'https://svgl.app/library/prisma_dark.svg' },
    ],
  },
];

export function getProjectsData(): Project[] {
  if (typeof window === 'undefined') return defaultProjects;
  const stored = localStorage.getItem(PROJECTS_KEY);
  if (!stored) return defaultProjects;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultProjects;
  }
}

export function saveProjectsData(data: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(data));
}

// Catálogo de herramientas con iconos de svgl.app (dark mode)
export const techCatalog: TechTool[] = [
  { name: 'React', icon: 'https://svgl.app/library/react_dark.svg' },
  { name: 'Next.js', icon: 'https://svgl.app/library/nextjs_icon_dark.svg' },
  { name: 'Vue', icon: 'https://svgl.app/library/vue.svg' },
  { name: 'Angular', icon: 'https://svgl.app/library/angular.svg' },
  { name: 'Svelte', icon: 'https://svgl.app/library/svelte.svg' },
  { name: 'Astro', icon: 'https://svgl.app/library/astro-icon-dark.svg' },
  { name: 'Node.js', icon: 'https://svgl.app/library/nodejs.svg' },
  { name: 'Express', icon: 'https://svgl.app/library/expressjs_dark.svg' },
  { name: 'TypeScript', icon: 'https://svgl.app/library/typescript.svg' },
  { name: 'JavaScript', icon: 'https://svgl.app/library/javascript.svg' },
  { name: 'Python', icon: 'https://svgl.app/library/python.svg' },
  { name: 'HTML5', icon: 'https://svgl.app/library/html5.svg' },
  { name: 'CSS', icon: 'https://svgl.app/library/css.svg' },
  { name: 'Tailwind CSS', icon: 'https://svgl.app/library/tailwindcss.svg' },
  { name: 'MongoDB', icon: 'https://svgl.app/library/mongodb-icon-dark.svg' },
  { name: 'PostgreSQL', icon: 'https://svgl.app/library/postgresql.svg' },
  { name: 'MySQL', icon: 'https://svgl.app/library/mysql-icon-dark.svg' },
  { name: 'Firebase', icon: 'https://svgl.app/library/firebase.svg' },
  { name: 'Supabase', icon: 'https://svgl.app/library/supabase.svg' },
  { name: 'Prisma', icon: 'https://svgl.app/library/prisma_dark.svg' },
  { name: 'Docker', icon: 'https://svgl.app/library/docker.svg' },
  { name: 'Git', icon: 'https://svgl.app/library/git.svg' },
  { name: 'GitHub', icon: 'https://svgl.app/library/github_dark.svg' },
  { name: 'Vite', icon: 'https://svgl.app/library/vite.svg' },
  { name: 'GraphQL', icon: 'https://svgl.app/library/graphql.svg' },
  { name: 'Redux', icon: 'https://svgl.app/library/redux.svg' },
  { name: 'AWS', icon: 'https://svgl.app/library/aws_dark.svg' },
  { name: 'Vercel', icon: 'https://svgl.app/library/vercel_dark.svg' },
  { name: 'Flutter', icon: 'https://svgl.app/library/flutter.svg' },
  { name: 'Figma', icon: 'https://svgl.app/library/figma.svg' },
  { name: 'Stripe', icon: 'https://svgl.app/library/stripe.svg' },
  { name: 'MariaDB', icon: 'https://svgl.app/library/mariadb.svg' },
];

// ── Icons ──

export const iconOptions = [
  'github',
  'linkedin',
  'mail',
  'download',
  'twitter',
  'globe',
  'phone',
  'instagram',
  'youtube',
  'discord',
] as const;

export type IconName = (typeof iconOptions)[number];
