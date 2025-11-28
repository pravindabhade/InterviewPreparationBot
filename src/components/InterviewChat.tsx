import React from 'react';
import { ArrowLeft, Send, RotateCcw, SkipForward, Clock, Target } from 'lucide-react';

interface Message {
  id: string;
  type: 'question' | 'answer' | 'feedback';
  content: string;
  score?: number;
  timestamp: Date;
}

interface InterviewChatProps {
  role: string;
  domain: string;
  mode: 'technical' | 'behavioral';
  onBack: () => void;
  onComplete: (messages: Message[], finalScore: number) => void;
}

export function InterviewChat({ 
  role, 
  domain, 
  mode, 
  onBack, 
  onComplete 
}: InterviewChatProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentAnswer, setCurrentAnswer] = React.useState('');
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sessionStartTime] = React.useState(new Date());

  const questions = React.useMemo(() => {
    if (mode === 'technical') {
      const technicalQuestions = {
        'software-engineer': {
          'Frontend': [
            "Explain the virtual DOM and how React uses it for efficient rendering.",
            "How would you optimize the performance of a React application with large lists?",
            "Design a responsive navigation component that works across different screen sizes.",
            "Explain the difference between useCallback and useMemo hooks with practical examples.",
            "How would you implement state management in a large-scale React application?"
          ],
          'Backend': [
            "Design a RESTful API for a social media platform. What endpoints would you create?",
            "Explain database indexing and when you would use different types of indexes.",
            "How would you handle authentication and authorization in a microservices architecture?",
            "Design a caching strategy for a high-traffic e-commerce website.",
            "Explain how you would implement rate limiting for an API."
          ],
          'Full Stack': [
            "How would you design a real-time chat application? Walk me through the architecture.",
            "Explain how you would handle file uploads in a web application, from frontend to backend.",
            "Design a system for user authentication that works across multiple applications.",
            "How would you optimize database queries for a social media feed?",
            "Explain your approach to API versioning and backward compatibility."
          ]
        },
        'product-manager': [
          "How would you prioritize features for a mobile app with limited development resources?",
          "Walk me through how you would launch a new product feature from conception to release.",
          "How do you measure the success of a product? What metrics would you track?",
          "Describe how you would handle conflicting requirements from different stakeholders.",
          "How would you conduct user research to validate a new product idea?"
        ],
        'data-analyst': [
          "How would you analyze user engagement data to improve product retention?",
          "Explain how you would design an A/B test for a new website feature.",
          "Walk me through your process for cleaning and preparing messy data.",
          "How would you present complex data insights to non-technical stakeholders?",
          "Describe how you would identify and handle outliers in a dataset."
        ]
      };
      
      return technicalQuestions[role as keyof typeof technicalQuestions]?.[domain as any] || 
             technicalQuestions[role as keyof typeof technicalQuestions] || [
        "Tell me about your technical background and experience.",
        "Explain the difference between useCallback and useMemo hooks with practical examples.",
        "Design a RESTful API for a social media platform. What endpoints would you create?",
        "How would you prioritize features for a mobile app with limited development resources?",
        "How would you analyze user engagement data to improve product retention?"
      ];
    } else {
      // Behavioral questions
      const behavioralQuestions = {
        'software-engineer': {
          'Frontend': [
            "Tell me about a time when you had to work with a difficult team member on a frontend project.",
            "Describe a situation where you had to balance user experience with technical constraints.",
            "Give me an example of when you had to advocate for a technical decision to non-technical stakeholders.",
            "Tell me about a time when you received critical feedback on your code. How did you handle it?",
            "Describe a challenging bug you encountered and how you approached solving it."
          ],
          'Backend': [
            "Tell me about a time when you had to optimize system performance under pressure.",
            "Describe a situation where you had to make a trade-off between code quality and delivery timeline.",
            "Give me an example of when you had to troubleshoot a production issue.",
            "Tell me about a time when you disagreed with a technical architecture decision.",
            "Describe how you handled a situation where your code caused a system outage."
          ]
        },
        'product-manager': [
          "Tell me about a time when you had to make a difficult product decision with limited data.",
          "Describe a situation where you had to manage conflicting priorities from different stakeholders.",
          "Give me an example of when you had to pivot a product strategy based on user feedback.",
          "Tell me about a time when you had to influence a team without direct authority.",
          "Describe how you handled a product launch that didn't meet expectations."
        ],
        'data-analyst': [
          "Tell me about a time when your analysis led to an unexpected business insight.",
          "Describe a situation where you had to present complex data to skeptical stakeholders.",
          "Give me an example of when you had to work with incomplete or messy data.",
          "Tell me about a time when you disagreed with a business decision based on your analysis.",
          "Describe how you handled a situation where your analysis was questioned or challenged."
        ]
      };
      
      return behavioralQuestions[role as keyof typeof behavioralQuestions]?.[domain as any] || 
             behavioralQuestions[role as keyof typeof behavioralQuestions] || [
        "Tell me about yourself and your background.",
        "What interests you most about this role?",
        "Describe a challenging project you've worked on recently.",
        "Tell me about a time when you had to work under pressure.",
        "Where do you see yourself in 5 years?"
      ];
    }
  }, [role, domain, mode]);

  React.useEffect(() => {
    // Start with first question
    if (questions.length > 0) {
      const firstQuestion: Message = {
        id: '1',
        type: 'question',
        content: questions[0],
        timestamp: new Date()
      };
      setMessages([firstQuestion]);
    }
  }, [questions]);

  const generateFeedback = (answer: string, question: string): { feedback: string; score: number } => {
    // Simulate LLM evaluation
    const answerLength = answer.trim().length;
    const hasExamples = answer.toLowerCase().includes('example') || answer.toLowerCase().includes('for instance');
    const hasTechnicalTerms = mode === 'technical' && 
      (answer.includes('algorithm') || answer.includes('performance') || answer.includes('scalability'));
    
    let score = 5; // Base score
    let feedback = "Thank you for your response. ";

    if (answerLength < 50) {
      score -= 2;
      feedback += "Consider providing more detailed explanations. ";
    } else if (answerLength > 200) {
      score += 1;
      feedback += "Great level of detail. ";
    }

    if (hasExamples) {
      score += 1;
      feedback += "Excellent use of concrete examples. ";
    }

    if (mode === 'technical' && hasTechnicalTerms) {
      score += 1;
      feedback += "Good technical vocabulary and concepts. ";
    }

    if (mode === 'behavioral' && answer.toLowerCase().includes('result')) {
      score += 1;
      feedback += "Nice use of the STAR method structure. ";
    }

    score = Math.min(Math.max(score, 1), 10);

    const improvements = [
      "Consider providing specific metrics or outcomes.",
      "Think about the challenges you faced and how you overcame them.",
      "Try to connect your answer to the role requirements.",
      "Add more context about your decision-making process."
    ];

    feedback += `Areas for improvement: ${improvements[Math.floor(Math.random() * improvements.length)]}`;

    return { feedback, score };
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    setIsLoading(true);

    // Add user answer
    const answerMessage: Message = {
      id: Date.now().toString(),
      type: 'answer',
      content: currentAnswer,
      timestamp: new Date()
    };

    // Generate feedback
    const { feedback, score } = generateFeedback(currentAnswer, questions[currentQuestion]);
    const feedbackMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'feedback',
      content: feedback,
      score,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, answerMessage, feedbackMessage]);

    // Move to next question or complete
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        const nextQuestion: Message = {
          id: (Date.now() + 2).toString(),
          type: 'question',
          content: questions[currentQuestion + 1],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nextQuestion]);
        setCurrentQuestion(prev => prev + 1);
        setIsLoading(false);
      }, 1000);
    } else {
      // Complete interview
      const allScores = [...messages, feedbackMessage]
        .filter(m => m.type === 'feedback' && m.score)
        .map(m => m.score!);
      const finalScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
      
      setTimeout(() => {
        onComplete([...messages, answerMessage, feedbackMessage], finalScore);
      }, 1000);
    }

    setCurrentAnswer('');
  };

  const handleRetry = () => {
    setCurrentAnswer('');
  };

  const handleSkip = () => {
    const skipMessage: Message = {
      id: Date.now().toString(),
      type: 'answer',
      content: '[Skipped]',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, skipMessage]);

    if (currentQuestion < questions.length - 1) {
      const nextQuestion: Message = {
        id: (Date.now() + 1).toString(),
        type: 'question',
        content: questions[currentQuestion + 1],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, nextQuestion]);
      setCurrentQuestion(prev => prev + 1);
    } else {
      const allScores = messages
        .filter(m => m.type === 'feedback' && m.score)
        .map(m => m.score!);
      const finalScore = allScores.length > 0 ? 
        allScores.reduce((sum, score) => sum + score, 0) / allScores.length : 5;
      
      onComplete([...messages, skipMessage], finalScore);
    }
  };

  const elapsedTime = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60);

  return (
    <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-1" />
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {elapsedTime} min
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 overflow-y-auto mb-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'answer' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl p-4 rounded-lg ${
                message.type === 'question' 
                  ? 'bg-blue-50 border-l-4 border-blue-600 text-gray-800'
                  : message.type === 'answer'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-green-50 border-l-4 border-green-600 text-gray-800'
              }`}>
                {message.type === 'feedback' && message.score && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-700">Feedback</span>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                      {message.score}/10
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">Analyzing your response...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      {currentQuestion < questions.length && !isLoading && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex space-x-2 mb-3">
            <button
              onClick={handleRetry}
              className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </button>
            <button
              onClick={handleSkip}
              className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <SkipForward className="w-4 h-4 mr-1" />
              Skip
            </button>
          </div>
          
          <div className="flex space-x-3">
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSubmitAnswer();
                }
              }}
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Press Ctrl+Enter to submit your answer
          </p>
        </div>
      )}
    </div>
  );
}