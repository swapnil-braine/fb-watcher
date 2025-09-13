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

interface AccountFormData {
  email: string;
  password: string;
  name: string;
}

export default function AccountManager() {
  const [accounts, setAccounts] = useState<FacebookAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<FacebookAccount | null>(null);
  const [formData, setFormData] = useState<AccountFormData>({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/accounts');
      if (response.data.success) {
        setAccounts(response.data.accounts);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Failed to fetch accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '' });
    setEditingAccount(null);
    setShowAddForm(false);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingAccount) {
        // Update existing account
        const response = await axios.put(`/api/accounts/${editingAccount.id}`, formData);
        if (response.data.success) {
          setSuccess('Account updated successfully');
          await fetchAccounts();
          resetForm();
        } else {
          setError(response.data.error);
        }
      } else {
        // Add new account
        const response = await axios.post('/api/accounts', formData);
        if (response.data.success) {
          setSuccess('Account added successfully');
          await fetchAccounts();
          resetForm();
        } else {
          setError(response.data.error);
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleEdit = (account: FacebookAccount) => {
    setEditingAccount(account);
    setFormData({
      email: account.email,
      password: account.password,
      name: account.name
    });
    setShowAddForm(true);
  };

  const handleDelete = async (accountId: number) => {
    if (!confirm('Are you sure you want to delete this account?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/accounts/${accountId}`);
      if (response.data.success) {
        setSuccess('Account deleted successfully');
        await fetchAccounts();
      } else {
        setError(response.data.error);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to delete account');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Account Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Account
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingAccount ? 'Edit Account' : 'Add New Account'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter account name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Facebook email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter Facebook password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {editingAccount ? 'Update Account' : 'Add Account'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Accounts List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No accounts found. Add your first account to get started.</p>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-500">{account.email}</p>
                    <p className="text-xs text-gray-400">
                      Created: {formatDate(account.createdAt)}
                      {account.lastUsed && (
                        <span> • Last used: {formatDate(account.lastUsed)}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(account)}
                  className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(account.id)}
                  className="text-red-600 hover:text-red-800 px-3 py-1 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Account Count */}
      {accounts.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Total accounts: {accounts.length}
        </div>
      )}
    </div>
  );
}
