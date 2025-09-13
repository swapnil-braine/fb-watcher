import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Facebook Story/Reel Watcher
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Automatically watch Facebook stories and reels using multiple accounts. 
          Paste a URL and let our system handle the rest with batch processing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/about"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Learn More
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
  )
}
