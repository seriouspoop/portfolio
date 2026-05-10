import { component$, useSignal, $ } from '@builder.io/qwik';
import type { ExperienceCard } from '../types/components';
import { cardBase } from './ui-sections';
import { ActivityIcon, ChevronDownIcon, XIcon, ArrowUpRightIcon } from './portfolio-icon';

// ─── Decorative watermark ────────────────────────────────────────────────────

const Watermark = component$(() => (
  <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none select-none">
    <ActivityIcon size={100} />
  </div>
));

// ─── Card body (role, company, summary, metrics, tech) ───────────────────────

const CardBody = component$(({
  job,
  showChevron = false,
  chevronOpen = false,
  companyIsLink = false,
}: {
  job: ExperienceCard;
  showChevron?: boolean;
  chevronOpen?: boolean;
  companyIsLink?: boolean;
}) => (
  <>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
      <h3 class="text-xl font-bold text-white flex items-center gap-2">
        {job.role}
        <span class="inline-flex text-emerald-500/70 group-hover:text-emerald-500/80 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRightIcon size={18} strokeWidth={3} />
        </span>
      </h3>
      <div class="flex items-center gap-2">
        <span class="font-mono text-sm text-emerald-500/80">{job.period}</span>
        {showChevron && (
          <ChevronDownIcon
            size={16}
            class={`text-emerald-500/60 flex-shrink-0 transition-transform duration-300 ${chevronOpen ? 'rotate-180' : ''}`}
          />
        )}
      </div>
    </div>

    <div class="text-lg text-zinc-400 font-medium mb-4">
      {companyIsLink && job.company_url ? (
        <a
          href={job.company_url}
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-emerald-400 transition-colors"
          onClick$={(e) => e.stopPropagation()}
        >
          {job.company}
        </a>
      ) : (
        job.company
      )}
      {job.location && (
        <span class="text-zinc-600 font-normal text-sm ml-2">· {job.location}</span>
      )}
    </div>

    <p class="text-zinc-400 mb-4 leading-relaxed max-w-3xl">{job.summary}</p>

    {job.metrics && job.metrics.length > 0 && (
      <div class="flex flex-wrap gap-6 mb-4">
        {job.metrics.map((m, i) => (
          <div key={i} class="text-center">
            <div class="text-lg font-bold text-emerald-400 font-mono">{m.value}</div>
            <div class="text-xs text-zinc-500">{m.label}</div>
          </div>
        ))}
      </div>
    )}

    <div class="flex flex-wrap gap-2">
      {job.tech.map((t, i) => (
        <span key={i} class="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
          {t}
        </span>
      ))}
    </div>
  </>
));

// ─── Detail content (used inside modal and drawer) ───────────────────────────

const DetailContent = component$(({ job }: { job: ExperienceCard }) => (
  <>
    <div class="flex items-start gap-4 mb-6 pr-8">
      <span class="p-3 bg-emerald-950/50 rounded-xl text-emerald-400 flex-shrink-0">
        <ActivityIcon size={28} />
      </span>
      <div>
        <h2 class="text-2xl font-bold text-white">{job.role}</h2>
        <p class="text-emerald-400/80 font-medium mt-0.5">{job.company}</p>
        <p class="text-zinc-500 font-mono text-xs mt-0.5">
          {job.period}{job.location ? ` · ${job.location}` : ''}
        </p>
      </div>
    </div>

    <p class="text-zinc-300 leading-relaxed mb-6">{job.summary}</p>

    {job.details && job.details.length > 0 && (
      <ul class="space-y-2 mb-6">
        {job.details.map((d, i) => (
          <li key={i} class="flex items-start gap-2 text-zinc-400 text-sm">
            <span class="text-emerald-500 mt-0.5 flex-shrink-0">›</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
    )}

    {job.metrics && job.metrics.length > 0 && (
      <div class={`grid gap-4 mb-6 ${job.metrics.length <= 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {job.metrics.map((m, i) => (
          <div key={i} class="text-center p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
            <div class="text-2xl font-bold text-emerald-400 font-mono">{m.value}</div>
            <div class="text-xs text-zinc-500 mt-1">{m.label}</div>
          </div>
        ))}
      </div>
    )}

    {job.company_url && (
      <div class="flex flex-wrap gap-3 mb-6">
        <a
          href={job.company_url}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-zinc-700 rounded-md text-zinc-300 hover:border-emerald-500/60 hover:text-emerald-400 transition-all"
        >
          Visit Company
          <ArrowUpRightIcon size={12} />
        </a>
      </div>
    )}

    <div class="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
      {job.tech.map((t, i) => (
        <span key={i} class="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
          {t}
        </span>
      ))}
    </div>
  </>
));

// ─── Static (interaction: none OR clickable: false) ──────────────────────────

const ExperienceCardStatic = component$(({ job }: { job: ExperienceCard }) => (
  <div class={`${cardBase} p-6 relative overflow-hidden`}>
    <Watermark />
    {job.logo && (
      <img src={job.logo} alt={job.company} width="40" height="40"
        class="absolute top-4 right-4 w-10 h-10 object-contain opacity-40 group-hover:opacity-70 transition-opacity z-10" />
    )}
    <CardBody job={job} companyIsLink={true} />
  </div>
));

// ─── Expand ──────────────────────────────────────────────────────────────────

const ExperienceCardExpand = component$(({ job }: { job: ExperienceCard }) => {
  const isExpanded = useSignal(false);

  const handleToggle = $(() => {
    isExpanded.value = !isExpanded.value;
  });

  return (
    <div
      class={`${cardBase} p-6 relative overflow-hidden cursor-pointer select-none`}
      onClick$={handleToggle}
    >
      <Watermark />
      {job.logo && (
        <img src={job.logo} alt={job.company} width="40" height="40"
          class="absolute top-4 right-4 w-10 h-10 object-contain opacity-40 group-hover:opacity-70 transition-opacity z-10" />
      )}
      <CardBody job={job} showChevron={true} chevronOpen={isExpanded.value} companyIsLink={false} />

      {job.details && job.details.length > 0 && (
        <div class={`grid transition-all duration-300 ease-in-out ${isExpanded.value ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div class="overflow-hidden">
            <ul class="mt-4 pt-4 border-t border-zinc-800/50 space-y-2">
              {job.details.map((detail, i) => (
                <li key={i} class="flex items-start gap-2 text-sm text-zinc-400">
                  <span class="text-emerald-500/70 mt-0.5 flex-shrink-0">›</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
});

// ─── Modal ───────────────────────────────────────────────────────────────────

const ExperienceCardModal = component$(({ job }: { job: ExperienceCard }) => {
  const dialogRef = useSignal<HTMLDialogElement>();

  const openModal = $(() => { dialogRef.value?.showModal(); });
  const closeModal = $(() => { dialogRef.value?.close(); });
  const onDialogClick = $((e: MouseEvent) => {
    if (e.target === dialogRef.value) dialogRef.value?.close();
  });

  return (
    <>
      <div
        class={`${cardBase} p-6 relative overflow-hidden cursor-pointer`}
        onClick$={openModal}
      >
        <Watermark />
        {job.logo && (
          <img src={job.logo} alt={job.company} width="40" height="40"
            class="absolute top-4 right-4 w-10 h-10 object-contain opacity-40 group-hover:opacity-70 transition-opacity z-10" />
        )}
        <CardBody job={job} companyIsLink={false} />
      </div>

      <dialog
        ref={dialogRef}
        class="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-0 overflow-hidden"
        onClick$={onDialogClick}
      >
        <div class="p-8 max-h-[85vh] overflow-y-auto relative">
          <button
            onClick$={closeModal}
            class="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-800"
            aria-label="Close"
          >
            <XIcon size={18} />
          </button>
          <DetailContent job={job} />
        </div>
      </dialog>
    </>
  );
});

// ─── Drawer ──────────────────────────────────────────────────────────────────

const ExperienceCardDrawer = component$(({ job }: { job: ExperienceCard }) => {
  const isOpen = useSignal(false);

  const open = $(() => { isOpen.value = true; });
  const close = $(() => { isOpen.value = false; });

  return (
    <>
      <div
        class={`${cardBase} p-6 relative overflow-hidden cursor-pointer`}
        onClick$={open}
      >
        <Watermark />
        {job.logo && (
          <img src={job.logo} alt={job.company} width="40" height="40"
            class="absolute top-4 right-4 w-10 h-10 object-contain opacity-40 group-hover:opacity-70 transition-opacity z-10" />
        )}
        <CardBody job={job} companyIsLink={false} />
      </div>

      <div
        class={`fixed inset-0 z-50 ${isOpen.value ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!isOpen.value}
      >
        <div
          class={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen.value ? 'opacity-100' : 'opacity-0'}`}
          onClick$={close}
        />
        <div
          class={`absolute right-0 top-0 h-full w-80 lg:w-96 bg-zinc-950 border-l border-zinc-800 overflow-y-auto transition-transform duration-300 ease-out ${isOpen.value ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div class="p-6">
            <button
              onClick$={close}
              class="mb-6 text-zinc-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <XIcon size={18} />
            </button>
            <DetailContent job={job} />
          </div>
        </div>
      </div>
    </>
  );
});

// ─── Link ─────────────────────────────────────────────────────────────────────

const ExperienceCardLink = component$(({ job }: { job: ExperienceCard }) => {
  if (!job.company_url) {
    return <ExperienceCardStatic job={job} />;
  }

  return (
    <a
      href={job.company_url}
      target="_blank"
      rel="noopener noreferrer"
      class={`${cardBase} p-6 relative overflow-hidden block no-underline`}
    >
      <Watermark />
      {job.logo && (
        <img src={job.logo} alt={job.company} width="40" height="40"
          class="absolute top-4 right-4 w-10 h-10 object-contain opacity-40 group-hover:opacity-70 transition-opacity z-10" />
      )}
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          {job.role}
          <span class="inline-flex text-emerald-500/0 group-hover:text-emerald-500/80 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRightIcon size={16} />
          </span>
        </h3>
        <span class="font-mono text-sm text-emerald-500/80">{job.period}</span>
      </div>

      <div class="text-lg text-zinc-400 font-medium mb-4">
        {job.company}
        {job.location && (
          <span class="text-zinc-600 font-normal text-sm ml-2">· {job.location}</span>
        )}
      </div>

      <p class="text-zinc-400 mb-4 leading-relaxed max-w-3xl">{job.summary}</p>

      {job.metrics && job.metrics.length > 0 && (
        <div class="flex flex-wrap gap-6 mb-4">
          {job.metrics.map((m, i) => (
            <div key={i} class="text-center">
              <div class="text-lg font-bold text-emerald-400 font-mono">{m.value}</div>
              <div class="text-xs text-zinc-500">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      <div class="flex flex-wrap gap-2">
        {job.tech.map((t, i) => (
          <span key={i} class="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
            {t}
          </span>
        ))}
      </div>
    </a>
  );
});

// ─── Router ───────────────────────────────────────────────────────────────────

export const ExperienceCardComponent = component$(({ job }: { job: ExperienceCard }) => {
  if (!job.clickable || !job.interaction || job.interaction === 'none') {
    return <ExperienceCardStatic job={job} />;
  }
  if (job.interaction === 'expand') return <ExperienceCardExpand job={job} />;
  if (job.interaction === 'modal')  return <ExperienceCardModal  job={job} />;
  if (job.interaction === 'drawer') return <ExperienceCardDrawer job={job} />;
  if (job.interaction === 'link')   return <ExperienceCardLink   job={job} />;
  return <ExperienceCardStatic job={job} />;
});
