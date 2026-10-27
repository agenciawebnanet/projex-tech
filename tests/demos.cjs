const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.BASE_URL || 'http://localhost:3021';
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const failures = [];
  try {
    await page.goto(`${base}/demos/restaurant`); await page.getByRole('button', { name: /ver menú/i }).click();
    await page.getByRole('button', { name: /sumar/i }).first().click(); await page.getByRole('button', { name: /ver pedido/i }).click();
    await page.getByLabel('Nombre').fill('Demo'); await page.getByLabel('Dirección').fill('Asunción'); await page.getByRole('button', { name: /confirmar pedido/i }).click();
    await page.getByRole('button', { name: /acompañar pedido/i }).click(); assert.match(await page.locator('h1').innerText(), /cocinando/i);

    await page.goto(`${base}/demos/crm`); await page.getByRole('button', { name: 'New contact' }).click(); await page.locator('input[name="name"]').fill('Lead prueba'); await page.getByRole('button', { name: 'Save demonstration record' }).click(); assert.match(await page.locator('body').innerText(), /Lead prueba/);
    await page.getByRole('button', { name: 'Pipeline' }).click(); await page.getByRole('button', { name: /Move/ }).first().click();

    await page.goto(`${base}/demos/hotel`); await page.getByRole('button', { name: 'Rooms' }).click(); await page.getByRole('button', { name: 'Choose room' }).first().click();
    await page.locator('input[type="date"]').nth(0).fill('2026-11-10'); await page.locator('input[type="date"]').nth(1).fill('2026-11-12'); await page.getByRole('button', { name: /confirm demonstration reservation/i }).click(); assert.match(await page.locator('body').innerText(), /Reservation preview confirmed/);

    await page.goto(`${base}/demos/erp`); await page.getByRole('button', { name: 'Products' }).click(); await page.getByRole('button', { name: 'Add product' }).click(); await page.locator('input[name="name"]').fill('Producto de prueba'); await page.getByRole('button', { name: 'Save demonstration record' }).click(); assert.match(await page.locator('body').innerText(), /Producto de prueba/);
    await page.getByRole('button', { name: 'Orders' }).click(); await page.getByRole('button', { name: 'New order' }).click(); await page.locator('input[name="name"]').fill('Pedido demo'); await page.getByRole('button', { name: 'Save demonstration record' }).click(); assert.match(await page.locator('body').innerText(), /Pedido demo/);

    await page.goto(`${base}/demos/industry`); await page.getByRole('button', { name: 'Work orders' }).click(); await page.getByRole('button', { name: 'Open work order' }).click(); await page.locator('input[name="name"]').fill('Revisar prensa'); await page.getByRole('button', { name: 'Save demonstration record' }).click(); assert.match(await page.locator('body').innerText(), /Revisar prensa/); await page.getByRole('button', { name: /Advance status/ }).first().click();

    await page.goto(`${base}/demos/automation`); await page.getByRole('button', { name: /Send demo reply/ }).click(); assert.match(await page.locator('body').innerText(), /sent locally/i); await page.getByRole('button', { name: /Hand off to agent/ }).click(); assert.match(await page.locator('body').innerText(), /fictional human agent/i);
    for (const route of ['/', '/demos/restaurant','/demos/crm','/demos/hotel','/demos/erp','/demos/industry','/demos/automation']) { const response=await page.goto(`${base}${route}`); assert.equal(response.status(),200,route); await page.screenshot({path:`public/showcase/${route==='/'?'home':route.split('/').pop()}.png`,fullPage:false}); }
    await page.setViewportSize({width:390,height:844}); for (const route of ['/','/demos/restaurant','/demos/crm','/demos/hotel','/demos/erp','/demos/industry','/demos/automation']) { await page.goto(`${base}${route}`); assert.equal(await page.locator('body').evaluate(el=>el.scrollWidth<=innerWidth),true,`mobile overflow: ${route}`); }
    console.log('PASS: six demo workflows, 7 public routes, desktop captures and mobile overflow checks.');
  } catch (error) { failures.push(error); console.error(error); process.exitCode=1; }
  finally { await browser.close(); }
})();
