"use client";
import { useState, useEffect, useRef } from "react";

export default function Popup() {
  const [name, setName] = useState("");
  const [adress, setLocationAdress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const inputRef = useRef(null);

  // auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  const handleSubmit = () => {
    if (!name.trim()) return;

    const channel = new BroadcastChannel("name_channel");
    channel.postMessage({ name: name, adress: adress });
    channel.close();

    setSubmitted(true);
  };

  return (
    <div className="p-4">
      {!submitted ? (
        <>
          <input
            ref={inputRef}
            className="border p-2 mb-2 w-full"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button className="border px-4 py-2" onClick={handleSubmit}>
            Accept
          </button>
        </>
      ) : (
        <div>Data submitted! Closing in {countdown}…</div>
      )}
    </div>
  );
}
