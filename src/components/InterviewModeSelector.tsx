import React from 'react';
import { Code2, Users, ArrowLeft } from 'lucide-react';

interface InterviewMode {
  id: 'technical' | 'behavioral';
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
}

interface InterviewModeSelectorProps {
  role: string;
  domain: string;
  onModeSelect: (mode: 'technical' | 'behavioral') => void;
  onBack: () => void;
}

const interviewModes: InterviewMode[] = [
  {
    id: 'technical',
    title: 'Technical Interview',
    description: 'Test your technical knowledge and problem-solving skills',
    icon: Code2,
    features: [
      'Algorithm & Data Structures',
      'System Design Questions',
      'Domain-specific Technical Questions',
      'Code Review & Optimization',
      'Architecture Discussions'
    ]
  },
  {
    id: 'behavioral',
    title: 'Behavioral Interview',
    description: 'Practice soft skills and situational responses',
    icon: Users,
    features: [
      'STAR Method Questions',
      'Leadership & Teamwork',
      'Conflict Resolution',
      'Project Management',
      'Career Goals & Motivation'
    ]
  }
];

export function InterviewModeSelector({ 
  role, 
  domain, 
  onModeSelect, 
  onBack 
}: InterviewModeSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Role Selection
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Interview Mode</h1>
        <p className="text-gray-600">
          Preparing for: <span className="font-semibold text-blue-600">{role}</span> - {domain}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interviewModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <div
              key={mode.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <Icon className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">{mode.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-4">{mode.description}</p>
              
              <ul className="space-y-2 mb-6">
                {mode.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => onModeSelect(mode.id)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start {mode.title}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}