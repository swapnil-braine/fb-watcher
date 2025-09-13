export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About FB Watcher</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-6">
            FB Watcher is a powerful analytics tool designed to help you monitor 
            and track Facebook activity. Get valuable insights into your social media performance.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-8">
            <li>Real-time Facebook activity monitoring</li>
            <li>Comprehensive analytics dashboard</li>
            <li>Engagement tracking and metrics</li>
            <li>Custom alerts and notifications</li>
            <li>Data export capabilities</li>
            <li>Secure and private data handling</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <p className="text-gray-600 mb-4">
            To start monitoring your Facebook activity, follow these simple steps:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-8">
            <code className="text-sm">
              1. Connect your Facebook account<br />
              2. Set up monitoring preferences<br />
              3. View your analytics dashboard
            </code>
          </div>
          
          <p className="text-gray-600">
            Start tracking your Facebook performance and get insights that matter 
            to your social media strategy.
          </p>
        </div>
      </div>
    </div>
  )
}
