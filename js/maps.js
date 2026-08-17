/**
 * ============================================================
 * SHRI MEKALSUTA TRADERS — Google Maps Navigation Module
 * ============================================================
 */

'use strict';

/**
 * Open Google Maps with Shri Mekalsuta Traders preselected as destination.
 * If user location permission is granted, passes current coordinates as origin
 * for immediate turn-by-turn route calculation.
 */
function openMaps() {
  const destName = window.CONFIG?.STORE_LOCATION || 'Shri Mekalsuta Traders, Bareli, Madhya Pradesh';
  const mapsBase = window.CONFIG?.MAPS_BASE_URL || 'https://www.google.com/maps/dir/?api=1';
  const destParam = encodeURIComponent(destName);

  if (!navigator.geolocation) {
    window.open(`${mapsBase}&destination=${destParam}`, '_blank', 'noopener,noreferrer');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      window.open(
        `${mapsBase}&origin=${latitude},${longitude}&destination=${destParam}`,
        '_blank', 'noopener,noreferrer'
      );
    },
    () => {
      window.open(`${mapsBase}&destination=${destParam}`, '_blank', 'noopener,noreferrer');
    },
    { timeout: 5000, maximumAge: 60000 }
  );
}

window.openMaps = openMaps;
