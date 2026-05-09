import { component$ } from '@builder.io/qwik';
import {
  TerminalIcon,
  ServerIcon,
  CpuIcon,
  ActivityIcon,
  CodeIcon,
  BoxesIcon,
  NetworkIcon,
  DatabaseIcon,
  ChevronDownIcon,
  XIcon,
  ArrowUpRightIcon,
  CloudIcon,
  BugIcon
} from 'lucide-qwik';

export { ChevronDownIcon, XIcon, ArrowUpRightIcon, ActivityIcon };

const iconMap: Record<string, any> = {
  Terminal: TerminalIcon,
  Server:   ServerIcon,
  Cpu:      CpuIcon,
  Activity: ActivityIcon,
  Code:     CodeIcon,
  Container: BoxesIcon,
  Network:  NetworkIcon,
  Database: DatabaseIcon,
  Cloud:    CloudIcon,
  Observe: BugIcon
};

export const PortfolioIcon = component$(
  ({ name, size = 18 }: { name: string; size?: number }) => {
    const Icon = iconMap[name];
    if (!Icon) return <></>;
    return <Icon size={size} />;
  }
);
