import ThemeToggle from "./ThemeToggle";

export default function AppHeader() {
  return (
    <header
      className="w-full py-3 px-4 sm:py-4 sm:px-6 border-b flex items-center justify-between fixed top-0 left-0 z-40"
      style={{
        background: 'var(--header-bg)',
        borderBottomColor: 'var(--color-secondary)',
      }}
    >
      <div className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--header-text)' }}>HomeTribe</div>
      <div className="flex items-center gap-3 sm:gap-6">
        <nav className="flex items-center gap-3 sm:gap-6">
          <a href="/" className="text-sm sm:text-base hover:underline" style={{ color: 'var(--header-text)' }}>Home</a>
          <a href="/signup" className="text-sm sm:text-base hover:underline" style={{ color: 'var(--header-text)' }}>Sign Up</a>
        </nav>
        <div className="ml-2 sm:ml-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
