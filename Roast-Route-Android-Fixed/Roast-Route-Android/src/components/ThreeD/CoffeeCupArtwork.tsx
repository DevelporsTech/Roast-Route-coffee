import { useId } from 'react';

export const latteCrema = 'radial-gradient(circle, #A66832 0%, #693714 50%, #220D04 100%)';

export function CoffeeCupArtwork({ crema = latteCrema }: { crema?: string }) {
  const beanId = useId();

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-4" aria-hidden="true">
      <div className="flex scale-90 flex-col items-center sm:scale-100">
        <div className="mb-2 flex items-end gap-4 opacity-75">
          <span className="h-6 w-1.5 rounded-full bg-gradient-to-t from-roast-amber/40 to-transparent motion-safe:animate-steam" />
          <span className="h-8 w-1.5 rounded-full bg-gradient-to-t from-roast-amber/50 to-transparent motion-safe:animate-steam" style={{ animationDelay: '.8s' }} />
          <span className="h-6 w-1.5 rounded-full bg-gradient-to-t from-roast-amber/40 to-transparent motion-safe:animate-steam" style={{ animationDelay: '1.4s' }} />
        </div>

        <div className="relative">
          <div className="mx-auto -mb-6 h-14 w-52 rounded-[100%] border-2 border-roast-amber/30 bg-gradient-to-b from-[#2E1C14] to-[#120B08] shadow-2xl" />
          <div className="relative mx-auto flex h-28 w-40 flex-col items-center justify-start overflow-hidden rounded-b-[44px] rounded-t-[10px] border-2 border-roast-amber/40 bg-gradient-to-b from-[#25150E] via-[#1E110A] to-[#140A06] p-1.5 shadow-xl">
            <div className="relative flex h-14 w-36 items-center justify-center rounded-[100%] shadow-inner transition-all duration-500" style={{ background: crema }}>
              <div className="flex h-9 w-12 items-center justify-center drop-shadow-md">
                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white/90 drop-shadow">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-x-4 top-2 h-16 rounded-full bg-gradient-to-b from-white/10 to-transparent blur-[1px]" />
          </div>
          <div className="absolute right-2 top-10 h-14 w-8 rounded-r-2xl border-4 border-l-0 border-[#25150E] shadow-md" />

          <svg viewBox="0 0 248 44" className="absolute -bottom-5 left-1/2 h-11 w-[248px] -translate-x-1/2">
            <defs>
              <radialGradient id={beanId + '-glaze'} cx=".36" cy=".26" r=".76">
                <stop stopColor="#aa7152" />
                <stop offset=".55" stopColor="#774631" />
                <stop offset="1" stopColor="#3b2016" />
              </radialGradient>
              <radialGradient id={beanId + '-shadow'}>
                <stop stopColor="#332016" stopOpacity=".36" />
                <stop offset="1" stopColor="#332016" stopOpacity="0" />
              </radialGradient>
              <g id={beanId}>
                <ellipse cy="3" rx="18" ry="9" fill={'url(#' + beanId + '-shadow)'} />
                <path d="M-14-2C-13-8-5-11 2-10C9-10 14-7 15-2C17 4 10 8 3 9C-5 10-15 6-14-2Z" fill={'url(#' + beanId + '-glaze)'} />
                <path d="M-11-2C-7 1-4 3 0 0C5-4 8-4 12-3" fill="none" stroke="#351c12" strokeWidth="2" strokeLinecap="round" />
              </g>
            </defs>
            <use href={'#' + beanId} transform="translate(34 18) rotate(-24) scale(.53)" />
            <use href={'#' + beanId} transform="translate(51 30) rotate(29) scale(.45)" />
            <use href={'#' + beanId} transform="translate(201 28) rotate(26) scale(.61)" />
            <use href={'#' + beanId} transform="translate(218 16) rotate(-36) scale(.49)" />
            <use href={'#' + beanId} transform="translate(225 33) rotate(9) scale(.45)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
