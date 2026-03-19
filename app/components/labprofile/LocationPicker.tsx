import { useState } from 'react'; 
import { MapPinned, Crosshair } from 'lucide-react';
import { LabData } from './BasicInfo'; 

interface Props {
  labData: LabData; 
  setLabData: (data: LabData) => void; 
}

export default function LocationPicker({ labData, setLabData }: Props) {
  const [actionMessage, setActionMessage] = useState(""); 
  
  const lat = labData.latitude;
  const lng = labData.longitude;

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
    // 🛑 FIX: p-8 ko p-5 sm:p-8 kar diya
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8 mt-5 sm:mt-6">
      <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-1.5 sm:mb-2 flex items-center gap-2">
        <MapPinned className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /> Map Location
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Click the button below while sitting inside your lab to pin your exact location for patients.</p>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100 mb-4">
        <button type="button" onClick={detectLocation} className="w-full sm:w-auto bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base">
          <Crosshair className="w-4 h-4 sm:w-5 sm:h-5" /> Auto-Detect Location
        </button>
        <span className={`text-xs sm:text-sm font-medium text-center sm:text-left w-full sm:w-auto ${displayStatus.includes('✅') ? 'text-green-600' : 'text-gray-500'}`}>
          {displayStatus}
        </span>
      </div>

      {/* 🛑 FIX: Mobile par grid-cols-1, sm par grid-cols-2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Latitude</label>
          <input type="number" step="any" value={lat || ''} onChange={(e) => setLabData({...labData, latitude: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 text-sm sm:text-base rounded-xl px-3 sm:px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 34.01" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Longitude</label>
          <input type="number" step="any" value={lng || ''} onChange={(e) => setLabData({...labData, longitude: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 text-sm sm:text-base rounded-xl px-3 sm:px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 71.52" />
        </div>
      </div>
    </div>
  );
}