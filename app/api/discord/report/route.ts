import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      bookingId,
      reportUrl,
      patientName,
      patientPhone,
      patientAge,
      patientGender,
      testNames,
      totalAmount,
      labName,
      labCity,
    } = body;

    const webhookUrl = process.env.DISCORD_REPORTS_WEBHOOK_URL || 'https://discord.com/api/webhooks/1546709938871476355/A9nm7hcHBowlEcuOnb-mnjbgAUAYd9CYzV3LpR6nYb21-wV91_48wE3oIQm2px41IYnM';

    if (!webhookUrl) {
      return NextResponse.json({ error: 'Discord webhook URL not configured' }, { status: 500 });
    }

    const isImage = reportUrl && /\.(jpg|jpeg|png|webp)($|\?)/i.test(reportUrl);
    const isPdf = reportUrl && /\.pdf($|\?)/i.test(reportUrl);

    // Build Rich Discord Embed
    const embed: any = {
      title: '📄 New Patient Test Report Uploaded!',
      description: `A diagnostic lab has finalized and uploaded a medical report for patient **${patientName || 'Patient'}**.`,
      color: 0x2563EB, // Bharosa Blue
      fields: [
        {
          name: '👤 Patient Details',
          value: `**Name:** ${patientName || 'N/A'}\n**Phone:** ${patientPhone || 'N/A'}\n**Demographics:** ${patientAge ? `${patientAge} Y` : 'N/A'} • ${patientGender || 'N/A'}`,
          inline: true,
        },
        {
          name: '🏥 Laboratory',
          value: `**${labName || 'Partner Diagnostic Lab'}**\n${labCity ? `📍 ${labCity}` : 'Verified Partner'}`,
          inline: true,
        },
        {
          name: '🧪 Tests Conducted',
          value: testNames || 'Diagnostic Medical Tests',
          inline: false,
        },
        {
          name: '💰 Order Amount',
          value: `Rs. ${totalAmount || 0}`,
          inline: true,
        },
        {
          name: '🆔 Booking ID',
          value: `\`${bookingId || 'N/A'}\``,
          inline: true,
        },
        {
          name: '📥 Report Access',
          value: reportUrl ? `[🔗 Click to Open / Download Report](${reportUrl})` : 'Pending file sync',
          inline: false,
        },
      ],
      footer: {
        text: 'Bharosa Healthcare • Realtime Report Dispatch',
      },
      timestamp: new Date().toISOString(),
    };

    if (isImage) {
      embed.image = { url: reportUrl };
    }

    // Attempt to download the file and attach it directly so Discord hosts a permanent copy
    let sentSuccessfully = false;
    if (reportUrl) {
      try {
        const fileRes = await fetch(reportUrl);
        if (fileRes.ok) {
          const fileBlob = await fileRes.blob();
          const fileExt = isPdf ? 'pdf' : isImage ? 'png' : 'file';
          const fileName = `Report-${patientName ? patientName.replace(/\s+/g, '_') : 'Patient'}-${bookingId || Date.now()}.${fileExt}`;

          const formData = new FormData();
          formData.append('payload_json', JSON.stringify({
            username: 'Bharosa Reports Bot',
            avatar_url: 'https://ksclwdqyqielntcsawbf.supabase.co/storage/v1/object/public/logos/bharosa-logo.png',
            embeds: [embed],
          }));
          formData.append('files[0]', fileBlob, fileName);

          const discordRes = await fetch(webhookUrl, {
            method: 'POST',
            body: formData,
          });

          if (discordRes.ok) {
            sentSuccessfully = true;
          }
        }
      } catch (attachErr) {
        console.warn('Could not attach binary file to Discord, falling back to URL embed:', attachErr);
      }
    }

    // Fallback if file attachment was skipped or failed
    if (!sentSuccessfully) {
      const fallbackPayload = {
        username: 'Bharosa Reports Bot',
        avatar_url: 'https://ksclwdqyqielntcsawbf.supabase.co/storage/v1/object/public/logos/bharosa-logo.png',
        embeds: [embed],
      };

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fallbackPayload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Discord Webhook Error:', errorText);
        return NextResponse.json({ error: 'Discord failed to accept payload', details: errorText }, { status: 502 });
      }
    }

    return NextResponse.json({ success: true, message: 'Report dispatched to Discord #reports' });
  } catch (error: any) {
    console.error('Error in /api/discord/report route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
