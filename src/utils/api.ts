export const convertLyrics = async (lyrics: string): Promise<string> => {
  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lyrics }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.convertedLyrics;
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  }
}; 