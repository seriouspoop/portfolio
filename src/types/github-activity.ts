export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface GithubContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
  weekday: number;
}

export interface GithubContributionWeek {
  days: GithubContributionDay[];
}

export interface GithubContributionCalendar {
  weeks: GithubContributionWeek[];
  totalContributions: number;
}

export interface GithubLanguage {
  name: string;
  color: string;
  bytes: number;
  percent: number;
}

export interface GithubStreaks {
  current: number;
  longest: number;
}

export interface GithubQuickStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  contributionsLastYear: number;
}

export type GithubActivitySource = 'live' | 'snapshot' | 'empty';

export interface GithubActivityData {
  username: string;
  calendar: GithubContributionCalendar;
  languages: GithubLanguage[];
  stats: GithubQuickStats;
  streaks: GithubStreaks;
  fetchedAt: string | null;
  source: GithubActivitySource;
}
