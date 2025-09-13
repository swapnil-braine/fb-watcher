'use client';

export default function SetupGuide() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-green-800 mb-4">
        🚀 Quick Setup Guide
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            1
          </div>
          <div>
            <h4 className="font-medium text-green-800">Create Facebook App</h4>
            <p className="text-sm text-green-700">
              Go to <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="underline">Facebook Developer Dashboard</a> and create a new app
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            2
          </div>
          <div>
            <h4 className="font-medium text-green-800">Create Test Users</h4>
            <p className="text-sm text-green-700">
              Navigate to <strong>Roles → Test Users</strong> in your app dashboard and create 5-10 test users
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            3
          </div>
          <div>
            <h4 className="font-medium text-green-800">Get Credentials</h4>
            <p className="text-sm text-green-700">
              Copy the email/password credentials for each test user and update them in the code
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
            4
          </div>
          <div>
            <h4 className="font-medium text-green-800">Start Watching</h4>
            <p className="text-sm text-green-700">
              Paste a Facebook story/reel URL and select test accounts to start automated watching
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800 text-sm">
          <strong>Note:</strong> Test users can only view content from other test users or app administrators. 
          They cannot view public content from regular Facebook users.
        </p>
      </div>
    </div>
  );
}
