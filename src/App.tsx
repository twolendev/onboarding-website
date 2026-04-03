import { useState } from 'react';
import { ChevronRight, Dumbbell, Activity, CalendarDays, ShieldAlert, Cpu, CheckCircle2, RotateCcw } from 'lucide-react';
import { submitOnboardingToAI } from './services/api';
import type { OnboardingData, AIPlanResponse } from './services/api';
import type { Result } from './utils/errors';

export default function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    statsAndGoals: '',
    schedule: '',
    limitations: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<Result<AIPlanResponse> | null>(null);

  const questions = [
    {
      id: 'statsAndGoals',
      icon: <Activity className="w-8 h-8 text-black mb-4" />,
      title: "What are your current lifting stats and strength goals?",
      placeholder: "e.g., I currently squat 100kg but want to reach 140kg by the end of the year. My main goal is raw powerlifting strength...",
    },
    {
      id: 'schedule',
      icon: <CalendarDays className="w-8 h-8 text-black mb-4" />,
      title: "How many days per week can you train, and for how long?",
      placeholder: "e.g., I can train 4 days a week, mostly in the evenings for about 60-90 minutes...",
    },
    {
      id: 'limitations',
      icon: <ShieldAlert className="w-8 h-8 text-black mb-4" />,
      title: "Do you have any injuries or movement limitations?",
      placeholder: "e.g., I have a slight shoulder impingement on my left side, avoiding overhead barbell presses...",
    }
  ];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setSubmissionResult(null);
    }
  };

  const handleReset = () => {
    setStep(0);
    setSubmissionResult(null);
    setFormData({ statsAndGoals: '', schedule: '', limitations: '' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionResult(null);
    
    // Simulate real request with circuit breaker + error boundary
    const result = await submitOnboardingToAI(formData);
    
    setIsSubmitting(false);
    setSubmissionResult(result);
  };

  // Determine content based on current step
  const renderContent = () => {
    if (submissionResult) {
      if (submissionResult.ok) {
        return (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4 font-sans tracking-tight">Plan Generated!</h2>
            <p className="text-muted-foreground max-w-md mb-8 text-lg">
              {submissionResult.value.message}
            </p>
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 w-full max-w-md mb-8">
              <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider mb-2">Plan ID</p>
              <p className="text-2xl font-mono text-black">{submissionResult.value.planId}</p>
            </div>
            <button
              onClick={handleReset}
              className="bg-black text-white hover:bg-zinc-800 transition-colors px-6 py-3 rounded-md font-medium inline-flex items-center gap-2 group"
            >
              Start Over <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-300" />
            </button>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <Cpu className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4 font-sans tracking-tight">AI Engine Unreachable</h2>
            <p className="text-muted-foreground max-w-md mb-4 text-lg">
              We couldn't connect to the AI brain right now. Our circuit breaker prevented cascading failures.
            </p>
            <div className="bg-red-50 border border-red-100 text-red-800 rounded-lg p-4 w-full max-w-md mb-8 text-sm text-left">
              <strong>Error Details:</strong> {submissionResult.error.message}
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="bg-white border border-zinc-200 text-black hover:bg-zinc-50 transition-colors px-6 py-3 rounded-md font-medium"
              >
                Go Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-black text-white hover:bg-zinc-800 transition-colors px-6 py-3 rounded-md font-medium inline-flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Retrying...' : 'Retry Submission'}
              </button>
            </div>
          </div>
        );
      }
    }

    const currentQuestion = questions[step];
    
    return (
      <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500" key={step}>
        
        {/* Progress Bar & Indicators */}
        <div className="w-full mb-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-zinc-500 tracking-wide uppercase">Question {step + 1} of {questions.length}</span>
            <span className="text-sm font-medium text-black">{Math.round((step / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-500 ease-out" 
              style={{ width: `${(step / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="bg-white border border-zinc-100 shadow-sm rounded-xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-black transition-all duration-300"></div>
          {currentQuestion.icon}
          <h2 className="text-2xl font-bold font-sans tracking-tight text-black mb-6">
            {currentQuestion.title}
          </h2>
          <textarea
            className="w-full min-h-[160px] p-4 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none text-black placeholder:text-zinc-400"
            placeholder={currentQuestion.placeholder}
            value={formData[currentQuestion.id as keyof OnboardingData]}
            onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
            autoFocus
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6">
          <button
            onClick={handleBack}
            className={`px-6 py-3 font-medium text-zinc-600 hover:text-black transition-colors ${step === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            ← Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={isSubmitting || !formData[currentQuestion.id as keyof OnboardingData].trim()}
            className="group bg-black text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all px-8 py-3 rounded-md font-medium inline-flex items-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 animate-pulse" /> Processing...
              </span>
            ) : step === questions.length - 1 ? (
              'Generate Plan'
            ) : (
              <span className="flex items-center gap-2">
                Continue <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-200">
      
      {/* Header */}
      <header className="border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 w-full">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-sm">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight leading-none text-black">Aura<span className="text-zinc-400">Strength</span></h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mt-1">AI Powered Science</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        {renderContent()}
      </main>

    </div>
  );
}
