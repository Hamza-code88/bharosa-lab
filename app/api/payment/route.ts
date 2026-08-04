import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const content = formData.get('content') as string;

    if (!file || !content) {
      return NextResponse.json({ error: 'Missing file or content' }, { status: 400 });
    }

    const discordWebhookUrl = process.env.DISCORD_PAYMENTS_WEBHOOK_URL;
    if (!discordWebhookUrl) {
      return NextResponse.json({ error: 'Discord payment webhook URL not configured' }, { status: 500 });
    }

    // Prepare FormData for Discord
    const discordFormData = new FormData();
    discordFormData.append('content', content);
    discordFormData.append('file', file);

    const response = await fetch(discordWebhookUrl, {
      method: 'POST',
      body: discordFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Discord API Error', details: errorText }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
