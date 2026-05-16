import { component$ } from '@builder.io/qwik';
import { githubActivity } from 'virtual:github-activity';
import {
  GithubIcon,
  GitCommitIcon,
  FolderIcon,
  StarIcon,
  UsersIcon,
  FlameIcon,
  TrophyIcon,
  ArrowUpRightIcon,
} from 'lucide-qwik';
import { SectionTitle, cardBase } from './ui-sections';
import type {
  GithubActivityData,
  GithubContributionDay,
  GithubContributionWeek,
  GithubLanguage,
  GithubQuickStats,
  GithubStreaks,
  ContributionLevel,
} from '../types/github-activity';

const LEVEL_CLASS: Record<ContributionLevel, string> = {
  0: 'bg-zinc-800/40',
  1: 'bg-emerald-900',
  2: 'bg-emerald-700',
  3: 'bg-emerald-500',
  4: 'bg-emerald-400',
};

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

function formatHumanDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatRelative(iso: string | null): string {
  if (!iso) return 'never';
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.max(1, Math.floor((now - then) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMo = Math.floor(diffDay / 30);
  return `${diffMo}mo ago`;
}

function monthLabelsFor(weeks: GithubContributionWeek[]): Array<{ label: string; weekIndex: number }> {
  const out: Array<{ label: string; weekIndex: number }> = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const first = week.days[0];
    if (!first) return;
    const m = new Date(first.date + 'T00:00:00Z').getUTCMonth();
    if (m !== lastMonth) {
      out.push({ label: MONTH_LABELS[m], weekIndex: i });
      lastMonth = m;
    }
  });
  return out;
}

const ContributionDay = component$<{ day: GithubContributionDay }>(({ day }) => {
  const label = `${day.count} contribution${day.count === 1 ? '' : 's'} on ${formatHumanDate(day.date)}`;
  return (
    <div class="relative group/day">
      <div
        class={`${LEVEL_CLASS[day.level]} aspect-square rounded-[2px] transition-all duration-150 group-hover/day:ring-1 group-hover/day:ring-emerald-400/60 group-hover/day:scale-110 cursor-default`}
        aria-label={label}
        title={label}
      />
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-[10px] font-mono text-zinc-300 whitespace-nowrap opacity-0 group-hover/day:opacity-100 pointer-events-none transition-opacity duration-150 z-20">
        <span class="text-emerald-400">{day.count}</span>
        <span class="text-zinc-500"> · {formatHumanDate(day.date)}</span>
      </div>
    </div>
  );
});

const EmptyDay = component$(() => <div class="aspect-square" aria-hidden="true" />);

const Heatmap = component$<{ weeks: GithubContributionWeek[]; totalContributions: number; fetchedAt: string | null; source: string }>(
  ({ weeks, totalContributions, fetchedAt, source }) => {
    const months = monthLabelsFor(weeks);
    return (
      <div class={`${cardBase} p-6`}>
        <div class="flex items-center justify-between gap-2 mb-5 flex-wrap">
          <div class="flex items-center gap-2">
            <GithubIcon size={14} class="text-emerald-400" />
            <h3 class="text-emerald-500/80 font-mono text-xs uppercase tracking-wider">
              Contribution Activity
            </h3>
          </div>
          <div class="font-mono text-xs">
            <span class="text-emerald-400 font-bold">{totalContributions.toLocaleString()}</span>
            <span class="text-zinc-500"> contributions in the last year</span>
          </div>
        </div>

        <div class="flex gap-2">
          <div class="flex flex-col justify-around py-[18px] shrink-0">
            <span class="text-[10px] font-mono text-zinc-500 leading-none">Mon</span>
            <span class="text-[10px] font-mono text-zinc-500 leading-none">Wed</span>
            <span class="text-[10px] font-mono text-zinc-500 leading-none">Fri</span>
          </div>

          <div class="flex-1 min-w-0">
            <div
              class="grid gap-1 mb-1"
              style={`grid-template-columns: repeat(${weeks.length}, minmax(0, 1fr))`}
            >
              {weeks.map((_, i) => {
                const m = months.find((x) => x.weekIndex === i);
                return (
                  <span key={i} class="text-[10px] font-mono text-zinc-500 leading-none h-3">
                    {m?.label ?? ''}
                  </span>
                );
              })}
            </div>

            <div class="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} class="flex-1 min-w-0 grid grid-rows-7 gap-1">
                  {Array.from({ length: 7 }).map((_, di) => {
                    const day = week.days.find((d) => d.weekday === di);
                    return day ? (
                      <ContributionDay key={di} day={day} />
                    ) : (
                      <EmptyDay key={di} />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between mt-5 flex-wrap gap-2">
          <div class="font-mono text-[10px] text-zinc-600">
            Updated {formatRelative(fetchedAt)}
            {source === 'snapshot' && <span class="text-zinc-700"> · cached</span>}
          </div>
          <div class="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
            <span>Less</span>
            <span class={`${LEVEL_CLASS[0]} w-3 h-3 rounded-[2px]`} />
            <span class={`${LEVEL_CLASS[1]} w-3 h-3 rounded-[2px]`} />
            <span class={`${LEVEL_CLASS[2]} w-3 h-3 rounded-[2px]`} />
            <span class={`${LEVEL_CLASS[3]} w-3 h-3 rounded-[2px]`} />
            <span class={`${LEVEL_CLASS[4]} w-3 h-3 rounded-[2px]`} />
            <span>More</span>
          </div>
        </div>
      </div>
    );
  },
);

interface StatCellProps {
  icon: typeof GitCommitIcon;
  value: string;
  label: string;
}

const StatCell = component$<StatCellProps>(({ icon: Icon, value, label }) => (
  <div class="flex flex-col items-start gap-2 p-4 bg-zinc-800/30 rounded-md border border-zinc-800/60 hover:border-emerald-500/30 transition-colors">
    <div class="text-emerald-400/80">
      <Icon size={16} />
    </div>
    <div class="text-2xl font-bold text-emerald-400 font-mono leading-none">{value}</div>
    <div class="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{label}</div>
  </div>
));

const StatsGrid = component$<{ stats: GithubQuickStats; streaks: GithubStreaks }>(({ stats, streaks }) => (
  <div class={`${cardBase} p-6`}>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCell icon={GitCommitIcon} value={formatNumber(stats.contributionsLastYear)} label="contribs" />
      <StatCell icon={FolderIcon} value={formatNumber(stats.totalRepos)} label="repos" />
      <StatCell icon={StarIcon} value={formatNumber(stats.totalStars)} label="stars" />
      <StatCell icon={UsersIcon} value={formatNumber(stats.followers)} label="followers" />
      <StatCell icon={FlameIcon} value={formatNumber(streaks.current)} label="current streak" />
      <StatCell icon={TrophyIcon} value={formatNumber(streaks.longest)} label="longest streak" />
    </div>
  </div>
));

const LanguageBars = component$<{ languages: GithubLanguage[] }>(({ languages }) => (
  <div class={`${cardBase} p-6`}>
    <h3 class="text-emerald-500/80 font-mono text-xs mb-5 uppercase tracking-wider border-l-2 border-emerald-500/30 pl-3">
      Top Languages
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
      {languages.map((lang) => (
        <div key={lang.name} class="flex items-center gap-3">
          <span class="w-24 text-right font-mono text-xs text-zinc-300 truncate" title={lang.name}>
            {lang.name}
          </span>
          <div class="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000"
              style={`width:${lang.percent.toFixed(2)}%;background-color:${lang.color}`}
            />
          </div>
          <span class="w-14 text-right font-mono text-xs text-emerald-400">
            {lang.percent.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  </div>
));

const EmptyState = component$<{ username: string }>(({ username }) => (
  <div class={`${cardBase} p-8 flex flex-col items-center gap-3 text-center`}>
    <GithubIcon size={32} class="text-emerald-400/70" />
    <p class="text-zinc-300 font-mono text-sm">Live GitHub stats coming soon</p>
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono text-xs transition-colors"
    >
      <span>github.com/{username}</span>
      <ArrowUpRightIcon size={12} />
    </a>
  </div>
));

export const GithubActivitySection = component$(() => {
  const data: GithubActivityData = githubActivity;

  if (data.source === 'empty' || data.calendar.weeks.length === 0) {
    return (
      <>
        <SectionTitle>GitHub Activity</SectionTitle>
        <EmptyState username={data.username} />
      </>
    );
  }

  const fullWeeks = data.calendar.weeks;
  const mobileWeeks = fullWeeks.slice(-26);

  return (
    <>
      <SectionTitle>GitHub Activity</SectionTitle>
      <div class="flex flex-col gap-6">
        <div class="hidden md:block">
          <Heatmap
            weeks={fullWeeks}
            totalContributions={data.calendar.totalContributions}
            fetchedAt={data.fetchedAt}
            source={data.source}
          />
        </div>
        <div class="block md:hidden">
          <Heatmap
            weeks={mobileWeeks}
            totalContributions={data.calendar.totalContributions}
            fetchedAt={data.fetchedAt}
            source={data.source}
          />
        </div>

        <StatsGrid stats={data.stats} streaks={data.streaks} />

        {data.languages.length > 0 && <LanguageBars languages={data.languages} />}
      </div>
    </>
  );
});
