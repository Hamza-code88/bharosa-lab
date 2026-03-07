import { useState } from 'react'; // 🛑 useEffect hata diya
import { MapPinned, Crosshair } from 'lucide-react';
import { LabData } from './BasicInfo'; // Agar ye BasicInfo wale folder me hai, warna neechay wala interface use karein

// Agar upar wala import error de, toh isko un-comment kar lein:
/*
export interface LabData {
  latitude?: string | number;
  longitude?: string | number;
  [key: string]: any;
}
*/

interface Props {
  labData: LabData; // 🛑 'any' hata diya
  setLabData: (data: LabData) => void; // 🛑 'any' hata diya
}

export default function LocationPicker({ labData, setLabData }: Props) {
  // 🛑 FIX: Sirf action message track karenge, baqi directly calculate karenge
  const [actionMessage, setActionMessage] = useState(""); 
  
  const lat = labData.latitude;
  const lng = labData.longitude;

  // 🛑 FIX: Smart Logic! Agar map load hone ke baad lat/lng hain toh saved dikhao, bina kisi useEffect ke!
  const displayStatus = actionMessage || (lat && lng ? "✅ Location is saved!" : "Pin your lab location on map");

  const detectLocation = () => {
    setActionMessage("Detecting exact location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLabData({
            ...labData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
          setActionMessage("✅ Exact location pinned successfully!");
        },
        () => setActionMessage("❌ Please allow location access")
      );
    } else {
      setActionMessage("❌ Not supported by browser.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mt-6">
      <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
        <MapPinned className="w-5 h-5 text-red-500" /> Map Location
      </h2>
      <p className="text-sm text-gray-500 mb-6">Click the button below while sitting inside your lab to pin your exact location for patients.</p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
        <button type="button" onClick={detectLocation} className="w-full sm:w-auto bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all">
          <Crosshair className="w-5 h-5" /> Auto-Detect Location
        </button>
        <span className={`text-sm font-medium ${displayStatus.includes('✅') ? 'text-green-600' : 'text-gray-500'}`}>
          {displayStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Latitude</label>
          <input type="number" step="any" value={lat || ''} onChange={(e) => setLabData({...labData, latitude: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 34.01" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Longitude</label>
          <input type="number" step="any" value={lng || ''} onChange={(e) => setLabData({...labData, longitude: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 71.52" />
        </div>
      </div>
    </div>
  );
}