import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

beforeAll(() => {
  // MSWサーバーの起動
  server.listen();
});

afterEach(() => {
  // 各テスト後にハンドラーをリセット
  server.resetHandlers();
});

afterAll(() => {
  // テスト終了後にサーバーをクリーンアップ
  server.close();
}); 