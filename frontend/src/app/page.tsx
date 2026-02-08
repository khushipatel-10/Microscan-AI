import Link from "next/link";
import { ArrowRight, Waves, Microscope, Map, ShieldAlert } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-blue-900 to-slate-900 text-white overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-lg bg-blue-500/20 px-3 py-1 text-sm text-blue-200 mb-2 border border-blue-500/30 w-fit">
                MicroVisual Risk Screening
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Satellite Science, Applied to Your Community.
              </h1>
              <p className="max-w-[600px] text-zinc-200 md:text-xl">
                MicroScan AI democratizes optical spectroscopy principles to screen for microplastic risks in local waterways. Inspired by ocean research.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <Link
                  href="/scan"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-blue-900 shadow transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50"
                >
                  Start Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/map"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 bg-white/10 px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50"
                >
                  View Community Map
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:mr-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
              {/* Placeholder for "Satellite to Phone" visual - using a gradient for now */}
              <div className="w-full aspect-video bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                <div className="text-center p-8 bg-black/40 backdrop-blur-sm rounded-xl m-8 border border-white/20">
                  <p className="font-mono text-sm text-blue-200 mb-2">OPTICAL ANOMALY DETECTED</p>
                  <div className="text-4xl font-bold text-white mb-2">78/100</div>
                  <p className="text-xs text-zinc-300">High Turbidity &bull; Color variance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute top-0 right-0 -z-10 bg-blue-500/10 w-[500px] h-[500px] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 bg-indigo-500/10 w-[500px] h-[500px] rounded-full blur-3xl"></div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-blue-900">
                From Orbit to Local Creek
              </h2>
              <p className="max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Microplastics change how light interacts with water. We use computer vision to translate these optical signatures into actionable risk data.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 pt-12">
            <div className="grid gap-1">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <Microscope className="h-5 w-5" />
                Scientific Foundation
              </div>
              <p className="text-sm text-zinc-500">
                Explicitly inspired by <strong>Dr. Karl Kaiser&apos;s</strong> research at Texas A&M Galveston on optical properties and satellite spectroscopy.
              </p>
            </div>
            <div className="grid gap-1">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <Waves className="h-5 w-5" />
                Optical Proxy
              </div>
              <p className="text-sm text-zinc-500">
                We analyze turbidity, surface anomalies, and spectral reflectance as <strong>risk indicators</strong>, not direct particle counters.
              </p>
            </div>
            <div className="grid gap-1">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <Map className="h-5 w-5" />
                Community Scale
              </div>
              <p className="text-sm text-zinc-500">
                Empowering citizen scientists to map potential hotspots, guiding professional lab sampling where it matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ethics/Disclaimer Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-orange-100 p-3 rounded-full">
                <ShieldAlert className="h-8 w-8 text-orange-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-orange-900">Ethical & Scientific Boundaries</h3>
                <p className="text-orange-800 leading-relaxed">
                  MicroScan AI is a <strong>screening tool</strong>. We do not claim to replace laboratory filtration and spectroscopy (FTIR/Raman).
                  Our goal is to identify waterways with <em>high optical probability</em> of contamination to prioritize resource-intensive testing.
                  We rely on proxy signals (sediment, foam, color) that correlate with microplastic accumulation, as established in oceanographic literature.
                </p>
                <div className="pt-2 font-mono text-sm text-orange-700 bg-orange-100/50 p-4 rounded border border-orange-200 inline-block">
                  &quot;This tool does not replace laboratory testing. It highlights potential microplastic risk areas that may require further investigation.&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t mt-auto">
        <p className="text-xs text-zinc-500">
          © 2026 MicroScan AI. Built for TIDALHACK:26.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Scientific Git
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </main>
  );
}
