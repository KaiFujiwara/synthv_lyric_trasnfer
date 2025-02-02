"use client";

import React, { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Command+Enter (Mac) または Ctrl+Enter (Windows)
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (input.trim() && !disabled) {
        onSend(input.trim());
        setInput('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto p-2 sm:p-4 flex gap-2 sm:gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="歌詞を入力してください..."
          disabled={disabled}
          className="flex-1 bg-white rounded-lg p-2 sm:p-3 resize-none h-[80px] sm:h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black whitespace-pre-wrap"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-2 sm:px-4 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <PaperAirplaneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </form>
  );
} 