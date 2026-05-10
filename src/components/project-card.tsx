import { component$, useSignal, $ } from '@builder.io/qwik';
import type { ProjectCard } from '../types/components';
import { cardBase } from './ui-sections';
import { PortfolioIcon, XIcon, ArrowUpRightIcon } from './portfolio-icon';

function getPrimaryLinkUrl(project: ProjectCard): string | null {
  if (!project.links || project.links.length === 0) return null;
  const priority = ['live', 'github', 'external', 'demo', 'docs'] as const;
  for (const type of priority) {
    const found = project.links.find(l => l.type === type);
    if (found) return found.url;
  }
  return project.links[0].url;
}

// ─── Shared card face ────────────────────────────────────────────────────────

const ProjectCardFace = component$(({ project }: { project: ProjectCard }) => (
  <>
    <div class="flex items-center gap-3 mb-2">
      <span class="p-2 bg-emerald-950/40 rounded-md text-emerald-400 flex-shrink-0">
        <PortfolioIcon name={project.icon} size={16} />
      </span>
      <h3 class="text-lg font-bold text-white leading-tight">{project.name}</h3>
    </div>

    <p class="text-xs text-emerald-500/60 font-mono mb-3 leading-relaxed">{project.tagline}</p>

    <p class="text-zinc-400 mb-6 flex-grow text-sm leading-relaxed">{project.summary}</p>

    <div class="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
      {project.tech.map((t, i) => (
        <span key={i} class="text-xs font-mono text-zinc-500">
          #{t}
        </span>
      ))}
    </div>
  </>
));

// ─── Static (non-clickable) ──────────────────────────────────────────────────

const ProjectCardStatic = component$(({ project }: { project: ProjectCard }) => (
  <div class={`${cardBase} p-6 h-full flex flex-col`}>
    <ProjectCardFace project={project} />
  </div>
));

// ─── Modal ───────────────────────────────────────────────────────────────────

const ProjectCardModal = component$(({ project }: { project: ProjectCard }) => {
  const dialogRef = useSignal<HTMLDialogElement>();

  const openModal = $(() => {
    dialogRef.value?.showModal();
  });

  const closeModal = $(() => {
    dialogRef.value?.close();
  });

  const onDialogClick = $((e: MouseEvent) => {
    if (e.target === dialogRef.value) {
      dialogRef.value?.close();
    }
  });

  return (
    <>
      <div
        class={`${cardBase} p-6 h-full flex flex-col cursor-pointer`}
        onClick$={openModal}
      >
        <ProjectCardFace project={project} />
      </div>

      <dialog
        ref={dialogRef}
        class="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-0 overflow-hidden"
        onClick$={onDialogClick}
      >
        <div class="p-8 max-h-[85vh] overflow-y-auto relative">
          <button
            onClick$={closeModal}
            class="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer transition-colors p-1 rounded-md hover:bg-zinc-800"
            aria-label="Close"
          >
            <XIcon size={18} />
          </button>

          <div class="flex items-start gap-4 mb-6 pr-8">
            <span class="p-3 bg-emerald-950/50 rounded-xl text-emerald-400 flex-shrink-0">
              <PortfolioIcon name={project.icon} size={28} />
            </span>
            <div>
              <h2 class="text-2xl font-bold text-white">{project.name}</h2>
              <p class="text-emerald-500/70 font-mono text-sm mt-1">{project.tagline}</p>
            </div>
          </div>

          <p class="text-zinc-300 leading-relaxed mb-6">{project.summary}</p>

          {project.details && project.details.length > 0 && (
            <ul class="space-y-2 mb-6">
              {project.details.map((d, i) => (
                <li key={i} class="flex items-start gap-2 text-zinc-400 text-sm">
                  <span class="text-emerald-500 mt-0.5 flex-shrink-0">›</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}

          {project.stats && project.stats.length > 0 && (
            <div
              class={`grid gap-4 mb-6 ${
                project.stats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
              }`}
            >
              {project.stats.map((s, i) => (
                <div
                  key={i}
                  class="text-center p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
                >
                  <div class="text-2xl font-bold text-emerald-400 font-mono">{s.value}</div>
                  <div class="text-xs text-zinc-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {project.links && project.links.length > 0 && (
            <div class="flex flex-wrap gap-3 mb-6">
              {project.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-zinc-700 rounded-md text-zinc-300 hover:border-emerald-500/60 hover:text-emerald-400 transition-all"
                >
                  {link.label ?? link.type}
                  <ArrowUpRightIcon size={12} />
                </a>
              ))}
            </div>
          )}

          <div class="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
            {project.tech.map((t, i) => (
              <span
                key={i}
                class="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
});

// ─── Drawer ──────────────────────────────────────────────────────────────────

const ProjectCardDrawer = component$(({ project }: { project: ProjectCard }) => {
  const isOpen = useSignal(false);

  const open = $(() => {
    isOpen.value = true;
  });

  const close = $(() => {
    isOpen.value = false;
  });

  return (
    <>
      <div
        class={`${cardBase} p-6 h-full flex flex-col cursor-pointer`}
        onClick$={open}
      >
        <ProjectCardFace project={project} />
      </div>

      <div
        class={`fixed inset-0 z-50 ${isOpen.value ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!isOpen.value}
      >
        <div
          class={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen.value ? 'opacity-100' : 'opacity-0'
          }`}
          onClick$={close}
        />
        <div
          class={`absolute right-0 top-0 h-full w-80 lg:w-96 bg-zinc-950 border-l border-zinc-800 overflow-y-auto transition-transform duration-300 ease-out ${
            isOpen.value ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div class="p-6">
            <button
              onClick$={close}
              class="mb-6 text-zinc-500 hover:text-white cursor-pointer transition-colors"
              aria-label="Close"
            >
              <XIcon size={18} />
            </button>

            <div class="flex items-start gap-3 mb-4">
              <span class="p-2.5 bg-emerald-950/50 rounded-lg text-emerald-400 flex-shrink-0">
                <PortfolioIcon name={project.icon} size={22} />
              </span>
              <div>
                <h2 class="text-xl font-bold text-white">{project.name}</h2>
                <p class="text-emerald-500/70 font-mono text-xs mt-1">{project.tagline}</p>
              </div>
            </div>

            <p class="text-zinc-300 text-sm leading-relaxed mb-4">{project.summary}</p>

            {project.details && project.details.length > 0 && (
              <div class="space-y-2 mb-4">
                {project.details.map((d, i) => (
                  <div key={i} class="flex items-start gap-2 text-zinc-400 text-sm">
                    <span class="text-emerald-500 mt-0.5 flex-shrink-0">›</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            )}

            {project.links && project.links.length > 0 && (
              <div class="flex flex-col gap-2 mt-4">
                {project.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <ArrowUpRightIcon size={12} />
                    {link.label ?? link.type}
                  </a>
                ))}
              </div>
            )}

            <div class="flex flex-wrap gap-2 mt-6 pt-4 border-t border-zinc-800">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  class="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

// ─── Expand (inline, no overlay) ─────────────────────────────────────────────

const ProjectCardExpand = component$(({ project }: { project: ProjectCard }) => {
  const isExpanded = useSignal(false);

  const toggle = $(() => {
    isExpanded.value = !isExpanded.value;
  });

  return (
    <div
      class={`${cardBase} p-6 h-full flex flex-col cursor-pointer`}
      onClick$={toggle}
    >
      <ProjectCardFace project={project} />

      {project.details && project.details.length > 0 && (
        <div
          class={`grid transition-all duration-300 ${
            isExpanded.value ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div class="overflow-hidden">
            <ul class="mt-4 pt-4 border-t border-zinc-800/50 space-y-1.5">
              {project.details.map((d, i) => (
                <li key={i} class="flex items-start gap-2 text-xs text-zinc-400">
                  <span class="text-emerald-500/70 flex-shrink-0">›</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
});

// ─── Link ─────────────────────────────────────────────────────────────────────

const ProjectCardLink = component$(({ project }: { project: ProjectCard }) => {
  const url = getPrimaryLinkUrl(project);

  if (!url) {
    return <ProjectCardStatic project={project} />;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      class={`${cardBase} p-6 h-full flex flex-col block no-underline`}
    >
      <div class="flex items-center gap-3 mb-2">
        <span class="p-2 bg-emerald-950/40 rounded-md text-emerald-400 flex-shrink-0">
          <PortfolioIcon name={project.icon} size={16} />
        </span>
        <h3 class="text-lg font-bold text-white leading-tight">{project.name}</h3>
        <ArrowUpRightIcon size={14} class="text-emerald-500/60 ml-auto flex-shrink-0" />
      </div>

      <p class="text-xs text-emerald-500/60 font-mono mb-3 leading-relaxed">{project.tagline}</p>
      <p class="text-zinc-400 mb-6 flex-grow text-sm leading-relaxed">{project.summary}</p>

      <div class="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
        {project.tech.map((t, i) => (
          <span key={i} class="text-xs font-mono text-zinc-500">#{t}</span>
        ))}
      </div>
    </a>
  );
});

// ─── Router: picks the right variant ─────────────────────────────────────────

export const ProjectCardComponent = component$(({ project }: { project: ProjectCard }) => {
  if (!project.clickable || !project.interaction || project.interaction === 'none') {
    return <ProjectCardStatic project={project} />;
  }
  if (project.interaction === 'modal')  return <ProjectCardModal  project={project} />;
  if (project.interaction === 'drawer') return <ProjectCardDrawer project={project} />;
  if (project.interaction === 'expand') return <ProjectCardExpand project={project} />;
  if (project.interaction === 'link')   return <ProjectCardLink   project={project} />;
  return <ProjectCardStatic project={project} />;
});
