import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Navigation, MapPin, Globe, Compass as CompassIcon, CheckCircle2 } from 'lucide-react';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function QiblaCompassComponent() {
  const [coords, setCoords] = useState(null);
  const [qiblaAngle, setQiblaAngle] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [cardinalDirection, setCardinalDirection] = useState('');
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const calculateQiblaBearing = useCallback((lat, lng) => {
    const phi1 = (lat * Math.PI) / 180;
    const phi2 = (KAABA_LAT * Math.PI) / 180;
    const deltaLambda = ((KAABA_LNG - lng) * Math.PI) / 180;

    const y = Math.sin(deltaLambda);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
    
    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  }, []);

  const calculateDistance = useCallback((lat, lng) => {
    const R = 6371;
    const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
    const dLon = ((KAABA_LNG - lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) * Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }, []);

  const getCardinalName = useCallback((bearing) => {
    if (bearing >= 247.5 && bearing < 292.5) return 'West (W)';
    if (bearing >= 225 && bearing < 247.5) return 'West-Southwest (WSW)';
    if (bearing >= 202.5 && bearing < 225) return 'South-Southwest (SSW)';
    if (bearing >= 292.5 && bearing < 315) return 'West-Northwest (WNW)';
    return `${Math.round(bearing)}° from True North`;
  }, []);

  const detectLocation = useCallback(() => {
    setLoading(true);
    setPermissionDenied(false);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });
          
          const angle = calculateQiblaBearing(latitude, longitude);
          setQiblaAngle(angle);
          setDistanceKm(calculateDistance(latitude, longitude));
          setCardinalDirection(getCardinalName(angle));
          setLoading(false);
          setPermissionDenied(false);
        },
        () => {
          const defaultLat = 31.5204;
          const defaultLng = 74.3587;
          setCoords({ lat: defaultLat, lng: defaultLng });
          
          const angle = calculateQiblaBearing(defaultLat, defaultLng);
          setQiblaAngle(angle);
          setDistanceKm(calculateDistance(defaultLat, defaultLng));
          setCardinalDirection(getCardinalName(angle));
          setPermissionDenied(true);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setPermissionDenied(true);
      setLoading(false);
    }
  }, [calculateQiblaBearing, calculateDistance, getCardinalName]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  const dialTicks = useMemo(() => [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330], []);
  const tiltDegrees = useMemo(() => (qiblaAngle ? Math.abs(Math.round(270 - qiblaAngle)) : 9), [qiblaAngle]);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-6">
      <div className="p-4 sm:p-8 lg:p-10 rounded-3xl bg-white/85 border border-gold/30 shadow-lg shadow-gold/5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Visual Compass Instrument */}
        <div className="md:col-span-6 flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <div className="text-center md:text-left w-full flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-earth-text tracking-tight">Location-Based Qibla</h3>
              <p className="text-[11px] sm:text-xs text-earth-muted flex items-center gap-1 mt-0.5 justify-center md:justify-start">
                <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                {coords ? `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E` : 'Detecting GPS coordinates...'}
              </p>
            </div>
            <div className="px-3 py-1 rounded-full text-[11px] font-bold bg-gold/15 text-gold-dark border border-gold/25">
              {cardinalDirection || 'Locating...'}
            </div>
          </div>

          <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full border-4 border-gold/30 flex items-center justify-center bg-gradient-to-b from-[#fffdfa] to-cream shadow-inner overflow-hidden will-change-transform">
            <span className="absolute top-2 text-[11px] sm:text-xs font-black text-red-500 font-mono">N (0°)</span>
            <span className="absolute bottom-2 text-[11px] sm:text-xs font-bold text-earth-muted font-mono">S (180°)</span>
            <span className="absolute right-3 text-[11px] sm:text-xs font-bold text-earth-muted font-mono">E (90°)</span>
            <span className="absolute left-3 text-[11px] sm:text-xs font-bold text-earth-muted font-mono">W (270°)</span>

            {dialTicks.map((deg) => (
              <div
                key={deg}
                className="absolute w-0.5 h-2.5 bg-gold/40"
                style={{
                  transform: `rotate(${deg}deg) translateY(-98px)`,
                }}
              />
            ))}

            <motion.div 
              initial={{ rotate: 0 }}
              animate={{ rotate: qiblaAngle || 0 }}
              transition={{ type: "spring", stiffness: 45, damping: 12 }}
              className="absolute w-full h-full flex items-center justify-center pointer-events-none z-20 will-change-transform"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center text-gold-dark filter drop-shadow-md">
                  <Navigation className="w-8 h-8 sm:w-10 sm:h-10 fill-gold stroke-gold-dark -rotate-45" />
                </div>
                <div className="w-1.5 h-20 sm:h-24 bg-gradient-to-b from-gold-dark via-gold to-transparent rounded-full" />
              </div>
            </motion.div>

            <div className="z-30 bg-white/95 px-4 py-2 rounded-2xl border border-gold/30 shadow-md backdrop-blur-sm text-center">
              <span className="text-[9px] uppercase tracking-wider font-bold text-earth-muted block">Qibla Heading</span>
              <span className="text-base sm:text-2xl font-black text-gold-dark">
                {qiblaAngle !== null ? `${qiblaAngle.toFixed(1)}°` : '--'}
              </span>
            </div>
          </div>

          <button 
            onClick={detectLocation}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gold/15 hover:bg-gold/25 text-gold-dark font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer border border-gold/30 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Re-sync Coordinates
          </button>
        </div>

        {/* Right Column: Guidance & Telemetry */}
        <div className="md:col-span-6 space-y-4">
          {permissionDenied && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-left space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Location Access Blocked</h4>
                  <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                    Browser blocked automatic GPS. Tap the lock icon in the URL bar to allow location permissions.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-5 rounded-2xl bg-cream-dark/50 border border-gold/20 text-left space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold-dark flex-shrink-0" />
              <span className="text-xs font-bold text-earth-text uppercase tracking-wider">Prayer Orientation Guide</span>
            </div>
            
            <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
              From your location, the Kaaba is located at <strong className="text-earth-text font-bold">{qiblaAngle ? `${qiblaAngle.toFixed(1)}°` : '--'}</strong> clockwise from True North.
            </p>

            <div className="p-3 rounded-xl bg-white/90 border border-gold/20 space-y-1 shadow-sm">
              <p className="text-[10px] font-bold text-earth-muted uppercase tracking-wider">Practical Alignment</p>
              <p className="text-xs sm:text-sm text-earth-text leading-relaxed">
                Face toward the <strong className="text-gold-dark font-bold">West</strong> (sunset direction) and turn approximately <strong className="text-gold-dark font-bold">{tiltDegrees}° to your left</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-gold/20 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold-dark flex-shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[9px] sm:text-[10px] uppercase text-earth-muted font-bold block truncate">Distance</span>
                <span className="text-xs sm:text-base font-black text-earth-text">{distanceKm ? `${distanceKm.toLocaleString()} km` : '--'}</span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-gold/20 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold-dark flex-shrink-0">
                <CompassIcon className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[9px] sm:text-[10px] uppercase text-earth-muted font-bold block truncate">Sector</span>
                <span className="text-xs sm:text-base font-black text-earth-text truncate block">{cardinalDirection || '--'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default React.memo(QiblaCompassComponent);