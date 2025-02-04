import { convertLyrics } from '../../utils/api';

describe('API Utils', () => {
  it('APIをコールできること', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ convertedLyrics: 'テスト結果' })
    });
    global.fetch = mockFetch;

    const result = await convertLyrics('テスト歌詞');
    
    expect(mockFetch).toHaveBeenCalledWith('/api/convert', expect.any(Object));
    expect(result).toBe('テスト結果');
  });

  it('APIエラー時にエラーをスローすること', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('API Error'));
    global.fetch = mockFetch;

    await expect(convertLyrics('テスト歌詞')).rejects.toThrow('API Error');
  });
}); 