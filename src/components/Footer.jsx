export default function Footer() {
  return (
    <footer
      className="py-6 px-4 border-t mt-auto"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'var(--accent-purple)' }}
          >
            <span className="text-white font-bold text-xs">AW</span>
          </div>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            WeatherApp
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          &copy; {new Date().getFullYear()} WeatherApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}