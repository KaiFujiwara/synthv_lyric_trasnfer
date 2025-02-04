export interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: number;
  isError?: boolean;
  isRegenerated?: boolean;
}

export interface ChatHistory {
  messages: ChatMessage[];
}

export const MAX_STORAGE_ITEMS = 50; // ローカルストレージの最大保存数
export const STORAGE_KEY = 'lyrics_converter_chat'; 