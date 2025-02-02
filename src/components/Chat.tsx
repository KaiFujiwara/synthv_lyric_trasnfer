"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, STORAGE_KEY, MAX_STORAGE_ITEMS } from '../types/chat';
import ChatInput from './ChatInput';
import Message from './Message';
import Header from './Header';
import { convertLyrics } from '../utils/api';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        const isNewMessage = messages.length > 0 && messages[messages.length - 1].isBot;

        if ((isOverflowing || isNewMessage) && isAtBottom) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [messages]);

  // スクロール効果を即座に適用するために、マウント時にも実行
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // メッセージ更新時のスクロール
  useEffect(() => {
    // 新規メッセージの場合のみスクロール（再生成は除外）
    const isNewMessage = messages.length > 0 && 
      messages[messages.length - 1].isBot && 
      !loadingMessageId && // 再生成中は除外
      messages[messages.length - 1].id.startsWith('loading-'); // ローディング開始時のみスクロール

    if (isNewMessage) {
      scrollToBottom();
    }
  }, [messages, loadingMessageId, scrollToBottom]);

  useEffect(() => {
    // ローカルストレージからメッセージを読み込む
    const storedMessages = localStorage.getItem(STORAGE_KEY);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
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
      };
      
      setMessages(prev => {
        if (messageIndexToReplace !== undefined) {
          const newMessages = [...prev];
          newMessages[messageIndexToReplace] = botResponse;
          setTimeout(() => scrollToMessage(botResponse.id), 100);
          return newMessages;
        }
        const newMessages = prev.slice(0, -1).concat(botResponse);
        setTimeout(scrollToBottom, 100);
        return newMessages;
      });
    } catch {
      const errorResponse: ChatMessage = {
        id: Date.now().toString(),
        content: 'ごめんね。変換に失敗しちゃった。とほほ・・・。',
        isBot: true,
        timestamp: Date.now(),
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
      <ChatInput onSend={handleSendMessage} disabled={!!loadingMessageId} />
    </div>
  );
} 