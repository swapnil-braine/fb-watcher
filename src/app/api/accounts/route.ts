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

// GET - Fetch all accounts
export async function GET() {
  try {
    const accounts = readAccounts();
    return NextResponse.json({
      success: true,
      accounts,
      total: accounts.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

// POST - Add new account
export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const accounts = readAccounts();
    
    // Check if account already exists
    const existingAccount = accounts.find(acc => acc.email === email);
    if (existingAccount) {
      return NextResponse.json(
        { success: false, error: 'Account with this email already exists' },
        { status: 400 }
      );
    }

    // Generate new ID
    const newId = accounts.length > 0 ? Math.max(...accounts.map(acc => acc.id)) + 1 : 1;

    const newAccount: FacebookAccount = {
      id: newId,
      email,
      password,
      name: name || `Account ${newId}`,
      createdAt: new Date().toISOString(),
      lastUsed: null
    };

    accounts.push(newAccount);
    writeAccounts(accounts);

    return NextResponse.json({
      success: true,
      account: newAccount,
      message: 'Account added successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add account' },
      { status: 500 }
    );
  }
}
