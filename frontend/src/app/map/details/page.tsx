'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Thermometer, Wind, AlertTriangle, TrendingUp, Waves, Factory, Building2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Link from 'next/link';
import { Suspense, useState } from 'react';

// Mock Data Generators
const generateTrendData = (baseScore: number, timeRange: string) => {
    const data = [];
    let count = 6;
    let period = 'Month';

    if (timeRange === 'Last Month') { count = 30; period = 'Day'; }
    if (timeRange === 'Last 6 Months') { count = 6; period = 'Month'; }
    if (timeRange === 'Last Year') { count = 12; period = 'Month'; }
    if (timeRange === 'Last 3 Years') { count = 3; period = 'Year'; }

    let currentScore = baseScore;

    for (let i = 0; i < count; i++) {
        // Random variance +/- 5
        const variance = Math.floor(Math.random() * 11) - 5;
        currentScore = Math.max(0, Math.min(100, currentScore + variance));

        data.push({
            name: `${period} ${i + 1}`,
            score: currentScore,
        });
    }
    return data.reverse();
};

function DetailsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [timeRange, setTimeRange] = useState('Last 6 Months');

    const name = searchParams.get('name') || 'Unknown Location';
    const score = parseInt(searchParams.get('score') || '0');
    const status = searchParams.get('status') || 'Unknown';
    const note = searchParams.get('note') || 'No additional details available.';

    const trendData = generateTrendData(score, timeRange);

    // Determine colors based on score
    const scoreColor = score > 70 ? 'text-red-500' : score > 40 ? 'text-yellow-500' : 'text-green-500';
    const chartColor = score > 70 ? '#ef4444' : score > 40 ? '#eab308' : '#22c55e';
    const bgGradient = score > 70 ? 'from-red-950/30' : score > 40 ? 'from-yellow-950/30' : 'from-green-950/30';

    return (
        <main className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 pb-20">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header & Back */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold">{name}</h1>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${score > 70 ? 'border-red-500/50 bg-red-500/10 text-red-500' :
                                    score > 40 ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500' :
                                        'border-green-500/50 bg-green-500/10 text-green-500'
                                }`}>
                                {status} Risk
                            </span>
                            <span>•</span>
                            <span>Analysis Report</span>
                        </div>
                    </div>
                </div>

                {/* Score Overview */}
                <section className={`rounded-2xl border border-zinc-800 bg-gradient-to-b ${bgGradient} to-zinc-900/50 p-6 md:p-10 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                        <div>
                            <h2 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-2">Microplastic Optical Risk Score</h2>
                            <div className={`text-6xl md:text-8xl font-black ${scoreColor} mb-4`}>
                                {score}<span className="text-2xl md:text-4xl text-zinc-600">/100</span>
                            </div>
                            <p className="text-zinc-300 leading-relaxed text-lg">
                                {note}
                            </p>
                        </div>
                        <div className="space-y-4 bg-black/20 p-6 rounded-xl border border-white/5">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-400" />
                                Primary Risk Factors
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400">Turbidity (Sediment)</span>
                                    <span className="font-mono text-white">High (85%)</span>
                                </li>
                                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-orange-400 h-full w-[85%]"></div>
                                </div>
                                <li className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400">Spectral Anomalies</span>
                                    <span className="font-mono text-white">Moderate (42%)</span>
                                </li>
                                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-yellow-400 h-full w-[42%]"></div>
                                </div>
                                <li className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400">Surface Debris</span>
                                    <span className="font-mono text-white">Detected</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Environmental Context */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Thermometer className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-zinc-200">Water Temp</h3>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">24.5°C</div>
                        <p className="text-xs text-zinc-500">Normal for season. Higher temps can accelerate plastic degradation into microplastics.</p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Wind className="w-5 h-5 text-green-400" />
                            </div>
                            <h3 className="font-semibold text-zinc-200">Air Quality (AQI)</h3>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">42 (Good)</div>
                        <p className="text-xs text-zinc-500">Atmospheric deposition is a minor contributor in this area currently.</p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Waves className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-zinc-200">Flow Rate</h3>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">Low Flow</div>
                        <p className="text-xs text-zinc-500">Stagnant water allows microplastics to accumulate and settle in sediment.</p>
                    </div>
                </div>

                {/* Trends Graph */}
                <section className="bg-zinc-900 ring-1 ring-zinc-800 rounded-xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                {timeRange} Risk Trend
                            </h3>
                            <p className="text-sm text-zinc-400">Historical analysis of optical anomalies.</p>
                        </div>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-zinc-950 border border-zinc-800 text-sm text-zinc-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-zinc-700"
                        >
                            <option>Last Month</option>
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                            <option>Last 3 Years</option>
                        </select>
                    </div>

                    <div className="h-[300px] w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="scoreHighlight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#52525b"
                                    tick={{ fill: '#71717a', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#52525b"
                                    tick={{ fill: '#71717a', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke={chartColor}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#scoreHighlight)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Potential Sources */}
                <section className="grid md:grid-cols-2 gap-8 pt-4">
                    <div>
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Factory className="w-5 h-5 text-zinc-400" />
                            Potential Contamination Sources
                        </h4>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            Based on hydraulic modeling and satellite imagery, the primary contributors to microplastic load in this water body appear to be:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                                <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                                <div>
                                    <span className="block text-sm font-medium text-white">Industrial Effluent</span>
                                    <span className="text-xs text-zinc-500">Proximity to manufacturing zones suggests pellet/nurdle loss.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                                <div className="mt-1 w-2 h-2 rounded-full bg-yellow-500 shrink-0"></div>
                                <div>
                                    <span className="block text-sm font-medium text-white">Urban Runoff</span>
                                    <span className="text-xs text-zinc-500">Tire wear particles and road debris washing into storm drains.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-zinc-400" />
                            Community Impact
                        </h4>
                        <div className="bg-blue-900/10 border border-blue-900/30 p-6 rounded-xl">
                            <p className="text-blue-100 text-sm leading-relaxed mb-4">
                                This water body is a critical habitat for local wildlife. High microplastic levels can bioaccumulate in the food chain, affecting fish populations and bird life.
                            </p>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-xs font-semibold transition-colors">
                                    Download Full Report
                                </button>
                                <button className="flex-1 bg-white hover:bg-zinc-100 text-zinc-900 py-2 rounded-md text-xs font-semibold transition-colors">
                                    Share Findings
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}

export default function DetailsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading analysis...</div>}>
            <DetailsContent />
        </Suspense>
    );
}
