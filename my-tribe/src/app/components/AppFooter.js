export default function AppFooter() {
  return (
    <footer
      className="w-full py-3 px-4 sm:py-4 sm:px-6 border-t text-center text-xs sm:text-sm fixed bottom-0 left-0 z-40"
      style={{
        background: 'var(--header-bg)',
        borderTopColor: 'var(--color-secondary)',
        color: 'var(--header-text)',
      }}
    >
      &copy; {new Date().getFullYear()} HomeTribe. All rights reserved.
    </footer>
  );
}
