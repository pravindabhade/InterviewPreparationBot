import React, { useState } from 'react';
import { RoleSelector } from './components/RoleSelector';
import { InterviewModeSelector } from './components/InterviewModeSelector';
import { InterviewChat } from './components/InterviewChat';
import { InterviewSummary } from './components/InterviewSummary';
import WelcomeScreen from './components/WelcomeScreen';

type AppState = 'role-selection' | 'mode-selection' | 'interview' | 'summary';

interface Message {
  id: string;
  type: 'question' | 'answer' | 'feedback';
  content: string;
  score?: number;
  timestamp: Date;
}

function App() {
  const [showChatbot, setShowChatbot] = useState(false); // welcome screen
  const [currentState, setCurrentState] = useState<AppState>('role-selection');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<'technical' | 'behavioral'>('technical');
  const [interviewMessages, setInterviewMessages] = useState<Message[]>([]);
  const [finalScore, setFinalScore] = useState<number>(0);

  const handleStart = () => {
    setShowChatbot(true);
  };

  const handleRoleSelect = (role: string, domain: string) => {
    setSelectedRole(role);
    setSelectedDomain(domain);
    setCurrentState('mode-selection');
  };

  const handleModeSelect = (mode: 'technical' | 'behavioral') => {
    setSelectedMode(mode);
    setCurrentState('interview');
  };

  const handleInterviewComplete = (messages: Message[], score: number) => {
    setInterviewMessages(messages);
    setFinalScore(score);
    setCurrentState('summary');
  };

  const handleNewInterview = () => {
    setCurrentState('role-selection');
    setSelectedRole('');
    setSelectedDomain('');
    setInterviewMessages([]);
    setFinalScore(0);
  };

  const handleBackToRoleSelection = () => {
    setCurrentState('role-selection');
  };

  const handleBackToModeSelection = () => {
    setCurrentState('mode-selection');
  };

  // ✅ One single return — conditionally render welcome OR full chatbot
  return (
    <>
      {!showChatbot ? (
        <WelcomeScreen onStart={handleStart} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {currentState === 'role-selection' && (
            <RoleSelector onRoleSelect={handleRoleSelect} />
          )}

          {currentState === 'mode-selection' && (
            <InterviewModeSelector
              role={selectedRole}
              domain={selectedDomain}
              onModeSelect={handleModeSelect}
              onBack={handleBackToRoleSelection}
            />
          )}

          {currentState === 'interview' && (
            <InterviewChat
              role={selectedRole}
              domain={selectedDomain}
              mode={selectedMode}
              onBack={handleBackToModeSelection}
              onComplete={handleInterviewComplete}
            />
          )}

          {currentState === 'summary' && (
            <InterviewSummary
              role={selectedRole}
              domain={selectedDomain}
              mode={selectedMode}
              messages={interviewMessages}
              finalScore={finalScore}
              onNewInterview={handleNewInterview}
            />
          )}
        </div>
      )}
    </>
  );
}

export default App;