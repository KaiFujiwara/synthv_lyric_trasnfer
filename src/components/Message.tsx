"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ClipboardDocumentIcon, ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface MessageProps {
  content: string;
  isBot: boolean;
  isLoading?: boolean;
  isError?: boolean;
  onRegenerate: () => void;
  id: string;
}

export default function Message({ content, isBot, onRegenerate, isLoading, isError, id }: MessageProps) {
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 sm:px-0`}
    >
      {isBot && (
        <Image
          src="/bot_icon.png"
          alt="Bot"
          width={40}
          height={40}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3"
        />
      )}
      <div className="flex flex-col w-full sm:w-auto relative">
        <div
          className={`relative max-w-[95%] sm:max-w-full px-4 py-2 rounded-lg ${
            isBot
              ? 'bg-gray-800 text-gray-100'
              : 'bg-blue-600 text-white ml-auto mr-2 sm:mr-2'
          }`}
        >
          <div
            className={`absolute top-3 ${
              isBot
                ? '-left-2 border-r-[8px] border-r-gray-800'
                : '-right-2 border-l-[8px] border-l-blue-600'
            } border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent`}
          />
          {isLoading ? (
            <div className="flex items-center gap-2 py-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
            </div>
          ) : (
            <p className="text-sm">{content}</p>
          )}
        </div>
        
        {isBot && (
          <div className="flex space-x-2 justify-end mt-1 mr-4 sm:mr-0">
            {!isError && !isLoading && (
              <div className="relative">
                <button
                  onClick={copyToClipboard}
                  className="hover:bg-white/10 rounded transition-colors text-black mt-1"
                  title="コピー"
                >
                  {showCopySuccess ? (
                    <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  ) : (
                    <ClipboardDocumentIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            )}
            {!isLoading && (
              <button
                onClick={onRegenerate}
                className="hover:bg-white/10 rounded transition-colors text-black"
                title="再生成"
              >
                <ArrowPathIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
} 