import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { ChatMessage, MemoSection } from '../types';

interface SuggestionsPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  onInsert: (content: string) => void;
  onGenerate: (section: MemoSection) => void;
  isGenerationDisabled: boolean;
}

const memoSections: MemoSection[] = [
    { id: 'summary', title: '1. Executive Summary' },
    { id: 'borrower', title: '2. Borrower Information' },
    { id: 'request', title: '3. Loan Request' },
    { id: 'financial', title: '4. Financial Analysis' },
    { id: 'collateral', title: '5. Collateral Analysis' },
    { id: 'swot', title: '6. SWOT Analysis' },
    { id: 'recommendation', title: '7. Recommendation' },
];

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ messages, isLoading, error, onSendMessage, onInsert, onGenerate, isGenerationDisabled }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const Message = ({ msg }: { msg: ChatMessage }) => {
    const isModel = msg.role === 'model';
    return (
      <div className={`w-full flex ${isModel ? 'justify-start' : 'justify-end'}`}>
        <div className={`max-w-[85%] rounded-lg px-4 py-2 ${isModel ? 'bg-gray-700' : 'bg-blue-600'}`}>
          <div className="text-gray-200 whitespace-pre-wrap font-sans text-sm"
             dangerouslySetInnerHTML={{ __html: msg.content.replace(/## (.*)/g, '<strong>$1</strong>') }}
          >
          </div>
          {msg.isSuggestion && (
            <button
              onClick={() => onInsert(msg.content)}
              className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-md text-xs transition-colors"
            >
              Insert into Memo
            </button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-lg font-bold mb-3 flex-shrink-0 flex items-center gap-2"><SparklesIcon /> AI Assistant</h2>
      <div className="flex-grow bg-gray-900 rounded-md p-3 overflow-y-auto min-h-[200px] flex flex-col space-y-4">
        {messages.map((msg, index) => <Message key={index} msg={msg} />)}
        {isLoading && (
            <div className="w-full flex justify-start">
                <div className="max-w-[85%] rounded-lg px-4 py-2 bg-gray-700">
                    <div className="flex items-center gap-2 text-gray-400">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                        <span className="text-sm">Thinking...</span>
                    </div>
                </div>
            </div>
        )}
        {error && (
          <div className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm">
            <p className="font-semibold">An Error Occurred</p>
            <p>{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700 flex-shrink-0">
        <div className="flex flex-wrap gap-2 mb-4">
            {memoSections.map(section => (
                <button
                    key={section.id}
                    onClick={() => onGenerate(section)}
                    disabled={isLoading || isGenerationDisabled}
                    className="flex items-center gap-1.5 bg-blue-600/80 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-1 px-3 rounded-full text-xs transition-colors"
                    title={isGenerationDisabled ? "You have reached your monthly generation limit." : `Generate ${section.title}`}
                >
                    <SparklesIcon className="h-3.5 w-3.5" />
                    <span>{section.title.split('. ')[1]}</span>
                </button>
            ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "Waiting for response..." : "Or ask a follow-up question..."}
            disabled={isLoading}
            className="flex-grow bg-gray-700 text-gray-200 placeholder-gray-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold p-2 rounded-md transition-colors"
            aria-label="Send message"
          >
            <PaperAirplaneIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuggestionsPanel;
