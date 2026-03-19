import { Building2 } from 'lucide-react';

export interface LabData {
  name?: string;
  owner_name?: string;
  speciality?: string;
  phone_number?: string;
  city?: string;
  experience_years?: string | number;
  address?: string;
  latitude?: string | number;
  longitude?: string | number;
  logo_url?: string;
  owner_image?: string;
  [key: string]: any; 
}

interface Props {
  labData: LabData; 
  setLabData: (data: LabData) => void; 
}

export default function BasicInfo({ labData, setLabData }: Props) {
  return (
    // 🛑 FIX: p-8 ko p-5 sm:p-8 kar diya
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8">
      <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-5 sm:mb-6 flex items-center gap-2">
        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" /> Basic Details & Contact
      </h2>
      
      {/* 🛑 FIX: Mobile par sab ek ke neechay ek, md par 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Lab Name *</label>
          <input 
            type="text" 
            value={labData.name || ''} 
            onChange={(e) => setLabData({...labData, name: e.target.value})}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl border border-gray-200 text-black text-sm sm:text-base focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="e.g. Excel Labs" 
            required 
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Owner Name</label>
          <input 
            type="text" 
            value={labData.owner_name || ''} 
            onChange={(e) => setLabData({...labData, owner_name: e.target.value})}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm sm:text-base focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="Dr. John Doe" 
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Speciality</label>
          <input 
            type="text" 
            value={labData.speciality || ''} 
            onChange={(e) => setLabData({...labData, speciality: e.target.value})}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm sm:text-base focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="Pathology & Radiology" 
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Phone Number *</label>
          <input 
            type="tel" 
            value={labData.phone_number || ''} 
            onChange={(e) => setLabData({...labData, phone_number: e.target.value})}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm sm:text-base focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="+92 300 1234567" 
            required
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">City *</label>
          <input 
            type="text" 
            value={labData.city || ''} 
            onChange={(e) => setLabData({...labData, city: e.target.value})}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm sm:text-base focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="e.g. Mingora" 
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Experience (Years)</label>
          <input 
            type="number" 
            value={labData.experience_years || ''} 
            onChange={(e) => setLabData({...labData, experience_years: e.target.value})}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl border border-gray-200 text-black text-sm sm:text-base focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="e.g. 10" 
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Physical Address</label>
          <textarea 
            rows={3} 
            value={labData.address || ''} 
            onChange={(e) => setLabData({...labData, address: e.target.value})}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl border border-gray-200 text-black text-sm sm:text-base focus:bg-white focus:border-blue-600 outline-none transition-all resize-none" 
            placeholder="Shop #, Plaza Name, Main Road..." 
          />
        </div>
      </div>
    </div>
  );
}