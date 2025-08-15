
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
          Welcome to HomeTribe
        </h1>
        <p className="text-sm sm:text-lg mb-6 sm:mb-8 px-2" style={{ color: 'var(--foreground)' }}>
          Your consolidated social media platform - connecting Reddit, Instagram, Facebook, Threads, and more in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <a 
            href="/signup"
            className="px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors text-center"
            style={{ 
              backgroundColor: 'var(--color-accent)', 
              color: 'white',
              textDecoration: 'none'
            }}
          >
            Get Started
          </a>
          <button 
            className="px-4 sm:px-6 py-3 rounded-lg font-semibold border transition-colors"
            style={{ 
              borderColor: 'var(--foreground)', 
              color: 'var(--foreground)',
              backgroundColor: 'transparent'
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}