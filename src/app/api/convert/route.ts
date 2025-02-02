import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { lyrics } = await request.json();

    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {},
        query: lyrics,
        response_mode: "blocking",
        conversation_id: "",
        user: "user",
      }),
    });

    if (!response.ok) {
      throw new Error(`Dify API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ convertedLyrics: data.answer });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 