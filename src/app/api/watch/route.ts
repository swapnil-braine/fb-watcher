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
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1} with ${batch.length} accounts`);
      const batchResults = await processBatch(batch, url);
      results.push(...batchResults);
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < accounts.length) {
        console.log('Waiting 10 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
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
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=VizDisplayCompositor',
        '--disable-web-security',
        '--disable-features=site-per-process',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-gpu',
        '--window-size=1366,768'
      ],
      defaultViewport: null,
      ignoreDefaultArgs: ['--disable-extensions'],
      timeout: 60000
    });
    
    const page = await browser.newPage();
    
    // Enhanced stealth settings
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });
    
    // Set realistic user agent and viewport
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });
    
    // Set additional headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    
    // Navigate to Facebook login with retry logic
    let loginSuccess = false;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!loginSuccess && attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Login attempt ${attempts} for ${account.email}`);
        
        // Navigate to Facebook login
        console.log(`Navigating to Facebook login for ${account.email}`);
        await page.goto('https://www.facebook.com/login', { 
          waitUntil: 'domcontentloaded',
          timeout: 30000 
        });
        
        // Wait for page to fully load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Take screenshot for debugging
        try {
          await page.screenshot({ path: `debug-login-${account.id}.png` });
          console.log(`Screenshot saved: debug-login-${account.id}.png`);
        } catch (screenshotError) {
          console.log('Screenshot failed:', screenshotError);
        }
        
        // Try multiple selectors for email field
        const emailSelectors = ['#email', 'input[name="email"]', 'input[type="email"]', '[data-testid="royal_email"]'];
        let emailField = null;
        for (const selector of emailSelectors) {
          try {
            emailField = await page.$(selector);
            if (emailField) {
              console.log(`Found email field with selector: ${selector}`);
              break;
            }
          } catch (e) {
            console.log(`Email selector ${selector} failed:`, e);
          }
        }
        
        if (!emailField) {
          console.log('Email field not found, taking screenshot...');
          await page.screenshot({ path: `debug-no-email-${account.id}.png` });
          throw new Error('Email field not found');
        }
        
        // Clear and type email
        console.log(`Filling email field for ${account.email}`);
        try {
          await emailField.click({ clickCount: 3 });
          await new Promise(resolve => setTimeout(resolve, 1000));
          await emailField.type(account.email, { delay: 150 });
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Email filled successfully');
        } catch (e) {
          console.log('Error filling email:', e);
          throw e;
        }
        
        // Try multiple selectors for password field
        const passwordSelectors = ['#pass', 'input[name="pass"]', 'input[type="password"]', '[data-testid="royal_pass"]'];
        let passwordField = null;
        for (const selector of passwordSelectors) {
          try {
            passwordField = await page.$(selector);
            if (passwordField) {
              console.log(`Found password field with selector: ${selector}`);
              break;
            }
          } catch (e) {
            console.log(`Password selector ${selector} failed:`, e);
          }
        }
        
        if (!passwordField) {
          console.log('Password field not found, taking screenshot...');
          await page.screenshot({ path: `debug-no-password-${account.id}.png` });
          throw new Error('Password field not found');
        }
        
        // Clear and type password
        console.log(`Filling password field for ${account.email}`);
        try {
          await passwordField.click({ clickCount: 3 });
          await new Promise(resolve => setTimeout(resolve, 1000));
          await passwordField.type(account.password, { delay: 150 });
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Password filled successfully');
        } catch (e) {
          console.log('Error filling password:', e);
          throw e;
        }
        
        // Try multiple selectors for login button
        const loginButtonSelectors = ['#loginbutton', 'button[name="login"]', '[data-testid="royal_login_button"]', 'button[type="submit"]'];
        let loginButton = null;
        for (const selector of loginButtonSelectors) {
          try {
            loginButton = await page.$(selector);
            if (loginButton) {
              console.log(`Found login button with selector: ${selector}`);
              break;
            }
          } catch (e) {
            console.log(`Login button selector ${selector} failed:`, e);
          }
        }
        
        if (!loginButton) {
          console.log('Login button not found, taking screenshot...');
          await page.screenshot({ path: `debug-no-login-button-${account.id}.png` });
          throw new Error('Login button not found');
        }
        
        // Click login button
        console.log(`Clicking login button for ${account.email}`);
        try {
          await loginButton.click();
          console.log('Login button clicked successfully');
        } catch (e) {
          console.log('Error clicking login button:', e);
          throw e;
        }
        
        // Wait for navigation or response
        console.log(`Waiting for login response for ${account.email}`);
        await new Promise(resolve => setTimeout(resolve, 8000));
        
        // Take screenshot after login attempt
        try {
          await page.screenshot({ path: `debug-after-login-${account.id}.png` });
          console.log(`Screenshot saved: debug-after-login-${account.id}.png`);
        } catch (screenshotError) {
          console.log('Screenshot after login failed:', screenshotError);
        }
        
        // Check for various Facebook responses
        const currentUrl = page.url();
        console.log(`Current URL after login attempt: ${currentUrl}`);
        
        // Check for 2FA screen
        const twoFactorSelectors = [
          'input[name="approvals_code"]',
          'input[name="checkpoint_data"]',
          '[data-testid="checkpoint_challenge"]',
          'input[placeholder*="code"]'
        ];
        
        let twoFactorDetected = false;
        for (const selector of twoFactorSelectors) {
          try {
            if (await page.$(selector)) {
              twoFactorDetected = true;
              console.log(`2FA detected with selector: ${selector}`);
              break;
            }
          } catch (e) {
            console.log(`2FA selector ${selector} failed:`, e);
          }
        }
        
        if (twoFactorDetected) {
          console.log('2FA detected, returning error');
          return {
            success: false,
            message: '2FA required - please disable 2FA for this account or use app-specific password'
          };
        }
        
        // Check for login error messages
        const errorSelectors = [
          '[data-testid="error"]',
          '.error',
          '[role="alert"]',
          '.login_error',
          '#error'
        ];
        
        let errorDetected = false;
        let errorMessage = '';
        for (const selector of errorSelectors) {
          try {
            const errorElement = await page.$(selector);
            if (errorElement) {
              errorMessage = await page.evaluate(el => el.textContent, errorElement) || 'Login error detected';
              errorDetected = true;
              console.log(`Error detected with selector ${selector}: ${errorMessage}`);
              break;
            }
          } catch (e) {
            console.log(`Error selector ${selector} failed:`, e);
          }
        }
        
        if (errorDetected) {
          console.log('Login error detected, returning error');
          return {
            success: false,
            message: `Login failed: ${errorMessage}`
          };
        }
        
        // Check if login was successful
        const successSelectors = [
          '[data-testid="search"]',
          '[aria-label="Facebook"]',
          '[data-testid="left_nav_menu"]',
          '[data-testid="royal_nav"]',
          'a[href="/me"]',
          '[data-testid="jewel"]'
        ];
        
        let loginSuccessful = false;
        for (const selector of successSelectors) {
          try {
            if (await page.$(selector)) {
              loginSuccessful = true;
              console.log(`Login success detected with selector: ${selector}`);
              break;
            }
          } catch (e) {
            console.log(`Success selector ${selector} failed:`, e);
          }
        }
        
        // Also check if we're no longer on login page
        if (!currentUrl.includes('login') && !currentUrl.includes('checkpoint')) {
          loginSuccessful = true;
          console.log('Login success detected via URL change');
        }
        
        if (loginSuccessful) {
          loginSuccess = true;
          console.log(`Login successful for ${account.email}`);
        } else {
          console.log(`Login failed for ${account.email}, attempt ${attempts}`);
          console.log(`Current URL: ${currentUrl}`);
          
          // Check if we're on a different page that might indicate success
          if (currentUrl.includes('facebook.com') && !currentUrl.includes('login')) {
            console.log(`Detected successful login via URL change for ${account.email}`);
            loginSuccess = true;
          } else if (attempts < maxAttempts) {
            console.log(`Retrying login for ${account.email} in 3 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
        
      } catch (attemptError) {
        console.log(`Login attempt ${attempts} failed: ${attemptError}`);
        console.log(`Error details:`, attemptError);
        if (attempts < maxAttempts) {
          console.log(`Retrying in 3 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    }
    
    if (!loginSuccess) {
      return {
        success: false,
        message: 'Login failed after multiple attempts - invalid credentials or account verification required'
      };
    }
    
    // Navigate to the target URL
    try {
      console.log(`Navigating to target URL: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Take screenshot of target page
      await page.screenshot({ path: `debug-target-page-${account.id}.png` });
      
      // Try to interact with the video/story
      const playButtonSelectors = [
        '[aria-label*="Play"]',
        '[aria-label*="play"]',
        'button[aria-label*="Play"]',
        '.playButton',
        '[data-testid="play_button"]',
        'button[aria-label*="Watch"]',
        '[data-testid="video_play_button"]'
      ];
      
      let interactionSuccess = false;
      for (const selector of playButtonSelectors) {
        const playButton = await page.$(selector);
        if (playButton) {
          console.log(`Found play button with selector: ${selector}`);
          await playButton.click();
          await new Promise(resolve => setTimeout(resolve, 3000));
          interactionSuccess = true;
          break;
        }
      }
      
      // Wait a bit to simulate viewing
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      return {
        success: true,
        message: interactionSuccess ? 'Successfully viewed content' : 'Content loaded but no play button found'
      };
      
    } catch (navigationError) {
      console.log(`Navigation error: ${navigationError}`);
      return {
        success: true,
        message: 'Content loaded but interaction failed'
      };
    }
    
  } catch (error) {
    console.error(`Browser error for ${account.email}:`, error);
    return {
      success: false,
      message: `Browser error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  } finally {
    if (browser) {
      console.log(`Closing browser for ${account.email}`);
      // Add longer delay before closing to ensure all operations complete
      try {
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (e) {
        console.log('Page already closed or error waiting');
      }
      try {
        await browser.close();
      } catch (e) {
        console.log('Browser already closed or error closing');
      }
    }
  }
}
