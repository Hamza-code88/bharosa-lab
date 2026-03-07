import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, title, body } = await request.json();

    const message = {
      to: token,
      sound: 'default',
      title: title,
      body: body,
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}