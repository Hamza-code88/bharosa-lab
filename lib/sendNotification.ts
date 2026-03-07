import { supabase } from './supabase'; 

export async function sendPushNotification(userId: string, title: string, body: string) {
  try {
    // 1. Notification ko database mein save karein
    await supabase.from('notifications').insert({
      profile_id: userId,
      title: title,
      body: body,
    });

    // 2. Database se token nikalen
    const { data: profile } = await supabase
      .from('profiles')
      .select('push_token')
      .eq('id', userId)
      .single();

    const pushToken = profile?.push_token;

    // Agar token nahi hai ya galat format mein hai, toh chup chap wapas aa jayen
    if (!pushToken || !pushToken.startsWith('ExponentPushToken')) {
      return; 
    }

    // 3. Apne backend API ko silent request bhejen
    await fetch('/api/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: pushToken,
        title: title,
        body: body
      }),
    });

  } catch (error) {
    // Sirf generic error dikhayen agar server completely down ho
    console.error("Failed to process notification.");
  }
}