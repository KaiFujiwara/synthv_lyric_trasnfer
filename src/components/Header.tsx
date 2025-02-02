"use client";

import { TrashIcon, QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';

interface HeaderProps {
  onClearChat: () => void;
}

export default function Header({ onClearChat }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    // Next.jsではbodyをルート要素として使用
    Modal.setAppElement('body');
  }, []);

  const handleClearChat = () => {
    setIsConfirmOpen(false);
    onClearChat();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 h-10 sm:h-12 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-sm sm:text-xl dot-gothic-16">SynthV 打ち込みちゃん</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
            title="ヘルプ"
            disabled={isConfirmOpen}
          >
            <QuestionMarkCircleIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${isConfirmOpen ? 'opacity-50' : ''}`} />
          </button>
        </div>
        
        <button
          onClick={() => setIsConfirmOpen(true)}
          className="px-2 py-1.5 bg-white text-gray-900 rounded transition-colors hover:bg-gray-100 flex dot-gothic-16"
          title="チャット履歴を消去"
          disabled={isModalOpen}
        >
          <TrashIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isModalOpen ? 'opacity-50' : ''}`} />
          <span className={`hidden sm:inline-block ml-2 text-sm ${isModalOpen ? 'opacity-50' : ''}`}>
            チャット履歴を消去
          </span>
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="absolute top-[40%] sm:top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-4 sm:p-8 rounded-lg w-[90%] sm:max-w-[80%] sm:w-auto dot-gothic-16"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm"
      >
        <div className="relative">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h2 className="text-lg sm:text-xl mb-4">使い方</h2>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
            入力された歌詞をSynthesizerVにそのまま打ち込める形式に変換します。<br /><br />
            ・すべてひらがなで出力されます。<br />
            ・話し言葉と書き言葉で文字が変わる場合（例：「そういう→そおゆう」「これは→これわ」）、実際の話し言葉に合わせて出力されます。<br />
            ・チャット履歴はブラウザを閉じても保存されます。<br />
            ・変換にはAIを使用していますが、入力された歌詞はAIの学習には使用されないのでご安心ください。<br />
            ・本アプリはベータ版です。AIの利用制限は全ユーザー共通です。ご了承ください。
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={isConfirmOpen}
        onRequestClose={() => setIsConfirmOpen(false)}
        className="absolute top-[40%] sm:top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-4 sm:p-6 rounded-lg w-[90%] sm:w-full sm:max-w-sm dot-gothic-16"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm"
      >
        <div className="relative">
          <h2 className="text-lg mb-4">確認</h2>
          <p className="text-sm mb-6">チャット履歴を消去しますか？</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsConfirmOpen(false)}
              className="px-4 py-2 text-sm hover:bg-white/10 rounded transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleClearChat}
              className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 rounded transition-colors"
            >
              消去する
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
} 