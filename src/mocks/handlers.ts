import { http, HttpResponse } from 'msw';

type ConvertRequest = {
  content: string;
};

export const handlers = [
  http.post('/api/convert', async ({ request }) => {
    const { content } = await request.json() as ConvertRequest;
    return HttpResponse.json({
      converted: `Mocked conversion of: ${content}`
    });
  }),
]; 