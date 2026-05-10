export type ComponentType =
  | "hero"
  | "timeline"
  | "grid"
  | "experience_card"
  | "project_card"
  | "skill_grid"
  | "contact_section";

export type InteractionType = "expand" | "modal" | "drawer" | "link" | "none";

export type LayoutType = "vertical" | "horizontal" | "grid" | "masonry" | "carousel" | "categorized" | "tags" | "cloud";

export type SkillLevel = "expert" | "advanced" | "intermediate" | "beginner";

export type LinkType = "github" | "linkedin" | "email" | "demo" | "docs" | "live" | "external";

export interface BaseComponent {
  component: ComponentType;
  clickable?: boolean;
  interaction?: InteractionType;
}

export interface Link {
  type: LinkType;
  url: string;
  label?: string;
}

export interface Metric {
  label: string;
  value: string | number;
}

export interface Stat {
  label: string;
  value: string | number;
}

export interface Meta {
  name: string;
  description: string;
  theme: "light" | "dark" | "auto";
  accent_color?: string;
}

export interface ProfileConfig extends BaseComponent {
  component: "hero";
  name: string;
  role: string;
  tagline: string;
  avatar?: string;
  links: Link[];
}

export interface ExperienceCard extends BaseComponent {
  component: "experience_card";
  company: string;
  company_url?: string;
  role: string;
  period: string;
  location?: string;
  logo?: string;
  summary: string;
  details?: string[];
  tech: string[];
  metrics?: Metric[];
  include_in_resume?: boolean;
  resume_summary?: string;
  resume_highlights?: string[];
}

export interface ProjectCard extends BaseComponent {
  component: "project_card";
  name: string;
  tagline: string;
  icon: string;
  thumbnail?: string;
  summary: string;
  details?: string[];
  tech: string[];
  links?: Link[];
  stats?: Stat[];
  include_in_resume?: boolean;
  resume_priority?: number;
}

export interface SkillItem {
  name: string;
  level: SkillLevel;
  years?: number;
}

export interface SkillCategory {
  category: string;
  icon: string;
  items: SkillItem[];
}

export interface TimelineSection {
  id: string;
  title: string;
  component: "timeline";
  layout: "vertical" | "horizontal";
  items: ExperienceCard[];
}

export interface GridSection {
  id: string;
  title: string;
  component: "grid";
  layout: "grid" | "masonry" | "carousel";
  columns?: number;
  items: ProjectCard[];
}

export interface SkillGridSection {
  id: string;
  title: string;
  component: "skill_grid";
  layout: "categorized" | "tags" | "cloud";
  items: SkillCategory[];
}

export interface ContactSection {
  id: string;
  title: string;
  component: "contact_section";
  cta_text: string;
  cta_button: string;
  interaction: InteractionType;
  email: string;
  calendar_link?: string;
  response_time?: string;
}

export type Section = TimelineSection | GridSection | SkillGridSection | ContactSection;

export interface PortfolioConfig {
  meta: Meta;
  profile: ProfileConfig;
  sections: Section[];
}

export function isExperienceCard(item: any): item is ExperienceCard {
  return item.component === "experience_card";
}

export function isProjectCard(item: any): item is ProjectCard {
  return item.component === "project_card";
}

export function isTimelineSection(section: Section): section is TimelineSection {
  return section.component === "timeline";
}

export function isGridSection(section: Section): section is GridSection {
  return section.component === "grid";
}

export function isSkillGridSection(section: Section): section is SkillGridSection {
  return section.component === "skill_grid";
}

export function isContactSection(section: Section): section is ContactSection {
  return section.component === "contact_section";
}
