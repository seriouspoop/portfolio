import { component$, Slot } from '@builder.io/qwik';

export const SectionTitle = component$(() => (
  <h2 class="text-2xl md:text-3xl font-mono font-bold text-white mb-8 flex items-center gap-3">
    <span class="text-emerald-500">➜</span> <Slot />
  </h2>
));

export const SkillTag = component$(({ skill }: { skill: string }) => (
  <span class="px-3 py-1 text-sm font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-950/20 rounded hover:bg-emerald-500/10 transition-colors cursor-default">
    {skill}
  </span>
));

export const Card = component$(({ class: className }: { class?: string }) => (
  <div class={`backdrop-blur-sm bg-zinc-900/60 border border-zinc-800 p-6 hover:border-emerald-500/50 transition-all duration-300 group rounded-lg ${className || ''}`}>
    <Slot />
  </div>
));

// We define icon map for SocialLink to use strings from DATA
import { GithubIcon, LinkedinIcon, MailIcon } from 'lucide-qwik';
export const SocialLink = component$(({ href, icon }: { href: string, icon: string }) => {
  const IconCmp = icon === 'Github' ? GithubIcon : icon === 'Linkedin' ? LinkedinIcon : MailIcon;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      class="p-3 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-900/20 rounded-full transition-all"
    >
      <IconCmp size={24} />
    </a>
  );
});
