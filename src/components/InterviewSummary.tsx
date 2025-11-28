import React from 'react';
import { ArrowLeft, Download, TrendingUp, TrendingDown, BookOpen, Award, Target, Clock } from 'lucide-react';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
import { saveAs } from 'file-saver';


interface Message {
  id: string;
  type: 'question' | 'answer' | 'feedback';
  content: string;
  score?: number;
  timestamp: Date;
}

interface InterviewSummaryProps {
  role: string;
  domain: string;
  mode: 'technical' | 'behavioral';
  messages: Message[];
  finalScore: number;
  onNewInterview: () => void;
}

export function InterviewSummary({ 
  role, 
  domain, 
  mode, 
  messages, 
  finalScore,
  onNewInterview 
}: InterviewSummaryProps) {
  const scores = messages.filter(m => m.type === 'feedback' && m.score).map(m => m.score!);
  const questionCount = messages.filter(m => m.type === 'question').length;
  const answeredCount = messages.filter(m => m.type === 'answer' && m.content !== '[Skipped]').length;
  const skippedCount = questionCount - answeredCount;

  const getPerformanceLevel = (score: number) => {
    if (score >= 8) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 6.5) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 5) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const performance = getPerformanceLevel(finalScore);

  const getStrengths = () => {
    const strengths = [];
    const avgScore = finalScore;
    
    if (answeredCount === questionCount) {
      strengths.push("Completed all interview questions");
    }
    
    if (avgScore >= 7) {
      strengths.push("Strong technical knowledge and communication");
    }
    
    if (mode === 'behavioral' && avgScore >= 6) {
      strengths.push("Good use of storytelling and examples");
    }
    
    if (mode === 'technical' && avgScore >= 6) {
      strengths.push("Solid understanding of technical concepts");
    }
    
    const detailedAnswers = messages.filter(m => m.type === 'answer' && m.content.length > 200).length;
    if (detailedAnswers >= questionCount * 0.6) {
      strengths.push("Provided detailed, comprehensive answers");
    }

    return strengths.length > 0 ? strengths : ["Showed up and attempted the interview"];
  };

  const getImprovements = () => {
    const improvements = [];
    
    if (finalScore < 6) {
      improvements.push("Practice explaining concepts more clearly and concisely");
    }
    
    if (skippedCount > 0) {
      improvements.push("Try to attempt all questions, even if unsure");
    }
    
    if (mode === 'behavioral') {
      improvements.push("Use the STAR method (Situation, Task, Action, Result) more consistently");
      improvements.push("Include specific metrics and outcomes in your examples");
    } else {
      improvements.push("Practice coding problems and system design scenarios");
      improvements.push("Explain your thought process while solving problems");
    }
    
    improvements.push("Research the company and role more thoroughly");
    
    return improvements;
  };

  const getRecommendedResources = () => {
    const resources = [];
    
    if (mode === 'technical') {
      resources.push({
        title: "LeetCode Practice",
        description: "Solve coding problems similar to interview questions",
        url: "https://leetcode.com"
      });
      resources.push({
        title: "System Design Primer",
        description: "Learn how to design large-scale distributed systems",
        url: "https://github.com/donnemartin/system-design-primer"
      });
      
      if (domain === 'Frontend') {
        resources.push({
          title: "JavaScript Algorithms and Data Structures",
          description: "Master JS fundamentals for technical interviews",
          url: "https://github.com/trekhleb/javascript-algorithms"
        });
      }
    } else {
      resources.push({
        title: "STAR Method Guide",
        description: "Master the STAR technique for behavioral interviews",
        url: "https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-method"
      });
      resources.push({
        title: "Behavioral Interview Questions",
        description: "Practice common behavioral interview scenarios",
        url: "https://www.glassdoor.com/blog/common-behavioral-interview-questions/"
      });
    }
    
    resources.push({
      title: `${role} Interview Guide`,
      description: `Specific preparation tips for ${role} positions`,
      url: "#"
    });
    
    return resources;
  };

const exportSummary = () => {
  const summaryData = {
    role,
    domain,
    mode,
    finalScore,
    date: new Date().toLocaleDateString(),
    questionCount,
    answeredCount,
    skippedCount,
    strengths: getStrengths(),
    improvements: getImprovements(),
    resources: getRecommendedResources(),
  };

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: `Interview Summary - ${summaryData.role}`, heading: HeadingLevel.TITLE }),
          new Paragraph(`Domain: ${summaryData.domain}`),
          new Paragraph(`Mode: ${summaryData.mode}`),
          new Paragraph(`Date: ${summaryData.date}`),
          new Paragraph(`Final Score: ${summaryData.finalScore.toFixed(1)}/10`),
          new Paragraph(`Answered: ${summaryData.answeredCount}/${summaryData.questionCount}`),
          new Paragraph(`Skipped: ${summaryData.skippedCount}`),

          new Paragraph({ text: "Strengths", heading: HeadingLevel.HEADING_2 }),
          ...summaryData.strengths.map((s) => new Paragraph(`• ${s}`)),

          new Paragraph({ text: "Areas for Improvement", heading: HeadingLevel.HEADING_2 }),
          ...summaryData.improvements.map((i) => new Paragraph(`• ${i}`)),

          new Paragraph({ text: "Recommended Resources", heading: HeadingLevel.HEADING_2 }),
          ...summaryData.resources.map((res) =>
            new Paragraph({
              children: [
                new TextRun({ text: `${res.title}: `, bold: true }),
                new TextRun(`${res.description} (${res.url})`)
              ]
            })
          )
        ]
      }
    ]
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `interview-summary-${role}-${Date.now()}.docx`);
  });
};


  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={onNewInterview}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Start New Interview
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
          <p className="text-gray-600">
            {role} - {domain} • {mode === 'technical' ? 'Technical' : 'Behavioral'} Interview
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className={`px-4 py-2 rounded-full ${performance.bgColor} ${performance.color} font-semibold`}>
              {performance.level}
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {finalScore.toFixed(1)}/10
          </div>
          <p className="text-gray-600">Overall Interview Score</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{answeredCount}/{questionCount}</div>
            <div className="text-sm text-blue-700">Questions Answered</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">
              {scores.length > 0 ? Math.max(...scores) : 0}
            </div>
            <div className="text-sm text-green-700">Highest Score</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">
              {Math.ceil(messages.length * 2)} min
            </div>
            <div className="text-sm text-purple-700">Estimated Duration</div>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-900">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {getStrengths().map((strength, index) => (
                <li key={index} className="flex items-start text-green-800">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <TrendingDown className="w-6 h-6 text-amber-600 mr-2" />
              <h3 className="text-lg font-semibold text-amber-900">Areas for Improvement</h3>
            </div>
            <ul className="space-y-2">
              {getImprovements().map((improvement, index) => (
                <li key={index} className="flex items-start text-amber-800">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Resources */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-900">Recommended Resources</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getRecommendedResources().map((resource, index) => (
              <div key={index} className="bg-white border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-1">{resource.title}</h4>
                <p className="text-sm text-blue-700 mb-2">{resource.description}</p>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Learn more →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={exportSummary}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Summary
          </button>
          <button
            onClick={onNewInterview}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Practice Another Interview
          </button>
        </div>
      </div>
    </div>
  );
}