'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface FacebookAccount {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  lastUsed: string | null;
}

interface WatchResult {
  accountId: number;
  email: string;
  success: boolean;
  message: string;
  timestamp: string;
}

export default function FacebookWatcher() {
  const [url, setUrl] = useState('');
  const [accounts, setAccounts] = useState<FacebookAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<FacebookAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<WatchResult[]>([]);
  const [isWatching, setIsWatching] = useState(false);

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/api/accounts');
      if (response.data.success) {
        setAccounts(response.data.accounts);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleAccountToggle = (account: FacebookAccount) => {
    setSelectedAccounts(prev => {
      const isSelected = prev.some(acc => acc.id === account.id);
      if (isSelected) {
        return prev.filter(acc => acc.id !== account.id);
      } else {
        return [...prev, account];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === accounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts([...accounts]);
    }
  };

  const handleWatch = async () => {
    if (!url || selectedAccounts.length === 0) {
      alert('Please enter a URL and select at least one account');
      return;
    }

    setIsWatching(true);
    setResults([]);

    try {
      const response = await axios.post('/api/watch', {
        url,
        accounts: selectedAccounts
      });

      if (response.data.success) {
        setResults(response.data.results);
      } else {
        alert('Error: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error watching:', error);
      alert('Error occurred while processing the request');
    } finally {
      setIsWatching(false);
    }
  };

  const getStatusColor = (success: boolean, message: string) => {
    if (success) return 'text-green-600';
    if (message.includes('2FA') || message.includes('Two-Factor')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (success: boolean, message: string) => {
    if (success) return '✅';
    if (message.includes('2FA') || message.includes('Two-Factor')) return '⚠️';
    return '❌';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Facebook Story/Reel Watcher</h2>
        
        {/* URL Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facebook Story/Reel URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.facebook.com/stories/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Account Selection */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Select Accounts ({selectedAccounts.length} selected)</h3>
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {selectedAccounts.length === accounts.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
            {accounts.map((account) => (
              <label
                key={account.id}
                className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedAccounts.some(acc => acc.id === account.id)}
                  onChange={() => handleAccountToggle(account)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {account.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {account.email} • ID: {account.id}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created: {new Date(account.createdAt).toLocaleDateString()}
                    {account.lastUsed && (
                      <span> • Last used: {new Date(account.lastUsed).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Watch Button */}
        <button
          onClick={handleWatch}
          disabled={isWatching || !url || selectedAccounts.length === 0}
          className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isWatching ? 'Watching...' : `Start Watching (${selectedAccounts.length} accounts)`}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Watch Results</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getStatusIcon(result.success, result.message)}</span>
                  <div>
                    <p className="font-medium">{result.email}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${getStatusColor(result.success, result.message)}`}>
                    {result.success ? 'Success' : 
                     result.message.includes('2FA') || result.message.includes('Two-Factor') ? '2FA Required' : 'Failed'}
                  </p>
                  <p className="text-sm text-gray-500">{result.message}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between text-sm">
              <span>Total Processed: {results.length}</span>
              <span className="text-green-600">
                Successful: {results.filter(r => r.success).length}
              </span>
              <span className="text-red-600">
                Failed: {results.filter(r => !r.success).length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
