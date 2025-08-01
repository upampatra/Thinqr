import React from 'react';

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onContentChange }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full">
      <div className="flex-shrink-0 mb-3">
         <h2 className="text-lg font-bold">Credit Memo Editor</h2>
      </div>
      <div className="flex-grow flex flex-col">
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Start writing your credit memo here, or use the AI Assistant to generate sections..."
          className="w-full h-full bg-gray-900 text-gray-200 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none flex-grow"
        />
      </div>
    </div>
  );
};

export default Editor;
