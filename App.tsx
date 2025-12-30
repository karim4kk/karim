
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Trash2, Camera, Scale } from 'lucide-react';
import { LAWS, RANKS, MANIP_TASKS } from './constants';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: 'مرحبا بك انا هنا لاساعدك فقط' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        أنت "شات جيبيتي مانيب" - المحلل الذكي للجريدة الرسمية رقم 87.
        مهمتك: استغلال كل حرف من القانون للإجابة بدكاء، حتى لو كان سؤال المستخدم ناقصاً.
        
        المرجع القانوني الصارم (المرسوم 24-422):
        1. سلك مشغلي أجهزة التصوير (المانيب):
           - الرتبة القاعدية (SP): صنف 12، الرقم الاستدلالي 737.
           - رتبة متخصص: صنف 13، الرقم الاستدلالي 778.
           - رتبة ممتاز: صنف 14، الرقم الاستدلالي 821.
           - رتبة في رئيس: صنف 15، الرقم الاستدلالي 866.
        2. الرتب الآيلة للزوال: صنف 10 (دولة)، صنف 9 (بريفيتي).
        3. المواد 240-255 (المهام): ${MANIP_TASKS}
        4. المادة 30 (الترقية): 
           - ترقية بقوة القانون بعد 5 سنوات من الخدمة الفعلية عبر امتحان مهني.
           - ترقية عبر التسجيل في قائمة التأهيل بعد 10 سنوات من الخدمة الفعلية.
        5. ذكاء البحث: إذا سأل المستخدم عن "صنف 12" استنتج فوراً أنه يسأل عن الرتبة القاعدية وأعطه مهامها وترقيتها. إذا سأل عن "كيف أصعد" اشرح له المادة 30 بالتفصيل.
        6. لغتك: عربية إدارية رسمية. لا تضف أي مقدمات أو خاتمة خارج الإجابة القانونية.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction,
          temperature: 0.1, // قليل من المرونة لفهم سياق المستخدم غير الواضح
        }
      });

      setMessages(prev => [...prev, { role: 'bot', content: response.text || "المعلومة المطلوبة غير واردة في نصوص الجريدة 87." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "خطأ فني. حاول لاحقاً." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-['Tajawal'] text-slate-900">
      {/* Header Name Fixed */}
      <header className="bg-[#0f172a] text-white p-5 shadow-2xl border-b-4 border-cyan-500 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-500 p-2 rounded-xl">
              <Camera size={24} className="text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-black">شات جيبيتي مانيب</h1>
            </div>
          </div>
          <button onClick={() => setMessages([messages[0]])} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Trash2 size={18} className="text-slate-500" />
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col max-w-4xl w-full mx-auto p-3 md:p-6 overflow-hidden">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 flex-grow flex flex-col overflow-hidden relative">
          
          <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex gap-3 max-w-[92%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                    msg.role === 'user' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-cyan-50 text-cyan-700 border-cyan-100'
                  }`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none font-medium'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="flex flex-row-reverse gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center animate-pulse">
                    <Loader2 size={20} className="animate-spin text-cyan-600" />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 text-slate-400 text-xs italic">
                    جاري البحث الذكي في كل حرف من القانون...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 md:p-8 bg-white border-t border-slate-50">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اسأل عن أي شيء يخص المانيب..."
                className="w-full pl-16 pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-600 focus:outline-none transition-all text-sm md:text-base bg-slate-50/50 focus:bg-white"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#0f172a] text-white p-3 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-20"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
               <Scale size={10} />
               <span>نظام استنتاج قانوني حصري للجريدة الرسمية 87</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
