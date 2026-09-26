import { supabase } from './supabase';

export interface LabItem {
  id: string;
  name: string;
  city?: string;
  logo_url?: string;
  owner_id: string;
  invite_code?: string;
  is_active?: boolean;
  payment_status?: string;
  last_cleared_date?: string;
  created_at?: string;
  is_registered_paid?: boolean;
  registration_status?: string;
  rating?: number | string;
  lab_images?: any;
  commission_percentage?: number | null;
  user_role: 'owner' | 'staff' | 'manager';
}

const STORAGE_KEY = 'bharosa_active_lab_id';
export const LAB_CHANGED_EVENT = 'bharosa_active_lab_changed';

/**
 * Returns currently saved active lab ID from localStorage
 */
export const getActiveLabId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
};

/**
 * Sets active lab ID in localStorage and fires a custom event for instant UI update
 */
export const setActiveLabId = (labId: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, labId);
  window.dispatchEvent(new CustomEvent(LAB_CHANGED_EVENT, { detail: { labId } }));
};

/**
 * Fetches all labs the current user has access to (either as owner or as active staff member)
 */
export const getUserAuthorizedLabs = async (userId: string): Promise<LabItem[]> => {
  const authorizedLabs: LabItem[] = [];

  try {
    // 1. Fetch labs owned by this user
    const { data: ownedLabs, error: ownedError } = await supabase
      .from('labs')
      .select('*')
      .eq('owner_id', userId);

    if (!ownedError && ownedLabs) {
      ownedLabs.forEach((l) => {
        authorizedLabs.push({
          ...l,
          user_role: 'owner',
        });
      });
    }

    // 2. Fetch labs where this user is an active staff member
    const { data: staffRecords, error: staffError } = await supabase
      .from('lab_staff')
      .select('role, status, labs (*)')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (!staffError && staffRecords) {
      staffRecords.forEach((item: any) => {
        if (item.labs && !authorizedLabs.some((al) => al.id === item.labs.id)) {
          authorizedLabs.push({
            ...item.labs,
            user_role: item.role || 'staff',
          });
        }
      });
    }
  } catch (err) {
    console.error('Error fetching authorized labs:', err);
  }

  return authorizedLabs;
};

/**
 * Resolves the currently selected active lab for the given user, or selects the primary one
 */
export const resolveActiveLab = async (
  userId: string
): Promise<{ activeLab: LabItem | null; allLabs: LabItem[] }> => {
  const allLabs = await getUserAuthorizedLabs(userId);

  if (allLabs.length === 0) {
    return { activeLab: null, allLabs: [] };
  }

  const savedLabId = getActiveLabId();
  let matchedLab = allLabs.find((l) => l.id === savedLabId);

  if (!matchedLab) {
    matchedLab = allLabs[0];
    setActiveLabId(matchedLab.id);
  }

  return { activeLab: matchedLab, allLabs };
};

/**
 * Ensures a lab has a unique invite code, generates one if missing
 */
export const ensureLabInviteCode = async (labId: string): Promise<string> => {
  try {
    const { data: lab } = await supabase
      .from('labs')
      .select('invite_code')
      .eq('id', labId)
      .maybeSingle();

    if (lab?.invite_code) {
      return lab.invite_code;
    }

    // Generate random 8-character uppercase alphanumeric code
    const generatedCode = 'BL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    await supabase.from('labs').update({ invite_code: generatedCode }).eq('id', labId);
    return generatedCode;
  } catch (e) {
    console.error('Error ensuring invite code:', e);
    return 'BL-' + labId.substring(0, 6).toUpperCase();
  }
};
