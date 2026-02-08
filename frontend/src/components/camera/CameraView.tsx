import { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Upload, AlertCircle } from 'lucide-react';
import useOpenCV from '@/hooks/use-opencv';
import { processImage, OpticalMetrics } from '@/lib/ai/opencv-processor';

interface CameraViewProps {
    onCapture: (imageSrc: string, metrics: OpticalMetrics) => void;
}

export default function CameraView({ onCapture }: CameraViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string>('');
    const cvLoaded = useOpenCV();
    const [isProcessing, setIsProcessing] = useState(false);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Use back camera on phones
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError('');
        } catch (err) {
            console.error(err);
            setError('Could not access camera. Please allow permissions.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const captureAndProcess = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || !cvLoaded) return;

        setIsProcessing(true);
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Process with OpenCV
        // This draws annotations directly onto the canvas
        // and returns metrics
        const result = processImage(canvas);

        if (result) {
            // Create a final image from the annotated canvas
            const processedImage = canvas.toDataURL('image/jpeg', 0.9);
            onCapture(processedImage, result.metrics);
        }

        setIsProcessing(false);
    }, [cvLoaded, onCapture]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("File selected");
        const file = e.target.files?.[0];
        if (!file) {
            console.log("No file found in event");
            return;
        }
        if (!cvLoaded) {
            console.error("OpenCV not loaded yet");
            setError("Vision Engine not ready. Please wait.");
            return;
        }

        console.log("Reading file:", file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            console.log("File read complete");
            const img = new Image();
            img.onload = () => {
                console.log("Image loaded", img.width, "x", img.height);
                const canvas = canvasRef.current;
                if (!canvas) {
                    console.error("Canvas ref missing");
                    return;
                }
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error("Canvas context missing");
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                console.log("Processing image...");
                const result = processImage(canvas);
                if (result) {
                    console.log("Processing success, triggering onCapture");
                    const processedImage = canvas.toDataURL('image/jpeg', 0.9);
                    onCapture(processedImage, result.metrics);
                } else {
                    console.error("processImage returned null");
                    setError("Failed to process image. Please try another.");
                }
            };
            img.onerror = (err) => {
                console.error("Failed to load image object", err);
                setError("Failed to load image file.");
            };
            img.src = event.target?.result as string;
        };
        reader.onerror = (err) => {
            console.error("FileReader error", err);
            setError("Error reading file.");
        };
        reader.readAsDataURL(file);
    };

    const switchCamera = () => {
        // Placeholder for camera switching logic if multiple cameras exist
        // For now just restarts which might pick up same camera if constraints didn't change
        stopCamera();
        startCamera();
    };

    return (
        <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-black rounded-lg overflow-hidden shadow-2xl border border-zinc-800">
            {!cvLoaded && (
                <div className="absolute top-4 left-4 z-20 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-md">
                    Loading Vision Engine...
                </div>
            )}

            {error ? (
                <div className="flex flex-col items-center justify-center h-full text-red-500 p-4 text-center">
                    <AlertCircle className="h-12 w-12 mb-2" />
                    <p className="mb-4">{error}</p>
                    <div className="flex gap-2">
                        <button onClick={startCamera} className="px-4 py-2 bg-zinc-800 rounded text-white text-sm">Retry Camera</button>
                        <label className="px-4 py-2 bg-blue-600 rounded text-white text-sm cursor-pointer">
                            Upload File
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6 z-10 w-full px-8 pointer-events-none">
                        <label className="pointer-events-auto flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer transition">
                            <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20">
                                <Upload className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium drop-shadow-md">Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>

                        <button
                            onClick={captureAndProcess}
                            disabled={!cvLoaded || isProcessing}
                            className="pointer-events-auto h-20 w-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            <div className="h-16 w-16 bg-white rounded-full"></div>
                        </button>

                        <button
                            onClick={switchCamera}
                            className="pointer-events-auto flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer transition"
                        >
                            <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20">
                                <RefreshCw className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium drop-shadow-md">Flip</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
