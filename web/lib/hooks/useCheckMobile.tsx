import { useEffect, useState } from 'react';

export function useCheckMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the device is mobile
    const mobileCheck = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);

    // Optional: Listen for screen resizing to handle dynamic changes
    const handleResize = () => {
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
