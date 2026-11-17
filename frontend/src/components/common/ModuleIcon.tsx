import React from 'react';
import { 
  LayoutDashboard, 
  Kanban, 
  Briefcase, 
  UserCheck, 
  Calendar, 
  Users, 
  Clock, 
  Building, 
  Building2, 
  ShieldAlert, 
  Settings,
  HelpCircle,
  LucideProps
} from 'lucide-react';

interface ModuleIconProps extends LucideProps {
  name: string;
}

const iconMap: Record<string, React.FC<LucideProps>> = {
  LayoutDashboard,
  Kanban,
  Briefcase,
  UserCheck,
  Calendar,
  Users,
  Clock,
  Building,
  Building2,
  ShieldAlert,
  Settings,
};

export const ModuleIcon: React.FC<ModuleIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent {...props} />;
};

export default ModuleIcon;
