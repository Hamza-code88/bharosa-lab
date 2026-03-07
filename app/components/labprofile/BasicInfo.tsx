import { Building2 } from 'lucide-react';

// 🛑 NAYA: LabData ka proper structure bana diya
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
  [key: string]: any; // Agar koi aur extra field ho toh usay handle karne ke liye
}

interface Props {
  labData: LabData; // 🛑 'any' hata diya
  setLabData: (data: LabData) => void; // 🛑 'any' hata diya
}

export default function BasicInfo({ labData, setLabData }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-600" /> Basic Details & Contact
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Lab Name *</label>
          <input 
            type="text" 
            value={labData.name || ''} 
            onChange={(e) => setLabData({...labData, name: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-black focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="e.g. Excel Labs" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Name</label>
          <input 
            type="text" 
            value={labData.owner_name || ''} 
            onChange={(e) => setLabData({...labData, owner_name: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="Dr. John Doe" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Speciality</label>
          <input 
            type="text" 
            value={labData.speciality || ''} 
            onChange={(e) => setLabData({...labData, speciality: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="Pathology & Radiology" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
          <input 
            type="tel" 
            value={labData.phone_number || ''} 
            onChange={(e) => setLabData({...labData, phone_number: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="+92 300 1234567" 
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
          <input 
            type="text" 
            value={labData.city || ''} 
            onChange={(e) => setLabData({...labData, city: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="e.g. Mingora" 
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (Years)</label>
          <input 
            type="number" 
            value={labData.experience_years || ''} 
            onChange={(e) => setLabData({...labData, experience_years: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-black focus:bg-white focus:border-blue-600 outline-none transition-all" 
            placeholder="e.g. 10" 
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Physical Address</label>
          <textarea 
            rows={3} 
            value={labData.address || ''} 
            onChange={(e) => setLabData({...labData, address: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-black focus:bg-white focus:border-blue-600 outline-none transition-all resize-none" 
            placeholder="Shop #, Plaza Name, Main Road..." 
          />
        </div>
      </div>
    </div>
  );
}