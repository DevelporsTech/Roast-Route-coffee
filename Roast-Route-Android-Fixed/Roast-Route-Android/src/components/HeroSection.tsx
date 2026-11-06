import React, { Suspense, lazy } from 'react';
import { Navigation, MapPin } from 'lucide-react';
import { CoffeeCupArtwork } from './ThreeD/CoffeeCupArtwork';

const CoffeeCup3D = lazy(() =>
  import('./ThreeD/CoffeeCup3D').then((m) => ({ default: m.CoffeeCup3D }))
);

interface HeroSectionProps {
  onFindNearby: () => void;
  onExploreMap: () => void;
  openStoreCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onFindNearby,
  onExploreMap,
  openStoreCount,
}) => {
  return (
    <section className="relative w-full pt-4 pb-8 sm:py-12 overflow-hidden">
      {/* Background ambient lighting blobs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-roast-amber/10 dark:bg-roast-amber/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-roast-caramel/10 dark:bg-roast-caramel/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-10 xl:gap-14">
          {/* Left Column: Value Proposition & High-Speed CTAs */}
          <div className="min-w-0 space-y-5 text-center lg:text-left">
            {/* Live Indicator Pill */}
            <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3.5 py-1.5 rounded-full bg-white dark:bg-coffee-950/80 border border-coffee-200/80 dark:border-coffee-800 shadow-sm text-xs font-semibold text-coffee-800 dark:text-coffee-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{openStoreCount} Specialty Roasteries Open Now in USA</span>
              <span className="text-coffee-300 dark:text-coffee-700">|</span>
              <span className="text-roast-caramel dark:text-roast-amber font-bold">Real-Time GPS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-balance text-4xl sm:text-5xl lg:text-[clamp(2.55rem,4.1vw,3.75rem)] font-serif font-extrabold tracking-tight text-coffee-950 dark:text-cream-50 leading-[1.15]">
              Every Great Day Starts with the{' '}
              <span className="bg-gradient-to-r from-coffee-800 via-roast-caramel to-roast-amber bg-clip-text text-transparent dark:from-roast-crema dark:to-roast-amber">
                Perfect Pour.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-coffee-700 dark:text-coffee-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore North America’s top independent coffee roasters. Real-time distance tracking, customized caffeine intake pacing, and contactless 1-tap mobile ordering.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onFindNearby}
                aria-label="Find specialty coffee roasters near current location"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-coffee-900 dark:bg-roast-amber hover:opacity-95 text-white dark:text-coffee-950 font-bold text-sm shadow-xl shadow-coffee-950/15 active:scale-98 transition-all min-h-[52px]"
              >
                <Navigation className="w-4 h-4 fill-current" />
                <span>Find Roasters Near Me</span>
              </button>

              <button
                onClick={onExploreMap}
                aria-label="Open interactive roastery map"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/80 dark:bg-coffee-950/70 hover:bg-coffee-100 dark:hover:bg-coffee-900 border border-coffee-200/80 dark:border-coffee-800 text-coffee-900 dark:text-cream-100 font-bold text-sm shadow-sm active:scale-98 transition-all min-h-[52px]"
              >
                <MapPin className="w-4 h-4 text-roast-caramel" />
                <span>Interactive Map View</span>
              </button>
            </div>

            {/* Value Trust Markers */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-coffee-200/60 dark:border-coffee-800/60 text-left">
              <div>
                <span className="font-extrabold text-base text-coffee-950 dark:text-cream-50 block font-mono">
                  4.8★
                </span>
                <span className="text-[11px] text-coffee-600 dark:text-coffee-300 font-medium block">
                  Average shop rating
                </span>
              </div>
              <div>
                <span className="font-extrabold text-base text-coffee-950 dark:text-cream-50 block font-mono">
                  &lt; 0.5 mi
                </span>
                <span className="text-[11px] text-coffee-600 dark:text-coffee-300 font-medium block">
                  Typical walking radius
                </span>
              </div>
              <div>
                <span className="font-extrabold text-base text-coffee-950 dark:text-cream-50 block font-mono">
                  100%
                </span>
                <span className="text-[11px] text-coffee-600 dark:text-coffee-300 font-medium block">
                  Ethical direct trade
                </span>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full min-w-0 max-w-[34rem]">
            <Suspense fallback={
              <div className="overflow-hidden rounded-3xl border border-coffee-200/80 bg-white/70 shadow-xl dark:border-coffee-800 dark:bg-coffee-950/60" role="status">
                <div className="min-h-[66px] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-roast-caramel dark:text-roast-amber">Coffee preview</p>
                  <p className="mt-1 text-sm font-semibold text-coffee-950 dark:text-cream-100">Single-Origin Oat Latte</p>
                </div>
                <div className="relative aspect-[4/3] border-y border-coffee-200/70 bg-coffee-100/45 dark:border-coffee-800 dark:bg-coffee-900/40 sm:aspect-[3/2]">
                  <CoffeeCupArtwork />
                </div>
                <p className="flex min-h-[98px] items-center justify-center px-4 text-xs text-coffee-600 dark:text-coffee-300">
                  Loading 3D preview…
                </p>
              </div>
            }>
              <CoffeeCup3D />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};
