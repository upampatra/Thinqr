import React, { useState, useCallback, useEffect } from 'react';
import { FinancialDocument, MemoSection, User, MEMBERSHIP_LIMITS, ChatMessage } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ContextViewer from './components/ContextViewer';
import Editor from './components/Editor';
import SuggestionsPanel from './components/SuggestionsPanel';
import { generateMemoSection, generateChatResponse } from './services/geminiService';
import { PaperclipIcon } from './components/icons/PaperclipIcon';
import { BookOpenIcon } from './components/icons/BookOpenIcon';
import { ChevronLeftIcon } from './components/icons/ChevronLeftIcon';
import Login from './components/Login';
import UpgradeModal from './components/UpgradeModal';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FinancialDocument[]>([]);
  const [memoContent, setMemoContent] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [contextMd, setContextMd] = useState<string>('Loading context...');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [activeLeftPanel, setActiveLeftPanel] = useState<'documents' | 'context' | null>(null);

  const hasReachedGenerationLimit = user ? user.generationsUsed >= MEMBERSHIP_LIMITS[user.tier] : true;

  useEffect(() => {
    fetch('assets/context.md')
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text()
    })
      .then(text => {
        setContextMd(text);
      })
      .catch(error => {
        console.error('Error fetching context.md:', error);
        const errorMessage = 'Failed to load context guide. Please check the file path and network.';
        setContextMd(errorMessage);
      });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
        setMessages([
            {
                role: 'model',
                content: 'Welcome! Upload your financial documents and select a memo section to generate, or ask me a question about your documents below.',
            }
        ]);
        setUploadedFiles([]);
        setMemoContent('');
    }
  }, [isLoggedIn]);

  const handleLeftPanelToggle = (panel: 'documents' | 'context') => {
    setActiveLeftPanel(current => (current === panel ? null : panel));
  };

  const handleLogin = (provider: 'google' | 'facebook') => {
    console.log(`Simulating login with ${provider}`);
    setUser({ name: 'Demo User', tier: 'Free', generationsUsed: 0 });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleUpgrade = () => {
    if (!user) return;
    setUser({ ...user, tier: 'Pro' });
    setIsUpgradeModalOpen(false);
  };

  const handleFilesUpload = (files: FinancialDocument[]) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleGenerateSection = useCallback(async (section: MemoSection) => {
    if (!user) {
        setError('You must be logged in to generate content.');
        return;
    }

    if (hasReachedGenerationLimit) {
        setError(`You've reached your monthly limit of ${MEMBERSHIP_LIMITS[user.tier]} generations. Please upgrade your plan.`);
        setIsUpgradeModalOpen(true);
        return;
    }

    if (uploadedFiles.length === 0) {
      setError('Please upload at least one financial document to generate a section.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const result = await generateMemoSection(section.title, uploadedFiles, contextMd);
      const newMessage: ChatMessage = { role: 'model', content: result, isSuggestion: true };
      setMessages(prev => [...prev, newMessage]);
      setUser(currentUser => currentUser ? { ...currentUser, generationsUsed: currentUser.generationsUsed + 1 } : null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate suggestion: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFiles, contextMd, user, hasReachedGenerationLimit]);

  const handleSendChatMessage = useCallback(async (message: string) => {
    if (!user) {
        setError('You must be logged in to chat.');
        return;
    }

    if (hasReachedGenerationLimit) {
        setError(`You've reached your monthly limit of ${MEMBERSHIP_LIMITS[user.tier]} generations. Please upgrade your plan.`);
        setIsUpgradeModalOpen(true);
        return;
    }

     if (uploadedFiles.length === 0) {
      setError('Please upload documents to chat about them.');
      return;
    }

    setError(null);
    const newUserMessage: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
        const result = await generateChatResponse(message, uploadedFiles);
        const newModelMessage: ChatMessage = { role: 'model', content: result };
        setMessages(prev => [...prev, newModelMessage]);
        setUser(currentUser => currentUser ? { ...currentUser, generationsUsed: currentUser.generationsUsed + 1 } : null);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to generate chat response: ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
  }, [uploadedFiles, user, hasReachedGenerationLimit]);

  const handleInsertSuggestion = (suggestion: string) => {
    if (!suggestion) return;
    const currentSectionTitle = suggestion.match(/^##\s*(.*)/)?.[0] || '';

    setMemoContent(prevContent => {
        let newContent = prevContent;
        if (currentSectionTitle && prevContent.includes(currentSectionTitle)) {
             const suggestionContent = suggestion.substring(suggestion.indexOf('\n') + 1);
             const regex = new RegExp(`(${currentSectionTitle})([\\s\\S]*?)(?=##|$)`);
             newContent = prevContent.replace(regex, `${currentSectionTitle}\n${suggestionContent}`);
        } else {
            newContent = `${prevContent}\n\n${suggestion}`.trim();
        }
        return newContent;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 font-sans">
      <Header 
        isLoggedIn={isLoggedIn} 
        user={user} 
        onLogout={handleLogout}
        onUpgradeClick={() => setIsUpgradeModalOpen(true)} 
      />
      {isLoggedIn && user ? (
        <>
            <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 min-h-0">
              {/* Left Panel */}
              <aside className={`flex-shrink-0 flex flex-col gap-4 transition-all duration-300 w-full ${activeLeftPanel === null ? 'md:w-20' : 'md:w-[350px]'}`}>
                {/* Documents Panel */}
                <div className={`${activeLeftPanel === 'documents' ? 'flex-grow flex flex-col' : 'flex-shrink-0'}`}>
                    {activeLeftPanel === 'documents' ? (
                        <div className="bg-gray-800 rounded-lg p-4 flex flex-col min-h-0 h-full">
                            <div className="flex justify-between items-center mb-3 flex-shrink-0">
                                <h2 className="text-lg font-bold flex items-center gap-2"><PaperclipIcon /> Uploaded Documents</h2>
                                <button onClick={() => handleLeftPanelToggle('documents')} className="p-1 rounded-md hover:bg-gray-700 transition-colors" aria-label="Collapse Documents Panel">
                                    <ChevronLeftIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex-grow flex flex-col gap-4 overflow-hidden">
                                <FileUpload onFilesUpload={handleFilesUpload} />
                                <div className="space-y-2 overflow-y-auto">
                                    {uploadedFiles.map((file, index) => (
                                        <div key={index} className="bg-gray-700 p-2 rounded text-sm truncate">{file.name}</div>
                                    ))}
                                    {uploadedFiles.length === 0 && <p className="text-gray-400 text-sm">No documents uploaded.</p>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => handleLeftPanelToggle('documents')} className="w-full bg-gray-800 p-3 rounded-lg hover:bg-gray-700 flex items-center justify-center transition-colors" title="Uploaded Documents">
                            <PaperclipIcon className="h-6 w-6" />
                        </button>
                    )}
                </div>

                {/* Context Guide Panel */}
                <div className={`${activeLeftPanel === 'context' ? 'flex-grow flex flex-col' : 'flex-shrink-0'}`}>
                    {activeLeftPanel === 'context' ? (
                        <div className="bg-gray-800 rounded-lg p-4 flex flex-col min-h-0 h-full">
                            <div className="flex justify-between items-center mb-3 flex-shrink-0">
                                <h2 className="text-lg font-bold flex items-center gap-2"><BookOpenIcon /> Context Guide</h2>
                                <button onClick={() => handleLeftPanelToggle('context')} className="p-1 rounded-md hover:bg-gray-700 transition-colors" aria-label="Collapse Context Guide">
                                    <ChevronLeftIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <ContextViewer content={contextMd} onContentChange={setContextMd} />
                        </div>
                    ) : (
                         <button onClick={() => handleLeftPanelToggle('context')} className="w-full bg-gray-800 p-3 rounded-lg hover:bg-gray-700 flex items-center justify-center transition-colors" title="Context Guide">
                            <BookOpenIcon className="h-6 w-6" />
                        </button>
                    )}
                </div>
              </aside>

              {/* Center & Right Panels */}
              <div className="flex-grow w-full flex flex-col md:flex-row gap-4 min-h-0">
                <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col min-h-0">
                  <Editor 
                    content={memoContent} 
                    onContentChange={setMemoContent}
                  />
                </div>
                <aside className="w-full md:w-2/5 lg:w-1/3 flex flex-col">
                  <SuggestionsPanel 
                    messages={messages}
                    isLoading={isLoading} 
                    error={error} 
                    onSendMessage={handleSendChatMessage}
                    onInsert={handleInsertSuggestion}
                    onGenerate={handleGenerateSection}
                    isGenerationDisabled={hasReachedGenerationLimit}
                  />
                </aside>
              </div>
            </main>
            {isUpgradeModalOpen && user && (
                <UpgradeModal 
                    user={user}
                    onClose={() => setIsUpgradeModalOpen(false)}
                    onUpgrade={handleUpgrade}
                />
            )}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
