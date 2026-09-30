import {
  BoxIcon,
  CloudIcon,
  CodeIcon,
  CpuIcon,
  LayersIcon,
  MessageSquareIcon,
  MonitorIcon,
  PenToolIcon,
  PlugIcon,
  SmartphoneIcon,
} from '@/components/icons';

/** Icon keys available in Admin (backend SERVICE_ICONS). */
const ICONS = {
  web: CodeIcon,
  mobile: SmartphoneIcon,
  system: LayersIcon,
  desktop: MonitorIcon,
  ai: CpuIcon,
  custom: BoxIcon,
  design: PenToolIcon,
  cloud: CloudIcon,
  api: PlugIcon,
  consulting: MessageSquareIcon,
} as const;

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name as keyof typeof ICONS] ?? BoxIcon;
  return <Icon className={className} />;
}
