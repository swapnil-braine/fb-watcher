export default function Features() {
  const features = [
    {
      title: 'Real-time Monitoring',
      description: 'Track Facebook activity in real-time with live updates and notifications.',
      icon: '📊',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics with detailed insights and performance metrics.',
      icon: '📈',
    },
    {
      title: 'Engagement Tracking',
      description: 'Monitor likes, comments, shares, and other engagement metrics.',
      icon: '💬',
    },
    {
      title: 'Custom Alerts',
      description: 'Set up custom alerts for specific activities or threshold breaches.',
      icon: '🔔',
    },
    {
      title: 'Data Export',
      description: 'Export your data in various formats for further analysis.',
      icon: '📤',
    },
    {
      title: 'Secure & Private',
      description: 'Your data is secure with enterprise-grade privacy protection.',
      icon: '🔒',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose FB Watcher?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to monitor and analyze Facebook activity effectively
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
