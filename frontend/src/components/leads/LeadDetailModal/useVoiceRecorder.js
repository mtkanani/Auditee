import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

// WhatsApp-style voice note: records audio and live-transcribes into the call summary.
export const useVoiceRecorder = ({ callSummary, setCallSummary }) => {
  // Voice Note Recording & Playback state (WhatsApp Style)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [isVoiceNote, setIsVoiceNote] = useState(false);

  // Audio Recording Refs & States
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);
  const [audioBase64, setAudioBase64] = useState(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);

  // Voice recording timer effect
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const previewUrl = URL.createObjectURL(blob);
        setAudioBlobUrl(previewUrl);

        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioBase64(reader.result);
        };
        reader.readAsDataURL(blob);

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsVoiceNote(true);

      // Start SpeechRecognition simultaneously for text transcription if available
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          let finalTranscript = callSummary ? callSummary + ' ' : '';
          recognition.onresult = (event) => {
            let currentInterim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcriptChunk = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcriptChunk + ' ';
              } else {
                currentInterim += transcriptChunk;
              }
            }
            setCallSummary((finalTranscript + currentInterim).trim());
          };
          recognition.start();
          setRecognitionInstance(recognition);
        } catch (e) {
          console.warn('Speech Recognition fallback:', e);
        }
      }

      toast.success('🎙️ Recording voice note audio...', { icon: '🎙️' });
    } catch (err) {
      console.error('Microphone error:', err);
      toast.error('Microphone permission denied or audio device not found.');
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {}
      setRecognitionInstance(null);
    }
    setIsRecording(false);
    toast.success('Voice note audio clip recorded!');
  };

  const clearRecordedAudio = () => {
    setAudioBase64(null);
    setAudioBlobUrl(null);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isRecording,
    recordingSeconds,
    audioBase64,
    setAudioBase64,
    audioBlobUrl,
    setAudioBlobUrl,
    startVoiceRecording,
    stopVoiceRecording,
    clearRecordedAudio,
    formatTimer,
  };
};
