export const DATA = {
  profile: {
    name: "Harshit Singh",
    role: "Backend & Systems Engineer",
    tagline: "Architecting scalable distributed systems and optimizing high-throughput infrastructure.",
    links: {
      github: "https://github.com/seriouspoop",
      linkedin: "https://linkedin.com/in/harshit-me",
      email: "mailto:workmail.harshitsingh@gmail.com"
    }
  },
  experience: [
    {
      company: "Piovation GmbH",
      role: "Software Engineer",
      period: "Dec 2024 - Aug 2025",
      description: "Architected real-time SSH connection pooling achieving 115% performance boost. Implemented full-stack OpenTelemetry tracing and designed gRPC gateways for microservice orchestration.",
      tech: ["Go", "gRPC", "OpenTelemetry"]
    },
    {
      company: "RabbitLoader",
      role: "Backend Developer Intern",
      period: "May 2024 - Oct 2024",
      description: "Optimized Redis distributed caching strategy resulting in 40% load reduction. Managed container orchestration via Docker Swarm and standardized internal gRPC communication protocols.",
      tech: ["Redis", "Docker", "Go", "RabbitMQ"]
    }
  ],
  projects: [
    {
      name: "GoPush",
      description: "Interactive Command-line Git Manager built to simplify complex branching strategies.",
      icon: "Terminal",
      tech: ["Go", "CLI", "Git Internals"]
    },
    {
      name: "SysArch Ops",
      description: "High-availability deployment optimization scripts ensuring 99.9% system uptime.",
      icon: "Server",
      tech: ["Bash", "Linux", "CI/CD"]
    },
    {
      name: "AlgoBench",
      description: "High-performance benchmarking tool for analyzing algorithm efficiency and memory allocation patterns.",
      icon: "Cpu",
      tech: ["Go", "Performance", "Data Structures"]
    },
    {
      name: "Observer",
      description: "Go SDK for OpenTelemetry designed for collecting real-time metrics and traces across microservices.",
      icon: "Activity",
      tech: ["Go", "OpenTelemetry", "SDK"]
    }
  ],
  skills: [
    { category: "Languages", items: ["Go", "Rust", "C", "Bash"] },
    { category: "Orchestration & Ops", items: ["Kubernetes", "Docker Swarm", "Linux", "Helm", "Terraform"] },
    { category: "Distributed Systems", items: ["gRPC", "Kafka", "RabbitMQ", "OpenTelemetry", "Grafana", "Prometheus"] },
    { category: "Data Persistence", items: ["PostgreSQL", "Redis", "Valkey", "MongoDB"] }
  ]
};
