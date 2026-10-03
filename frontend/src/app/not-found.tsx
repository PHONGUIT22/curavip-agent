import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-obsidian-900 text-stone-100">
      <div className="luxury-card p-8 max-w-md text-center">
        <span className="font-mono text-xs text-champagne-400 uppercase tracking-widest block mb-2">
          404 · Executive Protocol
        </span>
        <h2 className="font-serif text-2xl font-bold mb-2 text-stone-100">Dossier Not Found</h2>
        <p className="text-stone-400 text-sm mb-6 font-sans">
          The requested concierge record or executive route does not exist.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-xl gold-shimmer-btn text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-champagne-glow"
        >
          Return to Concierge Console
        </Link>
      </div>
    </div>
  );
}
