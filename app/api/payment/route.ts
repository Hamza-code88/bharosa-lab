import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const content = formData.get('content') as string;
    
    const labName = formData.get('labName') as string || 'Lab';
    const labEmail = formData.get('labEmail') as string || 'No Email';
    const paymentType = formData.get('paymentType') as string || 'payment';

    if (!file || !content) {
      return NextResponse.json({ error: 'Missing file or content' }, { status: 400 });
    }

    const discordWebhookUrl = process.env.DISCORD_PAYMENTS_WEBHOOK_URL;
    if (!discordWebhookUrl) {
      return NextResponse.json({ error: 'Discord payment webhook URL not configured' }, { status: 500 });
    }

    // Call Groq AI for Email Template
    let aiTemplate = '';
    const groqKey = process.env.GROQ_API_KEY;
    
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{
              role: "system",
              content: "You are a professional administrative assistant for Bharosa Lab. Write a short, warm, and professional email template that the Admin can copy-paste to send to a lab owner after their payment is approved."
            }, {
              role: "user",
              content: `Write a payment approval email for a lab named "${labName}" with email "${labEmail}". The payment was for a ${paymentType} fee. Confirm their account is active. Format it cleanly with a Subject line. Do not use placeholders.`
            }],
            temperature: 0.7,
            max_tokens: 250
          })
        });
        const groqData = await groqRes.json();
        const aiMessage = groqData.choices?.[0]?.message?.content;
        if (aiMessage) {
          aiTemplate = `\n\n========================================\n📧 AI GENERATED EMAIL TEMPLATE\n========================================\nTo: ${labEmail}\n\n${aiMessage}\n========================================`;
        }
      } catch (err) {
        console.error('Groq Error:', err);
      }
    }

    const finalContent = content + aiTemplate;

    // Prepare FormData for Discord
    const discordFormData = new FormData();
    discordFormData.append('content', finalContent);
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
