import React from 'react';

interface ContextViewerProps {
    content: string;
    onContentChange: (newContent: string) => void;
}

const ContextViewer: React.FC<ContextViewerProps> = ({ content, onContentChange }) => {
  return (
    <div className="flex-grow flex flex-col min-h-0">
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        aria-label="Context Guide Editor"
        className="w-full h-full bg-gray-900 text-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans text-sm"
      />
    </div>
  );
};

export default ContextViewer;
