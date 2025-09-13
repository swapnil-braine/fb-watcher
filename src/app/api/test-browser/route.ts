import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET() {
  let browser;
  
  try {
    console.log('Starting browser test...');
    
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1366,768'
      ],
      defaultViewport: null,
      timeout: 60000
    });
    
    const page = await browser.newPage();
    
    console.log('Browser launched, navigating to Google...');
    await page.goto('https://www.google.com', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    console.log('Page loaded, waiting 10 seconds...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'test-browser.png' });
    
    console.log('Test completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Browser test completed - check test-browser.png',
      screenshot: 'test-browser.png'
    });
    
  } catch (error) {
    console.error('Browser test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Browser test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      console.log('Closing browser after test...');
      try {
        await browser.close();
        console.log('Browser closed successfully');
      } catch (e) {
        console.log('Error closing browser:', e);
      }
    }
  }
}
