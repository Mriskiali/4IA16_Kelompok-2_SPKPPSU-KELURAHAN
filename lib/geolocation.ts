/**
 * Utility functions for handling geolocation with better error messages
 */

interface GeolocationErrorWithCode extends GeolocationPositionError {
  PERMISSION_DENIED: number;
  POSITION_UNAVAILABLE: number;
  TIMEOUT: number;
}

/**
 * Get a detailed error message for geolocation errors
 */
export const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
  let errorMessage = "Gagal mendapatkan lokasi. ";
  
  switch(error.code) {
    case error.PERMISSION_DENIED:
      errorMessage += "Izin akses lokasi ditolak. Mohon aktifkan izin lokasi untuk situs ini di pengaturan browser Anda.";
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage += "Informasi lokasi tidak tersedia. ";
      errorMessage += "Pastikan GPS perangkat Anda aktif, Anda mengakses situs ini melalui HTTPS atau localhost, ";
      errorMessage += "dan tidak menggunakan pemblokir lokasi seperti VPN atau jaringan perusahaan.";
      break;
    case error.TIMEOUT:
      errorMessage += "Permintaan untuk mendapatkan lokasi melewati batas waktu. Coba lagi nanti.";
      break;
    default:
      errorMessage += "Terjadi kesalahan yang tidak diketahui.";
      break;
  }
  
  return errorMessage;
};

/**
 * Check if we're in a secure context (required for geolocation)
 */
export const isSecureContext = (): boolean => {
  return window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
};

/**
 * Request geolocation with enhanced options and error handling
 */
export const requestGeolocation = (
  successCallback: PositionCallback,
  errorCallback: PositionErrorCallback,
  options: PositionOptions = {}
): void => {
  if (!navigator.geolocation) {
    const error: GeolocationPositionError = {
      code: 2, // POSITION_UNAVAILABLE
      message: "Geolocation tidak didukung oleh browser ini",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    };
    errorCallback(error);
    return;
  }

  // Default options with better compatibility
  const defaultOptions: PositionOptions = {
    enableHighAccuracy: false, // More compatible with various devices
    timeout: 15000,
    maximumAge: 60000
  };

  const finalOptions: PositionOptions = { ...defaultOptions, ...options };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback, finalOptions);
};