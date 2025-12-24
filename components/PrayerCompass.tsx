
import React, { useState, useEffect } from 'react';

export const PrayerCompass: React.FC = () => {
  const [heading, setHeading] = useState<number>(0);
  const [bearing, setBearing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  // Jerusalem Coordinates
  const JERUSALEM_LAT = 31.7767;
  const JERUSALEM_LNG = 35.2345;

  const calculateBearing = (startLat: number, startLng: number) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const lat1 = toRad(startLat);
    const lat2 = toRad(JERUSALEM_LAT);
    const dLng = toRad(JERUSALEM_LNG - startLng);

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    
    let brng = toDeg(Math.atan2(y, x));
    if (brng < 0) brng += 360;
    return brng;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const b = calculateBearing(position.coords.latitude, position.coords.longitude);
          setBearing(b);
        },
        (err) => setError("נדרש אישור מיקום כדי לחשב את הכיוון לירושלים.")
      );
    } else {
      setError("המכשיר שלך לא תומך במיקום.");
    }
  }, []);

  const requestCompassPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation);
        } else {
          setError("נדרש אישור לשימוש במצפן.");
        }
      } catch (e) {
        setError("שגיאה בקבלת אישור מצפן.");
      }
    } else {
      // Non-iOS 13+ devices
      setPermissionGranted(true);
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      // Android often uses absolute=true/false. iOS uses webkitCompassHeading
      let compass = event.alpha;
      if ((event as any).webkitCompassHeading) {
        // iOS
        compass = (event as any).webkitCompassHeading;
      } else {
        // Android (approximate, requires calibration)
        compass = 360 - event.alpha; 
      }
      setHeading(compass);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const rotation = bearing && heading ? bearing - heading : 0;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 text-center">
      <h3 className="text-xl font-black text-brand-blue dark:text-blue-400 mb-2">מצפן תפילה (ירושלים)</h3>
      
      {error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : !bearing ? (
        <p className="text-gray-500">מחשב מיקום...</p>
      ) : (
        <div className="flex flex-col items-center">
          
          {!permissionGranted && (
            <button 
              onClick={requestCompassPermission}
              className="bg-brand-gold text-white px-4 py-2 rounded-full font-bold text-sm mb-4 hover:bg-yellow-600 transition-colors shadow-lg animate-pulse"
            >
              לחץ כאן להפעלת המצפן
            </button>
          )}

          <div className="relative w-64 h-64 mt-4">
            {/* Compass Dial */}
            <div 
              className="absolute inset-0 border-4 border-gray-200 dark:border-slate-600 rounded-full flex items-center justify-center transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${-heading}deg)` }}
            >
              <div className="absolute top-2 text-xs font-bold text-gray-400">N</div>
              <div className="absolute bottom-2 text-xs font-bold text-gray-400">S</div>
              <div className="absolute right-2 text-xs font-bold text-gray-400">E</div>
              <div className="absolute left-2 text-xs font-bold text-gray-400">W</div>
            </div>

            {/* Jerusalem Indicator (The Arrow) */}
            <div 
              className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
               <div className="w-1 h-32 bg-gradient-to-t from-transparent to-brand-gold rounded-full relative">
                 <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-2xl">
                   🕌
                 </div>
               </div>
            </div>
            
            {/* Center Dot */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-4 h-4 bg-brand-blue rounded-full border-2 border-white shadow-sm"></div>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mt-6">
            החץ הזהב מצביע לכיוון הר הבית.
            <br/>
            <span className="text-xs opacity-75">וודא שה-GPS דלוק ושהמכשיר מאוזן.</span>
          </p>
        </div>
      )}
    </div>
  );
};
