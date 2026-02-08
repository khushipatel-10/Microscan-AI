import Link from "next/link";
import { ArrowRight, Waves, Microscope, Map, ShieldAlert } from "lucide-react";
import BackgroundWaves from "@/components/ui/BackgroundWaves";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-950">
      {/* Hero Section */}
      <section className="relative w-full py-24 lg:py-32 xl:py-48 text-white overflow-hidden">
        {/* Background Waves */}
        <BackgroundWaves />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/50 to-slate-950/90 -z-20"></div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/20 w-fit backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                MicroVisual Risk Screening
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-teal-200 pb-2">
                Satellite Science, Applied to Your Community.
              </h1>
              <p className="max-w-[600px] text-cyan-100/70 md:text-xl font-light leading-relaxed">
                MicroScan AI democratizes optical spectroscopy principles to screen for microplastic risks in local waterways. Inspired by ocean research.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row pt-6">
                <Link
                  href="/scan"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-cyan-500 px-8 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-400 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                >
                  Start Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/map"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-8 text-sm font-medium text-white shadow-sm transition-all hover:bg-white/10 hover:border-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 backdrop-blur-sm"
                >
                  View Community Map
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:mr-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-900/20 skew-y-1 hover:skew-y-0 transition-transform duration-700 group">
              {/* Visual Enhancement - Grid Overlay */}
              <div className="w-full aspect-video bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>

                {/* Floating Card */}
                <div className="text-center p-8 bg-black/40 backdrop-blur-md rounded-xl m-8 border border-white/10 relative z-10 shadow-xl">
                  <div className="absolute -top-1 -right-1 w-20 h-20 bg-cyan-500/20 blur-3xl rounded-full"></div>
                  <p className="font-mono text-xs font-bold text-cyan-400 mb-2 tracking-widest">OPTICAL ANOMALY DETECTED</p>
                  <div className="text-5xl font-black text-white mb-2 tracking-tight">78<span className="text-2xl text-white/50">/100</span></div>
                  <div className="flex items-center justify-center gap-2 text-xs text-cyan-200/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    High Turbidity &bull; Color Variance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Glows */}
        <div className="absolute top-0 right-0 -z-10 bg-cyan-500/10 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -z-10 bg-teal-500/10 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-20 md:py-32 bg-slate-950 relative border-t border-white/5">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              From Orbit to Local Creek
            </h2>
            <p className="max-w-[700px] text-slate-400 md:text-lg/relaxed leading-relaxed">
              Microplastics change how light interacts with water. We use computer vision to translate these optical signatures into actionable risk data.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Microscope className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Scientific Foundation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Explicitly inspired by <strong>Dr. Karl Kaiser&apos;s</strong> research at Texas A&M Galveston on optical properties and satellite spectroscopy.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <Waves className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Optical Proxy</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We analyze turbidity, surface anomalies, and spectral reflectance as <strong>risk indicators</strong>, not direct particle counters.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Community Scale</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Empowering citizen scientists to map potential hotspots, guiding professional lab sampling where it matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ethics/Disclaimer Section */}
      <section className="w-full py-20 bg-slate-900 border-t border-white/5">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="bg-slate-700/50 p-4 rounded-full border border-slate-600">
                <ShieldAlert className="h-8 w-8 text-cyan-400" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Ethical & Scientific Boundaries</h3>
                <p className="text-slate-400 leading-relaxed text-lg">
                  MicroScan AI is a <strong>screening tool</strong>. We do not claim to replace laboratory filtration and spectroscopy (FTIR/Raman).
                  Our goal is to identify waterways with <em>high optical probability</em> of contamination to prioritize resource-intensive testing.
                </p>
                <div className="pt-2 font-mono text-xs text-cyan-300 bg-cyan-950/30 p-4 rounded-lg border border-cyan-900/50 inline-block">
                  &quot;This tool does not replace laboratory testing. It highlights potential microplastic risk areas that may require further investigation.&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-4 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-white/5 bg-slate-950 text-slate-500 text-xs">
        <p>
          © 2026 MicroScan AI. Built for TIDALHACK:26.
        </p>
        <nav className="sm:ml-auto flex gap-6">
          <Link className="hover:text-cyan-400 transition-colors" href="#">
            Scientific Git
          </Link>
          <Link className="hover:text-cyan-400 transition-colors" href="#">
            Privacy Policy
          </Link>
          <Link className="hover:text-cyan-400 transition-colors" href="#">
            Terms of Use
          </Link>
        </nav>
      </footer>
    </main>
  );
}
