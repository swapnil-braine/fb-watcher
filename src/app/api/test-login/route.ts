import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let browser;
    
    try {
      browser = await puppeteer.launch({
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--window-size=1366,768'
        ],
        defaultViewport: null,
        timeout: 60000
      });
      
      const page = await browser.newPage();
      
      // Set user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      console.log('Navigating to Facebook login...');
      await page.goto('https://www.facebook.com/login', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take screenshot
      await page.screenshot({ path: 'test-login-page.png' });
      console.log('Screenshot saved as test-login-page.png');
      
      // Try to find email field
      const emailField = await page.$('#email');
      if (!emailField) {
        return NextResponse.json({
          success: false,
          error: 'Email field not found on login page',
          screenshot: 'test-login-page.png'
        });
      }
      
      // Fill email
      await emailField.click({ clickCount: 3 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await emailField.type(email, { delay: 150 });
      
      // Try to find password field
      const passwordField = await page.$('#pass');
      if (!passwordField) {
        return NextResponse.json({
          success: false,
          error: 'Password field not found on login page',
          screenshot: 'test-login-page.png'
        });
      }
      
      // Fill password
      await passwordField.click({ clickCount: 3 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await passwordField.type(password, { delay: 150 });
      
      // Take screenshot before login
      await page.screenshot({ path: 'test-before-login.png' });
      console.log('Screenshot saved as test-before-login.png');
      
      // Click login button
      const loginButton = await page.$('#loginbutton');
      if (!loginButton) {
        return NextResponse.json({
          success: false,
          error: 'Login button not found',
          screenshots: ['test-login-page.png', 'test-before-login.png']
        });
      }
      
      await loginButton.click();
      console.log('Login button clicked, waiting for response...');
      
      // Wait for response
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Take screenshot after login
      await page.screenshot({ path: 'test-after-login.png' });
      console.log('Screenshot saved as test-after-login.png');
      
      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);
      
      // Check for success indicators
      const successSelectors = [
        '[data-testid="search"]',
        '[aria-label="Facebook"]',
        '[data-testid="left_nav_menu"]',
        'a[href="/me"]'
      ];
      
      let loginSuccessful = false;
      for (const selector of successSelectors) {
        if (await page.$(selector)) {
          loginSuccessful = true;
          break;
        }
      }
      
      // Also check URL
      if (!currentUrl.includes('login') && !currentUrl.includes('checkpoint')) {
        loginSuccessful = true;
      }
      
      return NextResponse.json({
        success: loginSuccessful,
        message: loginSuccessful ? 'Login successful' : 'Login failed',
        currentUrl,
        screenshots: ['test-login-page.png', 'test-before-login.png', 'test-after-login.png']
      });
      
    } finally {
      if (browser) {
        console.log('Closing browser...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await browser.close();
      }
    }
    
  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Test login failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  }
}
