import type { ThemeMode } from '../types/counter';

export interface SunTimes {
  sunriseMinutes: number; // minutes from midnight (0..1439)
  sunsetMinutes: number; // minutes from midnight (0..1439)
  sunriseFormatted: string; // "HH:MM"
  sunsetFormatted: string; // "HH:MM"
}

function formatMinutesToHHMM(totalMinutes: number): string {
  const clamped = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hh = Math.floor(clamped / 60);
  const mm = clamped % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function estimateDefaultCoordinates(): { lat: number; lng: number } {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Dushanbe') || tz.includes('Tashkent') || tz.includes('Samarkand')) {
      return { lat: 38.5598, lng: 68.787 };
    }
    if (tz.includes('Moscow')) {
      return { lat: 55.7558, lng: 37.6173 };
    }
    if (tz.includes('Almaty') || tz.includes('Bishkek')) {
      return { lat: 43.222, lng: 76.8512 };
    }
  } catch {
    // Fallback to timezone offset estimation
  }
  const offsetHours = -new Date().getTimezoneOffset() / 60;
  return {
    lat: 38.56,
    lng: offsetHours * 15,
  };
}

/**
 * Calculates local sunrise and sunset times completely offline using NOAA solar equations.
 */
export function calculateSunTimes(
  date: Date = new Date(),
  latitude?: number | null,
  longitude?: number | null,
): SunTimes {
  const fallback = estimateDefaultCoordinates();
  const lat = typeof latitude === 'number' && Number.isFinite(latitude) ? latitude : fallback.lat;
  const lng =
    typeof longitude === 'number' && Number.isFinite(longitude) ? longitude : fallback.lng;

  const dayOfYear = getDayOfYear(date);
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  // Fractional year in radians
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1 + 0.5);

  // Equation of time (in minutes)
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  // Solar declination angle (in radians)
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const zenith = 90.833 * rad;
  const latRad = lat * rad;

  const cosHourAngle =
    Math.cos(zenith) / (Math.cos(latRad) * Math.cos(decl)) -
    Math.tan(latRad) * Math.tan(decl);

  // Clamp for extreme polar latitudes
  const clampedCos = Math.max(-1, Math.min(1, cosHourAngle));
  const hourAngleDeg = Math.acos(clampedCos) * deg;

  const tzOffsetMinutes = -date.getTimezoneOffset();
  const solarNoonMinutes = 720 - 4 * lng - eqTime + tzOffsetMinutes;
  const deltaMinutes = hourAngleDeg * 4;

  const sunriseMinutes = Math.max(240, Math.min(600, Math.round(solarNoonMinutes - deltaMinutes)));
  const sunsetMinutes = Math.max(960, Math.min(1320, Math.round(solarNoonMinutes + deltaMinutes)));

  return {
    sunriseMinutes,
    sunsetMinutes,
    sunriseFormatted: formatMinutesToHHMM(sunriseMinutes),
    sunsetFormatted: formatMinutesToHHMM(sunsetMinutes),
  };
}

/**
 * Returns 'light' between local sunrise and sunset, and 'dark' after sunset / before sunrise.
 */
export function getScheduledThemeForNow(
  now: Date = new Date(),
  latitude?: number | null,
  longitude?: number | null,
): { theme: ThemeMode; sunTimes: SunTimes } {
  const sunTimes = calculateSunTimes(now, latitude, longitude);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const isDaytime =
    currentMinutes >= sunTimes.sunriseMinutes && currentMinutes < sunTimes.sunsetMinutes;

  return {
    theme: isDaytime ? 'light' : 'dark',
    sunTimes,
  };
}
