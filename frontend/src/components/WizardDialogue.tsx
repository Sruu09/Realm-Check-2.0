import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const WizardDialogue: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const fullMessage = "Greetings, Explorer!\nWelcome back! Your journey towards a brighter you continues. What shall we explore today?";

  useEffect(() => {
    if (isOpen) {
      let i = 0;
      setMessage('');
      const interval = setInterval(() => {
        setMessage((prev) => prev + fullMessage.charAt(i));
        i++;
        if (i >= fullMessage.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get('/api/education/recommended-courses');
      setRecommendations(resp.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 pointer-events-auto"
        >
          <div className="bg-[#191e32] rounded-xl border-4 border-[#33415c] shadow-2xl p-6 relative flex gap-6">
            <div className="w-24 h-24 bg-[#0b1021] border-2 border-[#33415c] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 -ml-2">
              <img
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=Wizard`}
                alt="Wizard"
                className="w-full h-full object-cover scale-150"
              />
            </div>
            <div className="flex-grow pt-1">
              <h3 className="font-bold text-blue-400 mb-2 text-sm tracking-wide">Wizard</h3>
              <p className="font-body text-gray-200 text-sm leading-relaxed whitespace-pre-line min-h-[60px]">
                {message}
                {message.length === fullMessage.length && <span className="animate-pulse ml-1">▼</span>}
              </p>
              {/* Question input */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-2 bg-[#0b1021] border border-[#33415c] rounded text-gray-200"
                />
                <button
                  onClick={handleAsk}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                >
                  Ask Wizard
                </button>
              </div>
              {/* Loading / error / results */}
              {loading && <p className="mt-2 text-yellow-300">Loading recommendations…</p>}
              {error && <p className="mt-2 text-red-400">Error: {error}</p>}
              {recommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-green-300 font-semibold mb-2">Recommended Courses:</h4>
                  <ul className="list-disc list-inside max-h-48 overflow-y-auto">
                    {recommendations.map((rec, idx) => (
                      <li key={idx} className="text-gray-100">
                        {rec.title || rec.provider || rec.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WizardDialogue;
