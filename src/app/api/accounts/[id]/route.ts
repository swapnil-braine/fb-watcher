import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface FacebookAccount {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  lastUsed: string | null;
}

const accountsFilePath = path.join(process.cwd(), 'src', 'data', 'accounts.json');

// Helper function to read accounts from file
function readAccounts(): FacebookAccount[] {
  try {
    const data = fs.readFileSync(accountsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write accounts to file
function writeAccounts(accounts: FacebookAccount[]): void {
  try {
    fs.writeFileSync(accountsFilePath, JSON.stringify(accounts, null, 2));
  } catch (error) {
    throw new Error('Failed to save accounts');
  }
}

// PUT - Update account
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = parseInt(params.id);
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const accounts = readAccounts();
    const accountIndex = accounts.findIndex(acc => acc.id === accountId);

    if (accountIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    // Check if email is already used by another account
    const existingAccount = accounts.find(acc => acc.email === email && acc.id !== accountId);
    if (existingAccount) {
      return NextResponse.json(
        { success: false, error: 'Email is already used by another account' },
        { status: 400 }
      );
    }

    // Update account
    accounts[accountIndex] = {
      ...accounts[accountIndex],
      email,
      password,
      name: name || accounts[accountIndex].name
    };

    writeAccounts(accounts);

    return NextResponse.json({
      success: true,
      account: accounts[accountIndex],
      message: 'Account updated successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update account' },
      { status: 500 }
    );
  }
}

// DELETE - Delete account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = parseInt(params.id);
    const accounts = readAccounts();
    const accountIndex = accounts.findIndex(acc => acc.id === accountId);

    if (accountIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    const deletedAccount = accounts[accountIndex];
    accounts.splice(accountIndex, 1);
    writeAccounts(accounts);

    return NextResponse.json({
      success: true,
      account: deletedAccount,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
