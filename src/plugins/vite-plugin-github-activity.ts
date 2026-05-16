import type { Plugin } from 'vite';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'yaml';
import type {
  GithubActivityData,
  GithubContributionDay,
  GithubContributionWeek,
  GithubLanguage,
  ContributionLevel,
} from '../types/github-activity';

const VIRTUAL_ID = 'virtual:github-activity';
const RESOLVED_ID = '\0' + VIRTUAL_ID;
const SNAPSHOT_REL = 'src/data/github-activity.json';
const YAML_REL = 'portfolio.yaml';
const FETCH_TIMEOUT_MS = 10_000;
const DEFAULT_USERNAME = 'seriouspoop';

const LEVEL_MAP: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const QUERY = `
  query Activity($username: String!) {
    user(login: $username) {
      followers { totalCount }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        isFork: false
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
        nodes {
          stargazerCount
          forkCount
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name color }
            }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount contributionLevel weekday }
          }
        }
      }
    }
  }
`;

interface GithubConfig {
  enabled: boolean;
  username?: string;
}

function readGithubConfig(cwd: string): GithubConfig | null {
  try {
    const yamlPath = resolve(cwd, YAML_REL);
    const raw = readFileSync(yamlPath, 'utf-8');
    const parsed = parse(raw);
    return parsed?.github ?? null;
  } catch {
    return null;
  }
}

function emptyData(username: string): GithubActivityData {
  return {
    username,
    calendar: { weeks: [], totalContributions: 0 },
    languages: [],
    stats: {
      totalRepos: 0,
      totalStars: 0,
      totalForks: 0,
      followers: 0,
      contributionsLastYear: 0,
    },
    streaks: { current: 0, longest: 0 },
    fetchedAt: null,
    source: 'empty',
  };
}

function readSnapshot(cwd: string): GithubActivityData | null {
  const path = resolve(cwd, SNAPSHOT_REL);
  if (!existsSync(path)) return null;
  try {
    const data = JSON.parse(readFileSync(path, 'utf-8')) as GithubActivityData;
    return { ...data, source: data.source === 'live' ? 'snapshot' : data.source };
  } catch (err) {
    console.warn(`[github-activity] failed to read snapshot: ${(err as Error).message}`);
    return null;
  }
}

function writeSnapshot(cwd: string, data: GithubActivityData): void {
  try {
    const path = resolve(cwd, SNAPSHOT_REL);
    writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  } catch (err) {
    console.warn(`[github-activity] failed to write snapshot: ${(err as Error).message}`);
  }
}

function computeStreaks(weeks: GithubContributionWeek[]): { current: number; longest: number } {
  const allDays: GithubContributionDay[] = weeks.flatMap((w) => w.days);
  const today = new Date().toISOString().slice(0, 10);
  let longest = 0;
  let run = 0;
  for (const d of allDays) {
    if (d.count > 0) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }
  let current = 0;
  for (let i = allDays.length - 1; i >= 0; i--) {
    const d = allDays[i];
    if (d.date > today) continue;
    if (d.count > 0) current += 1;
    else break;
  }
  return { current, longest };
}

function computeLanguages(
  repoNodes: Array<{
    languages: { edges: Array<{ size: number; node: { name: string; color: string | null } }> };
  }>,
): GithubLanguage[] {
  const totals = new Map<string, { bytes: number; color: string }>();
  for (const repo of repoNodes) {
    for (const edge of repo.languages.edges ?? []) {
      const name = edge.node.name;
      const color = edge.node.color ?? '#888888';
      const prev = totals.get(name);
      if (prev) prev.bytes += edge.size;
      else totals.set(name, { bytes: edge.size, color });
    }
  }
  const totalBytes = Array.from(totals.values()).reduce((acc, v) => acc + v.bytes, 0) || 1;
  return Array.from(totals.entries())
    .map(([name, v]) => ({
      name,
      color: v.color,
      bytes: v.bytes,
      percent: (v.bytes / totalBytes) * 100,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 6);
}

interface GraphQLResponse {
  data?: {
    user: {
      followers: { totalCount: number };
      repositories: {
        totalCount: number;
        nodes: Array<{
          stargazerCount: number;
          forkCount: number;
          languages: {
            edges: Array<{ size: number; node: { name: string; color: string | null } }>;
          };
        }>;
      };
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              date: string;
              contributionCount: number;
              contributionLevel: string;
              weekday: number;
            }>;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

async function fetchGithub(token: string, username: string): Promise<GithubActivityData> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-build',
      },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as GraphQLResponse;
  if (json.errors?.length) {
    throw new Error(`GraphQL errors: ${json.errors.map((e) => e.message).join('; ')}`);
  }
  if (!json.data?.user) {
    throw new Error('GraphQL response missing user data');
  }

  const user = json.data.user;
  const cal = user.contributionsCollection.contributionCalendar;

  const weeks: GithubContributionWeek[] = cal.weeks.map((w) => ({
    days: w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: LEVEL_MAP[d.contributionLevel] ?? 0,
      weekday: d.weekday,
    })),
  }));

  const languages = computeLanguages(user.repositories.nodes);
  const streaks = computeStreaks(weeks);

  const totalStars = user.repositories.nodes.reduce((a, n) => a + n.stargazerCount, 0);
  const totalForks = user.repositories.nodes.reduce((a, n) => a + n.forkCount, 0);

  return {
    username,
    calendar: { weeks, totalContributions: cal.totalContributions },
    languages,
    stats: {
      totalRepos: user.repositories.totalCount,
      totalStars,
      totalForks,
      followers: user.followers.totalCount,
      contributionsLastYear: cal.totalContributions,
    },
    streaks,
    fetchedAt: new Date().toISOString(),
    source: 'live',
  };
}

async function resolveData(cwd: string): Promise<GithubActivityData> {
  const cfg = readGithubConfig(cwd);
  const envUsername = process.env.GITHUB_USERNAME?.trim();
  const username = envUsername || cfg?.username || DEFAULT_USERNAME;

  if (cfg && cfg.enabled === false) {
    console.info('[github-activity] disabled in portfolio.yaml, skipping fetch');
    return emptyData(username);
  }

  const offline = process.env.GITHUB_ACTIVITY_OFFLINE === '1';
  const token = process.env.GITHUB_TOKEN?.trim();

  if (offline) {
    console.info('[github-activity] GITHUB_ACTIVITY_OFFLINE=1, using snapshot');
    return readSnapshot(cwd) ?? emptyData(username);
  }

  if (!token) {
    console.warn('[github-activity] no GITHUB_TOKEN, using snapshot');
    return readSnapshot(cwd) ?? emptyData(username);
  }

  try {
    const data = await fetchGithub(token, username);
    writeSnapshot(cwd, data);
    console.info(
      `[github-activity] fetched live data (${data.stats.contributionsLastYear} contribs, ${data.stats.totalRepos} repos, ${data.languages.length} languages)`,
    );
    return data;
  } catch (err) {
    console.warn(
      `[github-activity] fetch failed: ${(err as Error).message}, using snapshot`,
    );
    return readSnapshot(cwd) ?? emptyData(username);
  }
}

export function githubActivityPlugin(): Plugin {
  let cachedPromise: Promise<GithubActivityData> | null = null;

  return {
    name: 'vite-plugin-github-activity',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    async load(id) {
      if (id !== RESOLVED_ID) return;
      const cwd = process.cwd();
      if (!cachedPromise) cachedPromise = resolveData(cwd);
      const data = await cachedPromise;
      return `export const githubActivity = ${JSON.stringify(data)};`;
    },

    configureServer(server) {
      // Only watch portfolio.yaml — the snapshot file is an output of this
      // plugin, so watching it creates a write→watch→fetch→write loop.
      const yamlPath = resolve(process.cwd(), YAML_REL);
      server.watcher.add(yamlPath);

      server.watcher.on('change', (path) => {
        if (path === yamlPath) {
          cachedPromise = null;
          const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({ type: 'full-reload', path: '*' });
          }
        }
      });
    },
  };
}
