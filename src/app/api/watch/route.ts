import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
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

// Helper function to update lastUsed timestamp
function updateAccountLastUsed(accountId: number): void {
  const accounts = readAccounts();
  const accountIndex = accounts.findIndex(acc => acc.id === accountId);
  if (accountIndex !== -1) {
    accounts[accountIndex].lastUsed = new Date().toISOString();
    writeAccounts(accounts);
  }
}

interface WatchRequest {
  url: string;
  accounts: FacebookAccount[];
}

export async function POST(request: NextRequest) {
  try {
    const { url, accounts }: WatchRequest = await request.json();

    if (!url || !accounts || accounts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'URL and accounts are required' },
        { status: 400 }
      );
    }

    // Validate Facebook URL
    if (!url.includes('facebook.com') && !url.includes('fb.com')) {
      return NextResponse.json(
        { success: false, error: 'Invalid Facebook URL' },
        { status: 400 }
      );
    }

    const results = [];
    const batchSize = 5;
    
    // Process accounts in batches of 5
    for (let i = 0; i < accounts.length; i += batchSize) {
      const batch = accounts.slice(i, i + batchSize);
      const batchResults = await processBatch(batch, url);
      results.push(...batchResults);
    }

    return NextResponse.json({
      success: true,
      results,
      totalProcessed: results.length
    });

  } catch (error) {
    console.error('Error processing watch request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process watch request' },
      { status: 500 }
    );
  }
}

async function processBatch(accounts: FacebookAccount[], url: string) {
  const results = [];
  
  for (const account of accounts) {
    try {
      const result = await watchWithAccount(account, url);
      
      // Update lastUsed timestamp for successful attempts
      if (result.success) {
        updateAccountLastUsed(account.id);
      }
      
      results.push({
        accountId: account.id,
        email: account.email,
        success: result.success,
        message: result.message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.push({
        accountId: account.id,
        email: account.email,
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return results;
}

async function watchWithAccount(account: FacebookAccount, url: string) {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: false, // Set to true for production
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate to Facebook login
    await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle2' });
    
    // Fill login form
    await page.type('#email', account.email);
    await page.type('#pass', account.password);
    
    // Click login button
    await page.click('#loginbutton');
    
    // Wait for login to complete or 2FA screen
    await page.waitForTimeout(3000);
    
    // Check for 2FA screen
    const twoFactorScreen = await page.$('input[name="approvals_code"]') !== null;
    if (twoFactorScreen) {
      return {
        success: false,
        message: '2FA required - please disable 2FA for this account or use app-specific password'
      };
    }
    
    // Check for login error messages
    const loginError = await page.$('[data-testid="error"]') !== null;
    if (loginError) {
      const errorText = await page.$eval('[data-testid="error"]', el => el.textContent) || 'Unknown login error';
      return {
        success: false,
        message: `Login failed: ${errorText}`
      };
    }
    
    // Check if login was successful by looking for Facebook main elements
    const isLoggedIn = await page.$('[data-testid="search"]') !== null || 
                      await page.$('[aria-label="Facebook"]') !== null ||
                      await page.$('[data-testid="left_nav_menu"]') !== null;
    
    if (!isLoggedIn) {
      // Check if we're still on login page
      const stillOnLogin = await page.url().includes('login') || await page.url().includes('checkpoint');
      if (stillOnLogin) {
        return {
          success: false,
          message: 'Login failed - invalid credentials or account verification required'
        };
      }
    }
    
    // Navigate to the target URL
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Try to interact with the video/story
    try {
      // Look for play button or story content
      const playButton = await page.$('[aria-label*="Play"]');
      if (playButton) {
        await playButton.click();
        await page.waitForTimeout(2000);
      }
      
      // Wait a bit to simulate viewing
      await page.waitForTimeout(5000);
      
      return {
        success: true,
        message: 'Successfully viewed content'
      };
    } catch (interactionError) {
      return {
        success: true,
        message: 'Content loaded but interaction failed'
      };
    }
    
  } catch (error) {
    return {
      success: false,
      message: `Browser error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
