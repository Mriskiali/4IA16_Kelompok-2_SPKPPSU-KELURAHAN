import React, { useState } from 'react';

interface Location {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: Location) => void;
  placeholder?: string;
  className?: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = 'Masukkan nama lokasi atau alamat...',
  className = ''
}) => {
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser Anda.");
      return;
    }

    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationString = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
        
        onChange(locationString);
        
        if (onLocationSelect) {
          onLocationSelect({
            display_name: locationString,
            lat: position.coords.latitude.toString(),
            lon: position.coords.longitude.toString()
          });
        }
        
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        console.error("Error getting location:", error);
        
        let errorMessage = "Gagal mendapatkan lokasi. ";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Izin akses lokasi ditolak. Mohon aktifkan izin lokasi untuk situs ini.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Informasi lokasi tidak tersedia. Pastikan GPS perangkat Anda aktif.";
            break;
          case error.TIMEOUT:
            errorMessage += "Permintaan untuk mendapatkan lokasi melewati batas waktu.";
            break;
          default:
            errorMessage += "Terjadi kesalahan yang tidak diketahui.";
            break;
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-24 py-2.5 border rounded-lg text-sm focus:ring-2 outline-none transition-colors border-gray-300 focus:ring-orange-500 focus:border-orange-500"
        />
        <div className="absolute left-3 top-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <button
          type="button"
          onClick={getLocation}
          disabled={loading}
          className="absolute right-3 top-2.5 bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Mengambil...' : 'Lokasi Saya'}
        </button>
      </div>
      
      {/* Informasi bahwa user bisa menggunakan tombol untuk lokasi saat ini */}
      <div className="text-xs text-gray-500 mt-1 italic">
        Gunakan tombol untuk mendapatkan lokasi GPS Anda saat ini
      </div>
    </div>
  );
};

export default LocationAutocomplete;