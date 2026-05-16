declare module 'virtual:portfolio-data' {
  const portfolioData: import('./types/components').PortfolioConfig;
  export { portfolioData };
}

declare module 'virtual:github-activity' {
  const githubActivity: import('./types/github-activity').GithubActivityData;
  export { githubActivity };
}
