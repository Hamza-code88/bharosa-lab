import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// This route can be called by Vercel Cron or any external cron service (cron-job.org)
// It checks all active labs and locks them if they violate trial or commission limits.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Optional: Add a simple security key check so not anyone can trigger it constantly
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    // 1. Get settings for commission threshold
    const { data: settings } = await supabase.from('app_settings').select('*').eq('id', 1).single();
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 500 });
    }

    const threshold = settings.commission_threshold;

    // 2. Fetch all ACTIVE labs
    const { data: activeLabs, error: labsError } = await supabase
      .from('labs')
      .select('id, created_at, is_registered_paid')
      .eq('is_active', true);

    if (labsError || !activeLabs) {
      return NextResponse.json({ error: 'Failed to fetch active labs' }, { status: 500 });
    }

    let lockedCount = 0;
    const now = Date.now();

    for (const lab of activeLabs) {
      let shouldLock = false;

      // A. Check 30-Day Trial
      const trialDays = Math.floor((now - new Date(lab.created_at).getTime()) / (1000 * 60 * 60 * 24));
      if (trialDays >= 30 && !lab.is_registered_paid) {
        shouldLock = true;
      }

      // B. Check Commission Threshold
      if (!shouldLock) {
        const { data: commissionData, error: commError } = await supabase.rpc('get_lab_commission', { p_lab_id: lab.id });
        if (!commError && commissionData) {
          const { total_billed, commission_rate } = commissionData[0];
          const totalBilled = parseFloat(total_billed || '0');
          const rate = parseFloat(commission_rate || '15');
          const commissionDue = Math.round(totalBilled * (rate / 100));

          if (commissionDue >= threshold) {
            shouldLock = true;
          }
        }
      }

      // 3. Lock the lab if rules are violated
      if (shouldLock) {
        const { error: lockError } = await supabase
          .from('labs')
          .update({ is_active: false })
          .eq('id', lab.id);
          
        if (!lockError) lockedCount++;
      }
    }

    return NextResponse.json({ success: true, checked: activeLabs.length, locked: lockedCount });
  } catch (error: any) {
    console.error("Auto-lock cron error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
