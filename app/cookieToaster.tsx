'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export default function CookieConsent() {
  useEffect(() => {
    // Check if the user has already accepted cookies
    const consent = localStorage.getItem('cookie-consent');

    if (!consent) {
      toast("🍪 We use cookies to analyze traffic and improve your experience.", {
        duration: Infinity, // It won't disappear automatically
        position: 'bottom-right',
        action: {
          label: 'Accept',
          onClick: () => {
            // Save the choice so it doesn't show up again
            localStorage.setItem('cookie-consent', 'true');
          },
        },
      });
    }
  }, []);

  // Return null because the Toaster should be in your RootLayout
  return null; 
}