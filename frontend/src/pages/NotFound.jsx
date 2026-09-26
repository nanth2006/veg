import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-4 animate-bounce">🥦</div>
      <h1 className="text-4xl font-extrabold text-slate-900 font-display mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-700 mb-2">Page Not Found</h2>
      <p className="text-slate-500 text-sm max-w-md mb-8">
        We couldn't harvest the page you were looking for. It might have been moved or removed.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-gradient-to-r from-brand-600 to-emerald-600 text-white font-extrabold rounded-xl shadow-md hover:scale-105 transition-transform text-sm"
      >
        Return to Fresh Store
      </Link>
    </div>
  );
}
