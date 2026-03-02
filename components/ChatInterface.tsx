'use client';

import { useState, useRef, useEffect } from 'react';
import { Car } from '@/lib/car-data';
import { GoogleGenAI } from '@google/genai';
import { Send, User, CarFront, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  contextCars: Car[];
  allCars: Car[];
}

export function ChatInterface({ contextCars, allCars }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hi! I\'m Alex, your personal car concierge. I can help you compare cars or answer questions about specific models. What are you looking for today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setIsLoading(true);

    const UNSUPPORTED_KEYWORDS = [
      'bmw', 'audi', 'mercedes', 'chevrolet', 'chevy', 'nissan', 'volkswagen', 'vw', 'subaru', 
      'porsche', 'lexus', 'mazda', 'jeep', 'dodge', 'ram', 'gmc', 'rivian', 'lucid', 'polestar', 'volvo', 
      'ferrari', 'lamborghini', 'mclaren', 'aston martin', 'bentley', 'rolls royce', 'maserati', 'alfa romeo',
      'fiat', 'mini', 'land rover', 'range rover', 'jaguar', 'acura', 'infiniti', 'lincoln', 'cadillac', 'buick',
      'chrysler', 'mitsubishi', 'genesis', 'civic', 'corolla', 'elantra', 'malibu', 'altima', 'f-150', 'silverado', 'rav4', 'cr-v', 'model s', 'model x', 'model y', 'prius',
      'toyota', 'honda', 'tesla', 'ford', 'camry', 'accord', 'mustang', 'sonata'
    ];

    const isOutOfScope = UNSUPPORTED_KEYWORDS.some(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      return regex.test(userMsg);
    });

    if (isOutOfScope) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: 'I am currently working on adding more cars. Please select from these 5 for now:\n- Tata Nexon\n- Mahindra XUV700\n- Hyundai Creta\n- Maruti Suzuki Swift\n- Kia Seltos' 
        }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const systemInstruction = `
        You are an expert car comparison assistant. 
        You MUST ONLY use the following structured car data to answer questions.
        DO NOT hallucinate or invent specifications. If the data is not provided, say "I don't have that information."
        
        Currently Selected Cars for Comparison Context:
        ${JSON.stringify(contextCars, null, 2)}
        
        All Available Cars in Database:
        ${JSON.stringify(allCars, null, 2)}
        
        CRITICAL FORMATTING RULES:
        1. When a user asks for a COMPARISON between two or more cars, you MUST use a Markdown table.
           Example Table Format:
           | Feature | Car A | Car B |
           |---|---|---|
           | Price | $20,000 | $22,000 |
           | Mileage | 30 mpg | 28 mpg |
        2. When a user asks for SPECIFICATIONS of a single car, use a clean bulleted list with bold labels.
           Example:
           - **Make & Model:** Toyota Camry
           - **Price:** $26,420
           - **Engine:** 2.5L 4-cylinder
        3. Keep answers concise, professional, and directly address the user's question.
      `;

      const contents = [
        ...messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        { role: 'user', parts: [{ text: userMsg }] }
      ];

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents,
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature to prevent hallucination
        }
      });
      
      const assistantMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

      let fullResponse = '';
      for await (const chunk of responseStream) {
        const text = chunk.text || '';
        fullResponse += text;
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId ? { ...msg, content: fullResponse } : msg
        ));
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-zinc-200 bg-white flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-100 shadow-sm shrink-0">
          <Image src="https://picsum.photos/seed/carexpert/100/100" alt="Alex - Car Expert" fill className="object-cover" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 flex items-center gap-1">
            Alex <Sparkles size={14} className="text-amber-500" />
          </h3>
          <p className="text-xs text-zinc-500">
            {contextCars.length > 0 
              ? `Comparing: ${contextCars.map(c => c.model).join(', ')}` 
              : 'Your personal car concierge'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${msg.role === 'user' ? 'bg-zinc-100 text-zinc-600' : 'bg-zinc-100 border border-zinc-200'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Image src="https://picsum.photos/seed/carexpert/100/100" alt="Alex" width={32} height={32} className="object-cover" referrerPolicy="no-referrer" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-zinc-900 text-white rounded-tr-none' 
                : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm'
            }`}>
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <div className="markdown-body prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-50 prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-slate-300 prose-th:bg-slate-200 prose-th:p-2 prose-th:text-left prose-td:border prose-td:border-slate-300 prose-td:p-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-zinc-100 border border-zinc-200">
              <Image src="https://picsum.photos/seed/carexpert/100/100" alt="Alex" width={32} height={32} className="object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl rounded-tl-none px-4 py-3 text-zinc-500 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CarFront size={18} className="animate-bounce text-zinc-900" />
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
              <span className="text-sm font-medium">Alex is reviewing specs...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-zinc-200 bg-white">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {contextCars.length === 0 ? (
              <>
                <button onClick={() => setInput("Which SUV has the best mileage?")} className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors border border-zinc-200">
                  Which SUV has the best mileage?
                </button>
                <button onClick={() => setInput("What are the safest cars under 15 lakhs?")} className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors border border-zinc-200">
                  What are the safest cars under 15 lakhs?
                </button>
                <button onClick={() => setInput("Which car is the most powerful?")} className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors border border-zinc-200">
                  Which car is the most powerful?
                </button>
              </>
            ) : contextCars.length === 1 ? (
              <>
                <button onClick={() => setInput(`What is the mileage of the ${contextCars[0].make} ${contextCars[0].model}?`)} className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors border border-zinc-200">
                  What is the mileage of the {contextCars[0].make} {contextCars[0].model}?
                </button>
                <button onClick={() => setInput(`What are the key features of the ${contextCars[0].make} ${contextCars[0].model}?`)} className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors border border-zinc-200">
                  What are the key features of the {contextCars[0].make} {contextCars[0].model}?
                </button>
                <button onClick={() => setInput(`What is the safety rating of the ${contextCars[0].make} ${contextCars[0].model}?`)} className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors border border-zinc-200">
                  What is the safety rating of the {contextCars[0].make} {contextCars[0].model}?
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setInput(`Compare the mileage of the ${contextCars.map(c => c.model).join(' and ')}.`)} className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors border border-zinc-200">
                  Compare the mileage of the {contextCars.map(c => c.model).join(' and ')}.
                </button>
                <button onClick={() => setInput(`Which is more powerful: ${contextCars.map(c => c.model).join(' or ')}?`)} className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors border border-zinc-200">
                  Which is more powerful: {contextCars.map(c => c.model).join(' or ')}?
                </button>
                <button onClick={() => setInput(`Compare the safety ratings of the selected cars.`)} className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors border border-zinc-200">
                  Compare the safety ratings of the selected cars.
                </button>
              </>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Alex about mileage, features..."
            className="flex-1 border border-zinc-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-zinc-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
