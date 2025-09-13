'use client';

export default function LoginTroubleshooting() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-red-800 mb-3">
            Facebook Login Troubleshooting
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-800 mb-2">Common Login Issues:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700 ml-4">
                <li><strong>Invalid Credentials:</strong> Double-check email and password</li>
                <li><strong>2FA Enabled:</strong> Disable two-factor authentication for test accounts</li>
                <li><strong>Account Locked:</strong> Account may be temporarily locked due to suspicious activity</li>
                <li><strong>Wrong Account Type:</strong> Use personal accounts, not business pages</li>
                <li><strong>Rate Limiting:</strong> Facebook may block too many login attempts</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-red-800 mb-2">Recommended Solutions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-red-700 ml-4">
                <li><strong>Use Facebook Test Users:</strong> Create test users in Facebook Developer Dashboard</li>
                <li><strong>Disable 2FA:</strong> Turn off two-factor authentication for test accounts</li>
                <li><strong>Use App Passwords:</strong> Generate app-specific passwords if available</li>
                <li><strong>Verify Account Status:</strong> Ensure accounts are not locked or restricted</li>
                <li><strong>Add Delays:</strong> Wait between login attempts to avoid rate limiting</li>
              </ol>
            </div>
            
            <div className="p-3 bg-red-100 rounded">
              <p className="text-xs text-red-800">
                <strong>Pro Tip:</strong> Facebook Test Users from the Developer Dashboard are specifically designed for automation and don't have the same restrictions as regular accounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
