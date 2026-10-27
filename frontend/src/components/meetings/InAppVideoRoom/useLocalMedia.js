import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

// Local camera / microphone / screen-share streams and the toolbar toggles.
export const useLocalMedia = () => {
  // Media streams & video element references
  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [raisedHand, setRaisedHand] = useState(false);
  const [mutedByHostLocal] = useState(false);

  // 1. Initialize local camera & microphone streams
  useEffect(() => {
    let isMounted = true;

    const startLocalMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!isMounted) return;

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setCamOn(true);
        setMicOn(true);
      } catch (err) {
        console.warn('Unable to access video/mic devices:', err.message);
        toast.error('Unable to access camera or microphone. Please check browser permissions.');
        setCamOn(false);
        setMicOn(false);
      }
    };

    startLocalMedia();

    return () => {
      isMounted = false;
      // Cleanup streams on exit
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 2. Toggle Microphone
  const toggleMic = () => {
    if (mutedByHostLocal) {
      toast.error('Your microphone was muted by the meeting Host.');
      return;
    }

    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !micOn;
      });
    }

    setMicOn(!micOn);
    toast.success(!micOn ? 'Microphone unmuted' : 'Microphone muted');
  };

  // 3. Toggle Camera
  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !camOn;
      });
    }

    setCamOn(!camOn);
    toast.success(!camOn ? 'Camera turned on' : 'Camera turned off');
  };

  // 4. Toggle Screen Sharing (Whole Screen / Window / Chrome Tab selector)
  const toggleScreenShare = async () => {
    if (screenSharing) {
      // Stop Screen Share
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setScreenSharing(false);
      toast.success('Screen sharing stopped');
    } else {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: 'monitor',
          },
          audio: true,
        });

        screenStreamRef.current = displayStream;
        setScreenSharing(true);
        toast.success('Screen sharing started! Choose Entire Screen, Window, or Tab.');

        setTimeout(() => {
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = displayStream;
          }
        }, 100);

        displayStream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
          screenStreamRef.current = null;
          toast.info('Screen sharing ended');
        };
      } catch (err) {
        console.warn('Screen share canceled/failed:', err);
        if (err.name !== 'NotAllowedError') {
          toast.error('Failed to share screen.');
        }
      }
    }
  };

  // 5. Toggle Hand Raise
  const toggleHand = () => {
    setRaisedHand(!raisedHand);
    toast(raisedHand ? 'Hand lowered' : '✋ Hand raised', { icon: '✋' });
  };

  return {
    localVideoRef,
    screenVideoRef,
    micOn,
    camOn,
    screenSharing,
    raisedHand,
    mutedByHostLocal,
    toggleMic,
    toggleCam,
    toggleScreenShare,
    toggleHand,
  };
};
