import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 bg-[#070709] text-stone-100">
      <div className="border border-stone-800 bg-[#0B0B10] p-8 max-w-md text-center">
        <span className="font-mono text-xs text-champagne-400 uppercase tracking-widest block mb-2">
          404 / Protocol Notice
        </span>
        <h2 className="font-serif text-xl font-bold mb-2 text-stone-100">Record Not Found</h2>
        <p className="text-stone-400 text-xs mb-6 font-sans leading-relaxed">
          The requested concierge record or executive route does not exist.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2 border border-champagne-500 bg-champagne-500 text-[#070709] text-xs font-mono font-bold tracking-wider uppercase transition-colors hover:bg-champagne-400"
        >
          Return to Terminal
        </Link>
      </div>
    </div>
  );
}
