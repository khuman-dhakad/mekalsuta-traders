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
  const mapsUrl = new URL(mapsBase);
  mapsUrl.searchParams.set('destination', destName);

  const openDirections = (origin) => {
    const url = new URL(mapsUrl.href);
    if (origin) url.searchParams.set('origin', origin);
    window.open(url.href, '_blank', 'noopener,noreferrer');
  };

  if (!navigator.geolocation) {
    openDirections();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      openDirections(`${latitude},${longitude}`);
    },
    () => {
      openDirections();
    },
    { timeout: 5000, maximumAge: 60000 }
  );
}

window.openMaps = openMaps;
