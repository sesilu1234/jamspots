import { useMapContext } from './mapContext';
import { useState, useRef, useEffect } from 'react';

export default function Button({ className }: { className?: string }) {
  const { map, locationData, setLocation } = useMapContext();
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleSubmit = () => {
    const channel = new BroadcastChannel('location_broadcast');
    channel.postMessage(locationData);
    console.log('here is :');
    console.log(locationData);
    channel.close();

    setSubmitted(true);
  };

  // countdown after submission
  useEffect(() => {
    if (!submitted) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (window.opener) window.opener.focus();
          window.close();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [submitted]);

  return (
    <div className="p-4">
      {!submitted ? (
        <button
          onClick={handleSubmit}
          className={`bg-yellow-400 text-black px-3 py-1 rounded-sm shadow ${className}`}
        >
          Accept and Send
        </button>
      ) : (
        <div>Data submitted! Closing in {countdown}…</div>
      )}
    </div>
  );
}
