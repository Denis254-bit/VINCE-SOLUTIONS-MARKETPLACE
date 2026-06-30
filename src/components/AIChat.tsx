import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { motion } from 'motion/react';

export const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
        { role: 'ai', text: 'Hello! How can I help you today?' }
    ]);
    const [loading, setLoading] = useState(false);

    const templates = [
        "📦 Where is my order?",
        "🔄 What is the return policy?",
        "🔍 Do you have more laptops in stock?",
    ];

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage = { role: 'user' as const, text };
        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch response');
            }
            setMessages(prev => [...prev, { role: 'ai', text: data.text || 'Sorry, I could not generate a response.' }]);
        } catch (error: any) {
            setMessages(prev => [...prev, { role: 'ai', text: `Error: ${error.message || 'Could not reach the assistant.'}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(message);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {isOpen ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="w-80 h-[28rem] sm:h-[32rem] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
                >
                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                        <span className="font-bold flex items-center gap-2"><Bot className="w-4 h-4"/> AI Assistant</span>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setMessages([{ role: 'ai', text: 'Hello! How can I help you today?' }])} 
                                className="text-[10px] text-slate-400 hover:text-white uppercase tracking-wide font-bold"
                            >
                                Restart
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-slate-800 text-slate-300 hover:text-white transition-colors p-1.5 rounded-lg flex items-center gap-1 text-xs font-bold"
                            >
                                Close <X className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        <>{messages.map((m, i) => (
                            <div key={i} className={`text-sm p-2.5 rounded-lg ${m.role === 'user' ? 'bg-indigo-50 ml-auto max-w-[85%]' : 'bg-slate-100 mr-auto max-w-[85%]'}`}>
                                {m.text}
                            </div>
                        ))}</>
                        {loading ? (
                            <div className="text-sm p-2.5 rounded-lg bg-slate-100 mr-auto max-w-[85%] text-slate-500 animate-pulse">
                                Thinking...
                            </div>
                        ) : null}
                    </div>
                    
                    {messages.length === 1 && (
                        <div className="px-3 pb-3 flex flex-wrap gap-2">
                            {templates.map((template, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => sendMessage(template)}
                                    className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors text-left"
                                >
                                    {template}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Ask for help..."
                        />
                        <button type="submit" disabled={loading || !message.trim()} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </motion.div>
            ) : (
                <motion.button
                    onClick={() => setIsOpen(true)}
                    className="relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-[0_10_30px_rgba(0,0,0,0.2)] hover:shadow-[0_10_40px_rgba(0,0,0,0.3)] transition-shadow group p-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div
                        className="w-full h-full rounded-full overflow-hidden"
                        animate={{ 
                            scale: [1, 1.08, 1],
                        }}
                        transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <img 
                            src="https://tse1.mm.bing.net/th/id/OIP.uQ2VpXpRozJ1WQ209K6GFAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" 
                            alt="AI Assistant"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </motion.div>
                    <span className="absolute top-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-white shadow-sm"></span>
                </motion.button>
            )}
        </div>
    );
};
