
import * as z from 'zod';
export interface LabProfile {
  id?: string;
  owner_id: string;
  name: string;
  city: string;
  address: string;
  experience_years: number;
  logo_url?: string;
  lab_images?: string[];
  location_pin?: string;
  is_verified?: boolean;
}

export interface LabTest {
  id?: string;
  lab_id: string;
  test_name: string;
  price: number;
  special_instructions?: string; // e.g., "Fasting required for 12 hours"
  is_active: boolean;
}



// Yeh Zod schema hai jo errors pakrega
export const labProfileSchema = z.object({
  name: z.string().min(3, "Lab name is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Complete address is required"),
  experience_years: z.coerce.number().min(0, "Invalid experience"),
  latitude: z.number().optional(),  // Location lat
  longitude: z.number().optional(), // Location lng
  logoFile: z.any().optional(),
  labPhoto: z.any().optional(),
});

// Yeh TypeScript ki type ban gayi is schema se
export type LabProfileFormValues = z.infer<typeof labProfileSchema>;




export const addTestSchema = z.object({
  test_id: z.string().min(1, "Please select a test from the list"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  turnaround_time: z.string().min(1, "Turnaround time is required (e.g., 24 Hours)"),
  is_home_collection: z.boolean().default(true),
});

export type AddTestFormValues = z.infer<typeof addTestSchema>;

export interface MasterTest {
  id: string;
  title: string;
  preparation: string;
}

export interface LabTestWithDetails {
  id: string;
  price: number;
  turnaround_time: string;
  is_home_collection: boolean;
  master_tests: {
    title: string;
  };
}


// types.ts (existing code ke neeche add karein)

export interface BookingItem {
  id: string;
  lab_test_id: string;
  price_at_booking: number;
}

export interface Booking {
  id: string;
  patient_id: string;
  lab_id: string;
  total_amount: number;
  status: string;
  patient_address: string;
  patient_phone: string;
  patient_name: string;
  patient_age: string;
  patient_gender: string;
  created_at: string;
  // Jab hum join lagayenge toh items bhi aayenge
  booking_items?: BookingItem[];
}