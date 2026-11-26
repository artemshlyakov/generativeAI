// Verify optional motion without changing the normal navigation or hiding content.
const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'no-preference'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8765/experiment.html',{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>document.querySelector('.page-lead').getAnimations().some(a=>a.playState==='running'));
await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.page-lead').getAnimations().length===0);
assert.equal(await page.locator('.page-lead').evaluate(x=>getComputedStyle(x).opacity),'1');assert.equal(await page.locator('html').evaluate(x=>getComputedStyle(x).scrollBehavior),'auto');
await page.emulateMedia({reducedMotion:'no-preference'});await page.reload({waitUntil:'networkidle'});
const summary=page.locator('#light details').first().locator('summary');await summary.click();await page.waitForFunction(()=>document.querySelector('#light details[open] .details-body').getBoundingClientRect().height>100);assert(await summary.isVisible());await summary.click();
await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Открыть меню'}).click();assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'domcontentloaded'});assert.equal(await page.locator('main').evaluate(x=>getComputedStyle(x).opacity),'1');assert.deepEqual(errors,[]);await browser.close();console.log('Motion, reduced-motion cancellation, animated disclosures and mobile menu: passed');})().catch(e=>{console.error(e);process.exit(1)});
