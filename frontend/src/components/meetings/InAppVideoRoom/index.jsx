import React from 'react';
import { Monitor } from 'lucide-react';
import { useVideoRoom } from './useVideoRoom';
import { RoomTopBar } from './RoomTopBar';
import { VideoGrid } from './VideoGrid';
import { ControlsToolbar } from './ControlsToolbar';
import { InviteDrawer } from './InviteDrawer';

export const InAppVideoRoom = ({ meeting, onClose }) => {
  const room = useVideoRoom({ meeting });
  const { screenSharing, screenVideoRef, isInviteOpen } = room;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans">
      {/* Video Room Top Navbar */}
      <RoomTopBar {...room} meeting={meeting} onClose={onClose} />

      {/* Main Content Area */}
      <div className="flex-1 p-4 bg-slate-950 overflow-y-auto flex flex-col gap-4">
        {/* Screen Share Display Container */}
        {screenSharing && (
          <div className="w-full relative rounded-3xl bg-slate-900 border-2 border-indigo-500/50 overflow-hidden shadow-2xl min-h-[380px] max-h-[500px] flex items-center justify-center">
            <video
              ref={screenVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
            />
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-indigo-950/90 border border-indigo-500/40 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md">
              <Monitor className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Screen Sharing Active (Entire Screen / Window / Tab)</span>
            </div>
          </div>
        )}

        {/* Video Call Stream Grid */}
        <VideoGrid {...room} />
      </div>

      {/* Video Call Controls Toolbar */}
      <ControlsToolbar {...room} onClose={onClose} />

      {/* In-Call Live Participant Invitation Drawer Modal */}
      {isInviteOpen && <InviteDrawer {...room} />}
    </div>
  );
};

export default InAppVideoRoom;
