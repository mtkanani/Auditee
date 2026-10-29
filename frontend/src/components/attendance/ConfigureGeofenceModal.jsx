import React, { useState, useEffect } from 'react';
import { CircleAlert, LocateFixed, Save } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Skeleton } from '../common/Skeleton';
import { Button, Field, Input, Select } from '../ui';
import { cn } from '../../lib/cn';
import { useGeofenceSettings, useUpdateGeofenceSettings } from '../../queries/useAttendance';
import toast from 'react-hot-toast';

const RADIUS_OPTIONS = [
  { value: 50, label: '50 m (this building only)' },
  { value: 100, label: '100 m (recommended)' },
  { value: 200, label: '200 m (office campus)' },
  { value: 500, label: '500 m (wide)' },
  { value: 1000, label: '1 km' },
];

export const ConfigureGeofenceModal = ({ isOpen, onClose, onSaved }) => {
  const [geofenceEnabled, setGeofenceEnabled] = useState(false);
  const [officeLat, setOfficeLat] = useState('');
  const [officeLng, setOfficeLng] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [geofenceRadiusMeters, setGeofenceRadiusMeters] = useState(100);

  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const { settings, isLoading } = useGeofenceSettings({ enabled: isOpen });
  const updateMutation = useUpdateGeofenceSettings();

  useEffect(() => {
    if (settings) {
      setGeofenceEnabled(Boolean(settings.geofenceEnabled));
      setOfficeLat(settings.officeLat !== null && settings.officeLat !== undefined ? settings.officeLat : '');
      setOfficeLng(settings.officeLng !== null && settings.officeLng !== undefined ? settings.officeLng : '');
      setOfficeAddress(settings.officeAddress || '');
      setGeofenceRadiusMeters(settings.geofenceRadiusMeters || 100);
    }
  }, [settings]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (geofenceEnabled) {
      if (!officeLat || !officeLng) {
        toast.error('Please specify valid Latitude & Longitude or click "Use My Current GPS"');
        return;
      }
    }

    const payload = {
      geofenceEnabled,
      officeLat: officeLat ? parseFloat(officeLat) : null,
      officeLng: officeLng ? parseFloat(officeLng) : null,
      officeAddress: officeAddress || null,
      geofenceRadiusMeters: parseInt(geofenceRadiusMeters, 10) || 100,
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        if (onSaved) onSaved();
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Office location for check-in">
      {isLoading ? (
        <div className="space-y-4" aria-busy="true">
          <Skeleton className="h-16" />
          <Skeleton className="h-24" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-muted">
            When this is on, staff can only check in or out while they are within the radius of your office.
          </p>

          <button
            type="button"
            role="switch"
            aria-checked={geofenceEnabled}
            onClick={() => setGeofenceEnabled(!geofenceEnabled)}
            className={cn(
              'w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
              geofenceEnabled ? 'border-accent bg-accent-soft/50' : 'border-line hover:border-line-strong'
            )}
          >
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-fg">Only allow check-in at the office</span>
              <span className="block text-xs text-muted">Uses the phone or laptop's location</span>
            </span>
            <span aria-hidden="true" className={cn('relative w-10 h-6 rounded-full transition-colors shrink-0', geofenceEnabled ? 'bg-accent' : 'bg-line-strong')}>
              <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all', geofenceEnabled ? 'left-5' : 'left-1')} />
            </span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-sunken/60 border border-line">
            <div className="text-sm">
              <p className="font-medium text-fg">At the office right now?</p>
              <p className="text-xs text-muted">Fill in the coordinates from this device's location.</p>
            </div>
            <Button size="sm" icon={LocateFixed} loading={isDetectingGps} onClick={handleDetectCurrentGPS} className="shrink-0">
              Use my location
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Latitude" required={geofenceEnabled}>
              {(p) => <Input {...p} type="number" step="any" required={geofenceEnabled} placeholder="e.g. 23.0225" value={officeLat} onChange={(e) => setOfficeLat(e.target.value)} className="font-mono" />}
            </Field>
            <Field label="Longitude" required={geofenceEnabled}>
              {(p) => <Input {...p} type="number" step="any" required={geofenceEnabled} placeholder="e.g. 72.5714" value={officeLng} onChange={(e) => setOfficeLng(e.target.value)} className="font-mono" />}
            </Field>
            <Field label="Office name or address">
              {(p) => <Input {...p} placeholder="e.g. Main office, Ellisbridge" value={officeAddress} onChange={(e) => setOfficeAddress(e.target.value)} />}
            </Field>
            <Field label="Allowed radius">
              {(p) => <Select {...p} value={geofenceRadiusMeters} onChange={(e) => setGeofenceRadiusMeters(e.target.value)} options={RADIUS_OPTIONS} />}
            </Field>
          </div>

          {geofenceEnabled && (
            <p className="flex items-start gap-2 text-xs text-muted">
              <CircleAlert className="w-4 h-4 text-warning shrink-0" aria-hidden="true" />
              Anyone more than {geofenceRadiusMeters} m away will see an error when they try to check in or out.
            </p>
          )}

          <div className="pt-4 border-t border-line flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" icon={Save} loading={updateMutation.isPending}>Save</Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
