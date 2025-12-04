import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { DATA } from '../data';
import { ThreeBackground } from '../components/three-background';
import { LoadBalancerGame } from '../components/load-balancer-game';
import { SectionTitle, SkillTag, Card, SocialLink } from '../components/ui-sections';
import { ActivityIcon, TerminalIcon, ServerIcon, CpuIcon } from 'lucide-qwik';

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
            {DATA.profile.name}
          </h1>

          <p class="text-xl md:text-2xl text-zinc-400 max-w-2xl font-light">
            {DATA.profile.tagline}
          </p>

          <div class="flex gap-4 mt-6">
            <SocialLink href={DATA.profile.links.github} icon="Github" />
            <SocialLink href={DATA.profile.links.linkedin} icon="Linkedin" />
            <SocialLink href={DATA.profile.links.email} icon="Mail" />
          </div>
        </section>

        {/* EXPERIENCE */}
        <section class={`transition-all duration-1000 delay-200 transform ${loaded.value ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <SectionTitle>Experience</SectionTitle>
          <div class="space-y-6">
            {DATA.experience.map((job, idx) => (
              <Card key={idx} class="relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ActivityIcon size={100} />
                </div>
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 class="text-xl font-bold text-white">{job.role}</h3>
                  <span class="font-mono text-sm text-emerald-500/80">{job.period}</span>
                </div>
                <div class="text-lg text-zinc-400 font-medium mb-4">{job.company}</div>
                <p class="text-zinc-400 mb-4 leading-relaxed max-w-3xl">
                  {job.description}
                </p>
                <div class="flex flex-wrap gap-2">
                  {job.tech.map((t, i) => (
                    <span key={i} class="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section class={`transition-all duration-1000 delay-300 transform ${loaded.value ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <SectionTitle>Engineering</SectionTitle>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DATA.projects.map((project, idx) => {
              const Icon = project.icon === 'Terminal' ? TerminalIcon : project.icon === 'Server' ? ServerIcon : project.icon === 'Cpu' ? CpuIcon : ActivityIcon;
              return (
                <Card key={idx} class="h-full flex flex-col">
                  <div class="flex items-center gap-3 mb-4 text-emerald-400">
                    <Icon size={20} />
                    <h3 class="text-lg font-bold text-white">{project.name}</h3>
                  </div>
                  <p class="text-zinc-400 mb-6 flex-grow">
                    {project.description}
                  </p>
                  <div class="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
                    {project.tech.map((t, i) => (
                      <span key={i} class="text-xs font-mono text-zinc-500">#{t}</span>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* SKILLS */}
        <section class={`transition-all duration-1000 delay-500 transform ${loaded.value ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <SectionTitle>Stack</SectionTitle>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DATA.skills.map((grp, idx) => (
              <div key={idx}>
                <h3 class="text-emerald-500/80 font-mono text-xs mb-3 uppercase tracking-wider border-l-2 border-emerald-500/30 pl-3">
                  {grp.category}
                </h3>
                <div class="flex flex-wrap gap-2">
                  {grp.items.map((skill, sIdx) => (
                    <SkillTag key={sIdx} skill={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GAME */}
        <section class={`transition-all duration-1000 delay-700 transform ${loaded.value ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <SectionTitle>System Maintenance</SectionTitle>
          <div class="w-full">
            <LoadBalancerGame />
          </div>
        </section>

        <footer class="text-center pt-20 pb-10 text-zinc-600 text-sm font-mono border-t border-zinc-900/50">
          <p>© {new Date().getFullYear()} Harshit Singh. Systems Online.</p>
        </footer>

      </main>
    </div>
  );
});
