import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, CarFront } from 'lucide-react';
import { Car } from '@/lib/car-data';
import { generateCarRecommendation } from '@/lib/ai';
import ReactMarkdown from 'react-markdown';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  allCars: Car[];
}

export function FindMyCarModal({ isOpen, onClose, allCars }: Props) {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  
  const [answers, setAnswers] = useState({
    budget: '',
    purpose: '',
    commute: '',
    fuel: '',
    longevity: '',
    safety: '',
    brand: ''
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    setStep(5); // Move to analyzing/result step

    try {
      const recommendationText = await generateCarRecommendation(answers, allCars);
      setRecommendation(recommendationText || 'Sorry, I could not generate a recommendation at this time.');
    } catch (error) {
      console.error('AI Error:', error);
      setRecommendation('Sorry, an error occurred while analyzing your profile. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setAnswers({ budget: '', purpose: '', commute: '', fuel: '', longevity: '', safety: '', brand: '' });
    setRecommendation('');
    onClose();
  };

  const renderOptions = (field: keyof typeof answers, options: string[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => setAnswers(prev => ({ ...prev, [field]: opt }))}
          className={`p-3 rounded-xl border text-sm font-medium transition-all text-left
            ${answers[field] === opt 
              ? 'border-zinc-900 bg-zinc-900 text-white shadow-md' 
              : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-zinc-900 font-bold text-lg">
            <Sparkles className="text-amber-500" size={20} />
            AI Car Matchmaker
          </div>
          <button onClick={resetAndClose} className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">What is your approximate budget?</h3>
                {renderOptions('budget', ['Under ₹10 Lakhs', '₹10L - ₹15 Lakhs', '₹15L - ₹20 Lakhs', 'Above ₹20 Lakhs'])}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">What is the primary purpose of this car?</h3>
                {renderOptions('purpose', ['Daily City Commute', 'Highway Cruising', 'Family Trips', 'Mixed Usage'])}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">How long is your daily commute?</h3>
                {renderOptions('commute', ['Less than 20 km', '20 - 50 km', 'More than 50 km', 'I work from home'])}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">Do you have a fuel preference?</h3>
                {renderOptions('fuel', ['Petrol', 'Diesel', 'CNG', 'Electric (EV)', 'No Preference'])}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">How long do you plan to keep this car?</h3>
                {renderOptions('longevity', ['1-3 years (Frequent upgrades)', '4-7 years (Standard)', '8+ years (Long term)'])}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">How important is safety to you?</h3>
                {renderOptions('safety', ['5-Star Rated Only', '4+ Stars Preferred', 'Basic Safety is fine'])}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">Do you have a preferred car brand?</h3>
                {renderOptions('brand', ['Tata', 'Mahindra', 'Hyundai', 'Maruti Suzuki', 'Kia', 'No Preference'])}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col items-center justify-center min-h-[300px]">
              {isAnalyzing ? (
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-zinc-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-zinc-900 rounded-full border-t-transparent animate-spin"></div>
                    <CarFront size={32} className="text-zinc-900 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900">Analyzing your profile...</h3>
                    <p className="text-zinc-500 mt-2">Matching your lifestyle with our database.</p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold tracking-wide uppercase mb-4">
                    <Sparkles size={14} />
                    Your Perfect Match
                  </div>
                  <div className="markdown-body prose prose-zinc max-w-none prose-p:leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => (
                          <div className="not-prose bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-5 md:p-6 rounded-2xl shadow-xl mb-8 mt-2 flex items-center gap-4 border border-zinc-700">
                            <div className="bg-zinc-800/80 p-3 rounded-xl border border-zinc-600/50 shrink-0 shadow-inner">
                              <CarFront size={32} className="text-amber-400" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold m-0 text-white tracking-tight" {...props} />
                          </div>
                        )
                      }}
                    >
                      {recommendation}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 5 && (
          <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 disabled:opacity-0 transition-all flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Back
            </button>
            
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'w-6 bg-zinc-900' : 'w-2 bg-zinc-200'}`} />
              ))}
            </div>

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!answers.budget || !answers.purpose)) || 
                  (step === 2 && (!answers.commute || !answers.fuel)) ||
                  (step === 3 && (!answers.longevity || !answers.safety))
                }
                className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!answers.brand}
                className="px-6 py-2.5 bg-amber-500 text-white text-sm font-bold rounded-full hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
              >
                Find My Car <Sparkles size={16} />
              </button>
            )}
          </div>
        )}
        {step === 5 && !isAnalyzing && (
          <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end">
             <button
                onClick={resetAndClose}
                className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition-all shadow-sm"
              >
                Done
              </button>
          </div>
        )}
      </div>
    </div>
  );
}
