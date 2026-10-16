const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Set mock localStorage for logged in user so HUD has live values
  await page.goto('http://localhost:5173/realm', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('userId', '1');
    localStorage.setItem('authToken', 'mock-token');
  });
  await page.goto('http://localhost:5173/realm', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: 'C:/Users/HP/Desktop/RC 2.0/dashboard_current.png' });
  await browser.close();
  console.log('Screenshot captured successfully.');
})();
