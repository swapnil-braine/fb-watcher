'use client';

export default function TwoFactorWarning() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Two-Factor Authentication (2FA) Issue
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p className="mb-2">
              If your Facebook accounts have 2FA enabled, the automation will fail. Here are your options:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>Disable 2FA temporarily</strong> for testing accounts
              </li>
              <li>
                <strong>Use App-Specific Passwords</strong> if available
              </li>
              <li>
                <strong>Create new test accounts</strong> without 2FA enabled
              </li>
              <li>
                <strong>Use Facebook Test Users</strong> from Developer Dashboard (recommended)
              </li>
            </ul>
            <div className="mt-3 p-2 bg-yellow-100 rounded">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> Facebook Test Users from the Developer Dashboard don't require 2FA and are specifically designed for automation testing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
