'use client';

import { useState, useRef, useEffect } from 'react';
import CameraView from '@/components/camera/CameraView';
import { OpticalMetrics, processImage } from '@/lib/ai/opencv-processor';
import { ArrowLeft, Upload, Camera, AlertTriangle, ShieldCheck, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import useOpenCV from '@/hooks/use-opencv';

type ScanMode = 'selection' | 'camera' | 'preview' | 'analyzing' | 'results';

export default function ScanPage() {
    const [mode, setMode] = useState<ScanMode>('selection');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<OpticalMetrics | null>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Ensure OpenCV extends to this page for file upload processing
    const cvLoaded = useOpenCV();

    const handleCapture = (image: string, data: OpticalMetrics) => {
        setCapturedImage(image);
        setMetrics(data);
        setAnalysis(null);
        setMode('preview');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!cvLoaded) {
            alert("Analysis engine is initializing. Please try again in a moment.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image(); // Force browser Image
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const result = processImage(canvas);
                if (result) {
                    handleCapture(canvas.toDataURL('image/jpeg', 0.9), result.metrics);
                } else {
                    alert("Could not process image. Please try another.");
                }
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const runExpertAnalysis = async () => {
        if (!capturedImage || !metrics) return;
        setMode('analyzing');

        const embeddings: number[] = [];

        try {
            const { analyzeScan } = await import('@/lib/api');
            const result = await analyzeScan(capturedImage, metrics, embeddings);
            setAnalysis(result);
            setMode('results');
        } catch (e) {
            console.error(e);
            setMode('preview'); // Go back on error
            alert("Analysis failed. See console.");
        }
    };

    const resetScan = () => {
        setCapturedImage(null);
        setMetrics(null);
        setAnalysis(null);
        setMode('selection');
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-white pb-24 font-sans">
            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    {mode !== 'selection' && (
                        <button onClick={resetScan} className="p-2 -ml-2 text-zinc-400 hover:text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    )}
                    <h1 className="text-xl font-bold tracking-tight text-center flex-1">
                        {mode === 'selection' ? "MicroPlastic Scout" :
                            mode === 'results' ? "Risk Assessment" : "Scanner"}
                    </h1>
                    <div className="w-6" /> {/* Spacer */}
                </header>

                {/* MODE: SELECTION */}
                {mode === 'selection' && (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="bg-gradient-to-br from-blue-900/20 to-zinc-900 border border-blue-500/20 p-8 rounded-2xl text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-8 h-8 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold">Start New Scan</h2>
                            <p className="text-zinc-400 max-w-sm mx-auto">
                                Analyze water samples or products for microplastic risks using AI and computer vision.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setMode('camera')}
                                className="group relative p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all text-left overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                    <Camera className="w-24 h-24" />
                                </div>
                                <div className="relative z-10 flex flex-col gap-3">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-zinc-700 group-hover:scale-110 transition">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Use Camera</h3>
                                        <p className="text-sm text-zinc-500">Take a photo directly</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all text-left overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                    <Upload className="w-24 h-24" />
                                </div>
                                <div className="relative z-10 flex flex-col gap-3">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-zinc-700 group-hover:scale-110 transition">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Upload File</h3>
                                        <p className="text-sm text-zinc-500">Select from gallery</p>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                            </button>
                        </div>
                    </div>
                )}

                {/* MODE: CAMERA */}
                {mode === 'camera' && (
                    <div className="animate-in fade-in">
                        <CameraView onCapture={handleCapture} />
                    </div>
                )}

                {/* MODE: PREVIEW & ANALYZING */}
                {(mode === 'preview' || mode === 'analyzing') && capturedImage && (
                    <div className="flex flex-col items-center gap-6 animate-in fade-in">
                        <div className="relative w-full aspect-[3/4] max-w-sm rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
                            <Image src={capturedImage} alt="Preview" fill className="object-cover" />
                            {mode === 'analyzing' && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="text-blue-200 font-medium animate-pulse">Analyzing Structure...</p>
                                </div>
                            )}
                        </div>

                        {mode === 'preview' && (
                            <div className="w-full max-w-sm grid grid-cols-2 gap-3">
                                <button onClick={resetScan} className="py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition font-medium text-sm">
                                    Retake
                                </button>
                                <button
                                    onClick={runExpertAnalysis}
                                    className="py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/20"
                                >
                                    Analyze Risk
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* MODE: RESULTS */}
                {mode === 'results' && analysis && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                        {/* 1. SEVERITY GAUGE */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-full h-1 
                                ${analysis.risk_level === 'Low' || analysis.risk_level === 'Safe' ? 'bg-green-500' :
                                    analysis.risk_level === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'}`}
                            />

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-1">Total Risk Score</h2>
                                    <div className="text-5xl font-bold tracking-tighter flex items-baseline gap-2">
                                        {analysis.risk_score}
                                        <span className="text-lg font-normal text-zinc-500">/100</span>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                                    ${analysis.risk_level === 'Low' || analysis.risk_level === 'Safe' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        analysis.risk_level === 'Moderate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                    {analysis.gemini_analysis.severity_level || analysis.risk_level}
                                </div>
                            </div>

                            {/* Gauge Visual */}
                            <div className="w-full bg-zinc-800 h-4 rounded-full overflow-hidden mb-2">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out 
                                    ${analysis.risk_score < 30 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                                            analysis.risk_score < 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                                    style={{ width: `${analysis.risk_score}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-zinc-500 font-mono">
                                <span>SAFE</span>
                                <span>MODERATE</span>
                                <span>CRITICAL</span>
                            </div>
                        </div>

                        {/* 2. SUMMARY & DETAILS */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Analysis Summary</h3>
                                    <p className="text-zinc-300 leading-relaxed text-sm">
                                        {analysis.gemini_analysis.reasoning}
                                    </p>
                                </div>
                            </div>

                            {analysis.gemini_analysis.details && (
                                <div className="pl-8 text-xs text-zinc-500">
                                    {analysis.gemini_analysis.details}
                                </div>
                            )}
                        </div>

                        {/* 3. BREAKDOWN CHART */}
                        {analysis.gemini_analysis.score_breakdown && analysis.gemini_analysis.score_breakdown.length > 0 && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">Risk Factors</h3>
                                <div className="space-y-4">
                                    {analysis.gemini_analysis.score_breakdown.map((item: any, idx: number) => (
                                        <div key={idx} className="group">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-zinc-200">{item.factor}</span>
                                                <span className="font-mono text-zinc-400">{item.score}/100</span>
                                            </div>
                                            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-1">
                                                <div
                                                    className="h-full bg-blue-500/60 group-hover:bg-blue-400 transition-all"
                                                    style={{ width: `${item.score}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-zinc-500">{item.contribution}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. POTENTIAL HARMS */}
                        {analysis.gemini_analysis.potential_harms && analysis.gemini_analysis.potential_harms.length > 0 && (
                            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4 text-red-400">
                                    <AlertTriangle className="w-5 h-5" />
                                    <h3 className="font-bold">Potential Harms</h3>
                                </div>
                                <ul className="space-y-2">
                                    {analysis.gemini_analysis.potential_harms.map((harm: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-red-200/80">
                                            <span className="block w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                                            {harm}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 5. RECOMMENDATIONS */}
                        {analysis.gemini_analysis.recommendations && analysis.gemini_analysis.recommendations.length > 0 && (
                            <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4 text-green-400">
                                    <ShieldCheck className="w-5 h-5" />
                                    <h3 className="font-bold">Recommendations</h3>
                                </div>
                                <ul className="space-y-2">
                                    {analysis.gemini_analysis.recommendations.map((rec: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-green-200/80">
                                            <span className="block w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={resetScan}
                            className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
                        >
                            <Camera className="w-5 h-5" />
                            Start New Scan
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
