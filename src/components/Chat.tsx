"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, STORAGE_KEY, MAX_STORAGE_ITEMS } from '../types/chat';
import Message from './Message';
import Header from './Header';
import { convertLyrics } from '../utils/api';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true); // 初回ロード判定用
  const [input, setInput] = useState(''); // 追加

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        const viewportHeight = window.innerHeight;
        const headerHeight = 48;
        const inputHeight = 132;
        const availableHeight = viewportHeight - headerHeight - inputHeight;
        
        const isOverflowing = container.scrollHeight > availableHeight;
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;

        if (isOverflowing && isAtBottom) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, []);

  // メッセージ更新時のスクロール
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || isFirstLoad.current) return; // 初回ロード時はスキップ

    const isNewMessage = latestMessage.isBot && 
      !loadingMessageId && 
      !latestMessage.isError && 
      !latestMessage.isRegenerated;

    if (isNewMessage) {
      scrollToBottom();
    }
  }, [messages, loadingMessageId, scrollToBottom]);

  // ローカルストレージからのメッセージ読み込みと初回スクロール
  useEffect(() => {
    const storedMessages = localStorage.getItem(STORAGE_KEY);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
      // メッセージ読み込み後にスクロール
      setTimeout(() => {
        if (isFirstLoad.current) {
          scrollToBottom();
          isFirstLoad.current = false;
        }
      }, 100);
    } else {
      isFirstLoad.current = false; // メッセージがない場合はフラグを下ろす
    }
  }, []);

  useEffect(() => {
    // メッセージが更新されたらローカルストレージに保存
    if (messages.length > 0) {
      const messagesToStore = messages.slice(-MAX_STORAGE_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToStore));
    }
  }, [messages]);

  const scrollToMessage = (messageId: string) => {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSendMessage = async (content: string, messageIndexToReplace?: number) => {
    if (messageIndexToReplace === undefined) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        isBot: false,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      // ユーザーメッセージ送信時は必ずスクロール
      setTimeout(scrollToBottom, 100);

      const loadingMessage: ChatMessage = {
        id: `loading-${Date.now()}`,
        content: '',
        isBot: true,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, loadingMessage]);
      setLoadingMessageId(loadingMessage.id);
    } else {
      setLoadingMessageId(messages[messageIndexToReplace].id);
    }

    try {
      const convertedLyrics = await convertLyrics(content);
      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        content: convertedLyrics,
        isBot: true,
        timestamp: Date.now(),
        isRegenerated: messageIndexToReplace !== undefined,
      };
      
      setMessages(prev => {
        if (messageIndexToReplace !== undefined) {
          const newMessages = [...prev];
          newMessages[messageIndexToReplace] = botResponse;
          // 再生成時は特定のメッセージまでスクロール
          setTimeout(() => scrollToMessage(botResponse.id), 100);
          return newMessages;
        }
        // 新規メッセージの場合はuseEffectでスクロール制御
        return prev.slice(0, -1).concat(botResponse);
      });
    } catch {
      const errorResponse: ChatMessage = {
        id: Date.now().toString(),
        content: 'ごめんね。変換に失敗しちゃった。とほほ・・・。',
        isBot: true,
        timestamp: Date.now(),
        isError: true,
        isRegenerated: messageIndexToReplace !== undefined,
      };

      setMessages(prev => {
        if (messageIndexToReplace !== undefined) {
          const newMessages = [...prev];
          newMessages[messageIndexToReplace] = errorResponse;
          return newMessages;
        }
        const newMessages = prev.slice(0, -1).concat(errorResponse);
        setTimeout(scrollToBottom, 100);
        return newMessages;
      });
    } finally {
      setLoadingMessageId(null);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="pt-10 sm:pt-12 pb-[116px] sm:pb-[128px] overflow-x-hidden">
      <div className="bg-pattern" />
      <Header onClearChat={handleClearChat} />
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-4 flex flex-col-reverse">
          <div ref={messagesEndRef} />
          {messages.slice().reverse().map((message) => (
            <Message
              key={message.id}
              id={message.id}
              content={message.content}
              isBot={message.isBot}
              isError={message.isError}
              isLoading={message.id === loadingMessageId}
              onRegenerate={() => {
                const messageIndex = messages.indexOf(message);
                const prevMessage = messages[messageIndex - 1];
                if (prevMessage && !loadingMessageId) {
                  handleSendMessage(prevMessage.content, messageIndex);
                }
              }}
            />
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto p-2 sm:p-4 flex gap-2 sm:gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-white rounded-lg p-2 sm:p-3 resize-none h-[80px] sm:h-[100px] text-[16px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black whitespace-pre-wrap"
            placeholder="歌詞を入力してください..."
          />
          <button
            onClick={() => {
              if (input.trim()) {
                handleSendMessage(input);
                setInput('');
              }
            }}
            disabled={!input.trim() || !!loadingMessageId}
            aria-label="送信"
            className="px-2 sm:px-4 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
} 