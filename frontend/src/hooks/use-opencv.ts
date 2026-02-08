import { useState, useEffect } from 'react';

export default function useOpenCV() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Check if script is already loaded or loading
        if (window.cv && window.cvReady) {
            setLoaded(true);
            return;
        }

        const existingScript = document.querySelector('script[src="/opencv.js"]');
        if (existingScript) {
            // Script exists, check if ready or wait
            if (window.cv && window.cvReady) {
                setLoaded(true);
            } else {
                // If script exists but not ready, we need to poll or wait for the existing callback
                // Since we can't easily hook into the existing script's specific onload if it's external,
                // we can just poll for window.cvReady
                const interval = setInterval(() => {
                    if (window.cv && window.cvReady) {
                        clearInterval(interval);
                        setLoaded(true);
                    }
                }, 100);
                return () => clearInterval(interval);
            }
            return;
        }

        const script = document.createElement('script');
        script.src = '/opencv.js';
        script.async = true;
        script.onload = () => {
            // OpenCV.js takes a moment to initialize Wasm
            window.cv['onRuntimeInitialized'] = () => {
                window.cvReady = true;
                setLoaded(true);
                console.log('OpenCV.js Ready');
            };
        };
        script.onerror = () => {
            console.error('Failed to load OpenCV.js');
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup if needed, though usually we want CV to stay
        };
    }, []);

    return loaded;
}
