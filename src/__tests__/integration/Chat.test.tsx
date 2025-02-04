import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import Chat from '../../components/Chat';

const mockLocalStorage = {
  store: {} as { [key: string]: string },
  clear() {
    this.store = {};
  },
  getItem(key: string) {
    return this.store[key] || null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  removeItem(key: string) {
    delete this.store[key];
  }
};

// localStorageのモックをsetupの中で設定
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
});

describe('Chat Component', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('初期表示時にメッセージが空であること', () => {
    render(<Chat />);
    const messages = screen.queryAllByText('テスト歌詞');
    expect(messages).toHaveLength(0);
  });

  it('メッセージを送信できること', async () => {
    render(<Chat />);
    const input = screen.getByPlaceholderText('歌詞を入力してください...');
    
    fireEvent.change(input, { target: { value: 'テスト歌詞' } });
    const sendButton = screen.getByRole('button', { name: /送信/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      const userMessage = screen.getByText('テスト歌詞');
      const botResponse = screen.getByText('Mocked conversion result');
      expect(userMessage).toBeInTheDocument();
      expect(botResponse).toBeInTheDocument();
    });
  });

  it('エラー時にエラーメッセージを表示すること', async () => {
    server.use(
      http.post('/api/convert', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<Chat />);
    const input = screen.getByPlaceholderText('歌詞を入力してください...');
    
    fireEvent.change(input, { target: { value: 'テスト歌詞' } });
    const sendButton = screen.getByRole('button', { name: /送信/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/変換に失敗/);
      expect(errorMessage).toBeInTheDocument();
    });
  });
}); 