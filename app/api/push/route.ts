import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Agar request Expo Push Notification ke liye hai (App se aayi hai)
    if (body.token && body.title) {
      const message = {
        to: body.token,
        sound: 'default',
        title: body.title,
        body: body.body,
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
    }

    // 2. Agar request Supabase Webhook se aayi hai (Discord ke liye)
    const record = body.record;
    if (!record) {
      return NextResponse.json({ error: 'No record found in Supabase payload' }, { status: 400 });
    }

    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    if (!DISCORD_WEBHOOK_URL) {
      return NextResponse.json({ error: 'Discord URL not configured in env' }, { status: 500 });
    }

    // Smart Delay for 4 seconds to allow React Native App to insert booking_items
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    let testsList = "Fetching pending...";
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: itemsData, error } = await supabase
        .from('booking_items')
        .select('lab_test_id, price_at_booking')
        .eq('booking_id', record.id);
        
      if (!error && itemsData && itemsData.length > 0) {
         testsList = `${itemsData.length} Test(s) Booked`;
      } else {
         testsList = "No tests synced in 4s";
      }
    }

    const discordPayload = {
      username: "Bharosa Lab System",
      embeds: [
        {
          title: "🚨 New Booking Received!",
          color: 3447003,
          fields: [
            {
              name: "Booking ID",
              value: record.id ? record.id.toString() : "N/A",
              inline: true,
            },
            {
              name: "Patient Name",
              value: record.patient_name || "N/A",
              inline: true,
            },
            {
              name: "Phone",
              value: record.patient_phone || "N/A",
              inline: true,
            },
            {
              name: "Tests",
              value: testsList,
              inline: true,
            },
            {
              name: "Total Amount",
              value: record.total_amount ? `Rs. ${record.total_amount}` : "N/A",
              inline: true,
            },
            {
              name: "Gender / Age",
              value: `${record.patient_gender || "N/A"} / ${record.patient_age || "N/A"}`,
              inline: true,
            },
            {
              name: "Address",
              value: record.patient_address || "N/A",
              inline: false,
            }
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      throw new Error(`Discord rejected the payload. Status: ${discordResponse.status}`);
    }

    return NextResponse.json({ success: true, message: 'Sent to Discord successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}