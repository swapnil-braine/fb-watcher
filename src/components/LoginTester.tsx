'use client';

import { useState } from 'react';
import axios from 'axios';

export default function LoginTester() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    setIsTesting(true);
    setResult(null);

    try {
      const response = await axios.post('/api/test-login', {
        email,
        password
      });

      setResult(response.data);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.response?.data?.error || 'Test failed'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">
        🔧 Login Tester (Debug Tool)
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Facebook email to test"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Facebook password to test"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        
        <button
          onClick={handleTest}
          disabled={isTesting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isTesting ? 'Testing Login...' : 'Test Login'}
        </button>
        
        {result && (
          <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h4 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ Test Result' : '❌ Test Result'}
            </h4>
            <p className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.message || result.error}
            </p>
            {result.currentUrl && (
              <p className="text-xs text-gray-600 mt-2">
                <strong>URL:</strong> {result.currentUrl}
              </p>
            )}
            {result.screenshots && (
              <div className="mt-2">
                <p className="text-xs text-gray-600">
                  <strong>Screenshots saved:</strong> {result.screenshots.join(', ')}
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="text-xs text-gray-600">
          <p><strong>Note:</strong> This tool will:</p>
          <ul className="list-disc list-inside ml-4 mt-1">
            <li>Open a browser window (visible)</li>
            <li>Take screenshots for debugging</li>
            <li>Test the login process step by step</li>
            <li>Show detailed error messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
