import { Github, Linkedin, Mail, Terminal, Server, Cpu, Database } from 'lucide-qwik';

export const PROFILE = {
  name: "Harshit Singh",
  role: "Backend Systems Engineer",
  location: "Bengaluru, India",
  tagline: "Architecting scalable distributed systems & high-throughput infrastructure.",
  social: [
    { label: "GitHub", href: "https://github.com/seriouspoop", icon: Github },
    { label: "LinkedIn", href: "https://linkedin.com/in/harshit-me", icon: Linkedin },
    { label: "Email", href: "mailto:workmail.harshitsingh@gmail.com", icon: Mail },
  ]
};

export const EXPERIENCE = [
  {
    company: "Piovation GmbH",
    role: "Software Engineer",
    period: "Dec 2024 – Aug 2025",
    description: "Architected real-time infrastructure and optimized critical system architecture.",
    achievements: [
      "Implemented real-time SSH connection pooling, boosting performance by 115% (8K to 17K req/sec).",
      "Built high-throughput gateway layer with gRPC streams for API-to-Linux command conversion.",
      "Led OpenTelemetry implementation reducing debugging time by 40%.",
      "Standardized Protobuf/gRPC practices to improve development velocity."
    ]
  },
  {
    company: "RabbitLoader",
    role: "Backend Developer Intern",
    period: "May 2024 – Oct 2024",
    description: "Engineered distributed caching systems and event-driven microservices.",
    achievements: [
      "Engineered Redis-based distributed caching, reducing DB load by 40%.",
      "Implemented event-driven architecture via RabbitMQ, increasing reliability by 30%.",
      "Orchestrated Docker Swarm deployments with automated health checks.",
      "Developed high-performance gRPC protocols with connection pooling."
    ]
  }
];

export const PROJECTS = [
  {
    title: "GoPush CLI",
    tech: ["Go", "Git Internals", "Linux"],
    icon: Terminal,
    description: "Interactive Command-line Git Manager. Open-source tool supporting HTTP/SSH protocols, secure storage, and automated authentication workflows reducing manual time by 60%."
  },
  {
    title: "SysArch Ops",
    tech: ["Docker Swarm", "Bash", "CI/CD"],
    icon: Server,
    description: "High-availability deployment orchestration scripts ensuring 99.9% uptime across production environments during peak loads."
  }
];

export const SKILLS = [
  { 
    category: "Languages", 
    items: ["Go", "Java", "Kotlin", "Python", "TypeScript", "SQL", "Bash"],
    icon: Terminal 
  },
  { 
    category: "Backend & Systems", 
    items: ["gRPC", "Microservices", "Protocol Buffers", "Event-Driven Arch", "System Design"],
    icon: Cpu 
  },
  { 
    category: "Infrastructure", 
    items: ["Docker", "Kubernetes", "AWS", "RabbitMQ", "Kafka", "OpenTelemetry"],
    icon: Server 
  },
  { 
    category: "Data", 
    items: ["Redis", "PostgreSQL", "MySQL", "MongoDB", "Query Optimization"],
    icon: Database 
  }
];
