import React from 'react';
import { User, Code, BarChart3, Briefcase, Brain, Database, Moon, Sun } from 'lucide-react';
import { RoleCard } from '../components/RoleCard';
import { DomainButton } from '../components/DomainButton';

interface Role {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  domains: string[];
}

interface RoleSelectorProps {
  onRoleSelect: (role: string, domain: string) => void;
}

const roles: Role[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    icon: Code,
    domains: ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps'],
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    icon: Briefcase,
    domains: ['Consumer Products', 'B2B SaaS', 'Mobile Apps', 'Platform', 'Growth'],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: BarChart3,
    domains: ['Business Intelligence', 'Marketing Analytics', 'Financial Analysis', 'Operations', 'Product Analytics'],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    icon: Brain,
    domains: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Recommendation Systems'],
  },
  {
    id: 'system-designer',
    title: 'System Designer',
    icon: Database,
    domains: ['Distributed Systems', 'Microservices', 'Scalability', 'Cloud Architecture', 'Database Design'],
  },
];

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [selectedDomain, setSelectedDomain] = React.useState<string>('');
  const [darkMode, setDarkMode] = React.useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleContinue = () => {
    if (selectedRole && selectedDomain) {
      onRoleSelect(selectedRole.id, selectedDomain);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto text-center relative">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle Dark Mode"
          className="absolute top-0 right-0 mt-4 mr-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>

        <User className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">Choose Your Target Role</h1>
        <p className="text-md text-gray-600 dark:text-gray-300 mb-10">
          Select the position and domain you want to practice interviewing for
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              title={role.title}
              icon={role.icon}
              selected={selectedRole?.id === role.id}
              onClick={() => {
                setSelectedRole(role);
                setSelectedDomain('');
              }}
            />
          ))}
        </div>

        {selectedRole && (
          <div className="bg-white/60 dark:bg-gray-700 backdrop-blur-md border border-gray-200 dark:border-gray-600 rounded-2xl p-6 shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Select Domain for {selectedRole.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedRole.domains.map((domain) => (
                <DomainButton
                  key={domain}
                  domain={domain}
                  selected={selectedDomain === domain}
                  onClick={() => setSelectedDomain(domain)}
                />
              ))}
            </div>
          </div>
        )}

        {selectedRole && selectedDomain && (
          <div className="mt-6">
            <button
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-colors"
            >
              Continue to Interview Mode
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
