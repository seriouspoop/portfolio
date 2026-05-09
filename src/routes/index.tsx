import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { portfolioData } from 'virtual:portfolio-data';
import { ThreeBackground } from '../components/three-background';
import { LoadBalancerGame } from '../components/load-balancer-game';
import { SectionTitle, SkillTag, SocialLink } from '../components/ui-sections';
import { isTimelineSection, isGridSection, isSkillGridSection } from '../types/components';

const cardBase = 'backdrop-blur-sm bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 group rounded-lg';

export default component$(() => {
  const loaded = useSignal(false);

  useVisibleTask$(() => {
    setTimeout(() => loaded.value = true, 100);
  });

  return (
    <div class="relative min-h-screen bg-[#050505] text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden font-sans">
      <ThreeBackground />

      <main class="relative z-10 max-w-5xl mx-auto px-6 py-20 lg:py-32 flex flex-col gap-32">

        {/* HERO */}
        <section class={`flex flex-col items-start gap-6 transition-all duration-1000 transform ${loaded.value ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 text-xs font-mono mb-4">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Online
          </div>

          <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-none">
            {portfolioData.profile.name}
          </h1>

          <p class="text-xl md:text-2xl text-zinc-400 max-w-2xl font-light">
            {portfolioData.profile.tagline}
          </p>

          <div class="flex gap-4 mt-6">
            {portfolioData.profile.links.map((link) => (
              <SocialLink
                key={link.url}
                href={link.url}
                icon={link.type === 'github' ? 'Github' : link.type === 'linkedin' ? 'Linkedin' : 'Mail'}
              />
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section class={`transition-all duration-1000 delay-200 transform ${loaded.value ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {(() => {
            const experienceSection = portfolioData.sections.find(s => s.id === 'experience');
            if (!experienceSection || !isTimelineSection(experienceSection)) return null;
            return (
              <>
                <SectionTitle>{experienceSection.title}</SectionTitle>
                <div class="space-y-6">
                  {experienceSection.items.map((job, idx) => (
                    <div key={idx} class={`${cardBase} p-6 relative overflow-hidden`}>
                      {job.logo && (
                        <img src={job.logo} alt={job.company} width="40" height="40" class="absolute top-4 right-4 w-10 h-10 object-contain opacity-40 group-hover:opacity-70 transition-opacity" />
                      )}
                      <div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 class="text-xl font-bold text-white">{job.role}</h3>
                        <span class="font-mono text-sm text-emerald-500/80">{job.period}</span>
                      </div>
                      <div class="text-lg text-zinc-400 font-medium mb-4">
                        {job.company_url
                          ? <a href={job.company_url} target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors">{job.company}</a>
                          : job.company}
                        {job.location && <span class="text-zinc-600 font-normal text-sm ml-2">· {job.location}</span>}
                      </div>
                      <p class="text-zinc-400 mb-4 leading-relaxed max-w-3xl">{job.summary}</p>
                      <div class="flex flex-wrap gap-2">
                        {job.tech.map((t, i) => (
                          <span key={i} class="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </section>

        {/* PROJECTS */}
        <section class={`transition-all duration-1000 delay-300 transform ${loaded.value ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {(() => {
            const projectsSection = portfolioData.sections.find(s => s.id === 'projects');
            if (!projectsSection || !isGridSection(projectsSection)) return null;
            return (
              <>
                <SectionTitle>{projectsSection.title}</SectionTitle>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projectsSection.items.map((project, idx) => (
                    <div key={idx} class={`${cardBase} p-6 h-full flex flex-col`}>
                      <h3 class="text-lg font-bold text-white mb-4">{project.name}</h3>
                      <p class="text-zinc-400 mb-6 flex-grow">{project.summary}</p>
                      <div class="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
                        {project.tech.map((t, i) => (
                          <span key={i} class="text-xs font-mono text-zinc-500">#{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </section>

        {/* SKILLS */}
        <section class={`transition-all duration-1000 delay-500 transform ${loaded.value ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {(() => {
            const skillsSection = portfolioData.sections.find(s => s.id === 'skills');
            if (!skillsSection || !isSkillGridSection(skillsSection)) return null;
            return (
              <>
                <SectionTitle>{skillsSection.title}</SectionTitle>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {skillsSection.items.map((grp, idx) => (
                    <div key={idx}>
                      <h3 class="text-emerald-500/80 font-mono text-xs mb-3 uppercase tracking-wider border-l-2 border-emerald-500/30 pl-3">
                        {grp.category}
                      </h3>
                      <div class="flex flex-wrap gap-2">
                        {grp.items.map((skill, sIdx) => (
                          <SkillTag key={sIdx} skill={skill.name} level={skill.level} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </section>

        {/* GAME */}
        <section class={`transition-all duration-1000 delay-700 transform ${loaded.value ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <SectionTitle>System Maintenance</SectionTitle>
          <div class="w-full">
            <LoadBalancerGame />
          </div>
        </section>

        <footer class="text-center pt-20 pb-10 text-zinc-600 text-sm font-mono border-t border-zinc-900/50">
          <p>© {new Date().getFullYear()} {portfolioData.profile.name}. Systems Online.</p>
        </footer>

      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: portfolioData.profile.name,
  meta: [
    {
      name: "description",
      content: portfolioData.meta.description,
    },
  ],
  links: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2310b981'/%3E%3C/svg%3E",
    },
  ],
};
