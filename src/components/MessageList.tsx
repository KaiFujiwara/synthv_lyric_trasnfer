import React from 'react';
import { ChatMessage } from '../types/chat';

interface MessageListProps {
  messages: ChatMessage[];
  onRegenerate: (messageId: string) => void;
}

export default function MessageList({ messages, onRegenerate }: MessageListProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 overscroll-none" 
         style={{
           height: messages.length > 0 ? 'auto' : '100%',
           WebkitOverflowScrolling: 'touch',
           paddingBottom: 'calc(env(safe-area-inset-bottom) + 120px)'
         }}>
      {messages.map((message) => (
        <div key={message.id} className={`mb-5 flex items-start gap-2 ${message.isBot ? 'bg-gray-200' : 'justify-end'}`}>
          {message.isBot && (
            <img
              src="/bot_icon.png" // 仮の画像パス
              alt="Bot"
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className={`flex-1 p-3 rounded ${message.isBot ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
            <p>{message.content}</p>
            {message.isBot && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => copyToClipboard(message.content)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-400"
                >
                  コピー
                </button>
                <button
                  onClick={() => onRegenerate(message.id)}
                  className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500"
                >
                  再生成
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 