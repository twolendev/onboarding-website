import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, Activity, CalendarDays, ShieldAlert, Cpu, CheckCircle2, RotateCcw, Loader2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { submitOnboardingToAI } from './services/api';
import type { OnboardingData, AIPlanResponse } from './services/api';
import type { Result } from './utils/errors';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { RadarEffectDemo } from '@/components/radar-demo';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      icon: <Activity className="w-8 h-8 text-red-500 mb-4" />,
      title: "What are your current lifting stats and strength goals?",
      placeholder: "e.g., I currently squat 100kg but want to reach 140kg by the end of the year. My main goal is raw powerlifting strength...",
    },
    {
      id: 'schedule',
      icon: <CalendarDays className="w-8 h-8 text-red-500 mb-4" />,
      title: "How many days per week can you train, and for how long?",
      placeholder: "e.g., I can train 4 days a week, mostly in the evenings for about 60-90 minutes...",
    },
    {
      id: 'limitations',
      icon: <ShieldAlert className="w-8 h-8 text-red-500 mb-4" />,
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
    setIsModalOpen(false);
    setStep(0);
    setSubmissionResult(null);
    setFormData({ statsAndGoals: '', schedule: '', limitations: '' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionResult(null);
    const result = await submitOnboardingToAI(formData);
    setIsSubmitting(false);
    setSubmissionResult(result);
  };

  const currentQuestion = questions[step];

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden selection:bg-red-900/40">
      
      {/* Permanent Background Elements */}
      <div className={`transition-all duration-700 ${isModalOpen ? 'blur-lg scale-95 opacity-50 pointer-events-none' : 'blur-0 scale-100 opacity-100'}`}>
        <BackgroundPaths onStart={() => setIsModalOpen(true)} />
        <RadarEffectDemo />
      </div>

      {/* Onboarding Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            
            {/* Dark Backdrop */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-red-900/30 shadow-[0_0_50px_rgba(220,38,38,0.15)] rounded-2xl overflow-hidden z-10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-red-300/40 hover:text-red-500 transition-colors p-2 z-50"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 md:p-10">
                {isSubmitting ? (
                  /* ─── Loading State ─── */
                  <div className="flex flex-col items-center gap-6 text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-red-950/30 flex items-center justify-center border border-red-900/20">
                      <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">Forging Your Plan</h2>
                      <p className="text-red-300/40 max-w-sm mx-auto">Claude is analyzing your profile to build a science-backed program.</p>
                    </div>
                  </div>
                ) : submissionResult?.ok ? (
                  /* ─── Result: Success ─── */
                  <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-red-900/20">
                      <div className="w-10 h-10 bg-green-900/20 text-green-500 rounded-full flex items-center justify-center border border-green-800/20">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Your Elite Plan</h2>
                    </div>
                    <article className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-red-100/70 prose-li:text-red-100/70">
                      <ReactMarkdown>{submissionResult.value.plan}</ReactMarkdown>
                    </article>
                    <div className="mt-10 flex justify-center pb-2">
                       <button onClick={handleReset} className="bg-red-600 text-white px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-red-700 transition-all flex items-center gap-2">
                         Start Over <RotateCcw className="w-3 h-3" />
                       </button>
                    </div>
                  </div>
                ) : submissionResult && !submissionResult.ok ? (
                  /* ─── Result: Error ─── */
                  <div className="text-center py-12">
                    <Cpu className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Engine Unreachable</h2>
                    <p className="text-red-300/40 mb-8">{submissionResult.error.message}</p>
                    <button onClick={handleSubmit} className="bg-red-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider">Retry</button>
                  </div>
                ) : (
                  /* ─── Onboarding Questions ─── */
                  <div key={step}>
                    {/* Progress */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Step {step + 1} / {questions.length}</span>
                        <span className="text-xs font-bold text-white">{Math.round((step / questions.length) * 100)}%</span>
                      </div>
                      <div className="h-1 bg-red-950/30 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(step / questions.length) * 100}%` }} />
                      </div>
                    </div>

                    {/* Question */}
                    <div className="space-y-6">
                      <div className="w-12 h-12 bg-red-950/20 rounded-xl flex items-center justify-center border border-red-900/20">
                        {currentQuestion.icon}
                      </div>
                      <h2 className="text-2xl font-bold text-white leading-tight">
                        {currentQuestion.title}
                      </h2>
                      <textarea
                        className="w-full min-h-[140px] p-4 bg-black/40 border border-red-900/20 rounded-xl focus:ring-1 focus:ring-red-600 outline-none transition-all text-red-500 placeholder:text-red-900/40 text-lg scrollbar-hide"
                        placeholder={currentQuestion.placeholder}
                        value={formData[currentQuestion.id as keyof OnboardingData]}
                        onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
                        autoFocus
                      />

                      {/* Footer Buttons */}
                      <div className="flex items-center justify-between pt-4">
                        <button onClick={handleBack} className={`text-xs font-bold uppercase tracking-widest text-red-300/30 hover:text-red-500 transition-colors ${step === 0 ? 'invisible' : ''}`}>
                          ← Back
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={!formData[currentQuestion.id as keyof OnboardingData].trim()}
                          className="bg-white text-black hover:bg-red-600 hover:text-white disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-black transition-all px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2"
                        >
                          {step === questions.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

