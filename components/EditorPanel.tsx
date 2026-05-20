import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface EditorPanelProps {
  markdown: string;
  onChange: (value: string | undefined) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  undo: () => void;
  redo: () => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ markdown, onChange, onPaste, undo, redo }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    const el = editorRef.current;
    if (el) {
      el.addEventListener('keydown', handleKeyDown);
      return () => el.removeEventListener('keydown', handleKeyDown);
    }
  }, [undo, redo]);

  return (
    <div ref={editorRef} className="w-1/2 p-4 bg-white shadow-lg flex flex-col">
      <h1 className="mb-4 px-4 py-2 flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
        <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" />
          <path d="M14 2V8H20" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
          <path d="M10 9H9H8" />
        </svg>
        飞书文档转公众号
        <span className="text-sm font-normal text-gray-500">排版工具</span>
      </h1>
      <div className="flex-1 overflow-hidden" data-color-mode="light">
        <MDEditor
          value={markdown}
          onChange={onChange}
          height="100%"
          preview="edit"
          hideToolbar={false}
          visibleDragbar={false}
          enableScroll={true}
          previewOptions={{ style: { display: 'none' } }}
          textareaProps={{
            placeholder: '在这里输入 Markdown 内容...',
            style: { background: 'white', padding: 0 },
            onPaste,
          }}
        />
      </div>
    </div>
  );
};

export default EditorPanel; 