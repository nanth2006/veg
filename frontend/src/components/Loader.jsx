export default function Loader({ label = "Harvesting fresh items for you..." }) {
  return (
    <div className="min-h-[55vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center">
        {/* Animated concentric rings */}
        <div className="w-16 h-16 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
        <div className="absolute text-2xl animate-bounce">🥦</div>
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-600 tracking-wide font-display animate-pulse">
        {label}
      </p>
    </div>
  );
}
