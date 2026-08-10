import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { FiMapPin, FiNavigation, FiShield, FiSave, FiAlertCircle } from 'react-icons/fi';
import { attendanceService } from '../../services/attendanceService';
import toast from 'react-hot-toast';

export const ConfigureGeofenceModal = ({ isOpen, onClose, onSaved }) => {
  const [geofenceEnabled, setGeofenceEnabled] = useState(false);
  const [officeLat, setOfficeLat] = useState('');
  const [officeLng, setOfficeLng] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [geofenceRadiusMeters, setGeofenceRadiusMeters] = useState(100);

  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchGeofenceSettings();
    }
  }, [isOpen]);

  const fetchGeofenceSettings = async () => {
    setIsLoading(true);
    try {
      const res = await attendanceService.getGeofenceSettings();
      if (res.data) {
        setGeofenceEnabled(Boolean(res.data.geofenceEnabled));
        setOfficeLat(res.data.officeLat !== null && res.data.officeLat !== undefined ? res.data.officeLat : '');
        setOfficeLng(res.data.officeLng !== null && res.data.officeLng !== undefined ? res.data.officeLng : '');
        setOfficeAddress(res.data.officeAddress || '');
        setGeofenceRadiusMeters(res.data.geofenceRadiusMeters || 100);
      }
    } catch (err) {
      toast.error('Failed to load geofence settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetectCurrentGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    toast.loading('Acquiring high-accuracy office GPS coordinates...', { id: 'gps-loader' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss('gps-loader');
        setOfficeLat(position.coords.latitude.toFixed(6));
        setOfficeLng(position.coords.longitude.toFixed(6));
        toast.success('Successfully detected current GPS location!');
        setIsDetectingGps(false);
      },
      (error) => {
        toast.dismiss('gps-loader');
        toast.error(`GPS Error: ${error.message}. Please enable location permissions.`);
        setIsDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (geofenceEnabled) {
      if (!officeLat || !officeLng) {
        toast.error('Please specify valid Latitude & Longitude or click "Use My Current GPS"');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        geofenceEnabled,
        officeLat: officeLat ? parseFloat(officeLat) : null,
        officeLng: officeLng ? parseFloat(officeLng) : null,
        officeAddress: officeAddress || null,
        geofenceRadiusMeters: parseInt(geofenceRadiusMeters, 10) || 100,
      };

      await attendanceService.updateGeofenceSettings(payload);
      toast.success('Office GPS Geofence settings saved successfully!');
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save geofence settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Office GPS Geofence & Check-In Control 📍">
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading geofence settings...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
            <p className="font-bold text-indigo-400 flex items-center gap-1.5">
              <FiShield className="w-4 h-4" />
              <span>Geofenced Attendance Boundary</span>
            </p>
            <p className="text-slate-400">
              When Geofence is enabled, employees can only check in or check out if they are physically within the allowed radius of your office.
            </p>
          </div>

          {/* Toggle Geofence */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-100">Enable Strict GPS Geofencing</p>
              <p className="text-[10px] text-slate-400">Restrict Check-In & Check-Out to office coordinates</p>
            </div>
            <button
              type="button"
              onClick={() => setGeofenceEnabled(!geofenceEnabled)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                geofenceEnabled ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  geofenceEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Detect Current Location Button */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20">
            <div className="text-xs text-indigo-300">
              <span className="font-bold block">Quick Office GPS Capture</span>
              <span className="text-[10px] text-indigo-400/80">Click while sitting in your office to auto-populate coordinates</span>
            </div>
            <button
              type="button"
              onClick={handleDetectCurrentGPS}
              disabled={isDetectingGps}
              className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all whitespace-nowrap disabled:opacity-50"
            >
              <FiNavigation className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
              <span>{isDetectingGps ? 'Detecting...' : 'Use My GPS'}</span>
            </button>
          </div>

          {/* Coordinates Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Office Latitude *</label>
              <input
                type="number"
                step="any"
                required={geofenceEnabled}
                placeholder="e.g. 23.0225"
                value={officeLat}
                onChange={(e) => setOfficeLat(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Office Longitude *</label>
              <input
                type="number"
                step="any"
                required={geofenceEnabled}
                placeholder="e.g. 72.5714"
                value={officeLng}
                onChange={(e) => setOfficeLng(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Office Address & Radius */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Office Address / Location Label</label>
              <input
                type="text"
                placeholder="e.g. Main HQ, Ellisbridge, Ahmedabad"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Allowed Geofence Radius</label>
              <select
                value={geofenceRadiusMeters}
                onChange={(e) => setGeofenceRadiusMeters(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value={50}>50 Meters (Strict - Building Only)</option>
                <option value={100}>100 Meters (Recommended - Standard)</option>
                <option value={200}>200 Meters (Office Campus / Complex)</option>
                <option value={500}>500 Meters (Wide Radius)</option>
                <option value={1000}>1000 Meters (1 Kilometer)</option>
              </select>
            </div>
          </div>

          {/* Geofence Status Note */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <FiAlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              If geofencing is active, employees outside the {geofenceRadiusMeters}m boundary will receive an access error when attempting to check in or out.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Geofence...' : 'Save Geofence Settings'}</span>
          </button>
        </form>
      )}
    </Modal>
  );
};
