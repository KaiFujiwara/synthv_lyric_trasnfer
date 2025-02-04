import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const handlers = [
  http.post('/api/convert', () => {
    return HttpResponse.json({ 
      convertedLyrics: 'Mocked conversion result' 
    });
  }),
];

export const server = setupServer(...handlers); 