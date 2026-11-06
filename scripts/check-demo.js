import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3001');await page.getByText('Demo accounts',{exact:true}).waitFor();
 if(process.env.DEMO_SCREENSHOT_DIR) await page.screenshot({path:process.env.DEMO_SCREENSHOT_DIR+'/fitpilot-demo.png',fullPage:true});
 await page.goto('http://127.0.0.1:3001/client');
 await page.getByLabel('Email',{exact:true}).fill('client@fitpilot.test');await page.getByLabel('Password',{exact:true}).fill('FitPilotDemo2026!');await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.getByText('Foundation practice workout',{exact:true}).first().waitFor();
 if(process.env.DEMO_SCREENSHOT_DIR) await page.screenshot({path:process.env.DEMO_SCREENSHOT_DIR+'/fitpilot-prototype-home.png',fullPage:true});

 for (const tab of ['Nutrition','Progress','Coach','Today']) {
  await page.getByRole('button',{name:tab,exact:true}).click();
 }
 await page.getByRole('button',{name:'Nutrition',exact:true}).click();
 await page.getByRole('button',{name:'＋ Log a meal',exact:true}).click();
 await page.getByRole('button',{name:'Preview sample estimate →',exact:true}).click();
 await page.getByText('Illustrative macro estimate',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Save sample meal',exact:true}).click();
 await page.getByRole('button',{name:'Close',exact:true}).waitFor({state:'hidden'});
 await page.getByRole('button',{name:'Today',exact:true}).click();
 await page.setViewportSize({width:390,height:844});
 for(const tab of ['Train','Nutrition','Progress','Coach','Today']) {
  await page.getByRole('button',{name:tab,exact:true}).click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,`No horizontal page overflow on ${tab}`);
 }
 if(process.env.DEMO_SCREENSHOT_DIR) await page.screenshot({path:process.env.DEMO_SCREENSHOT_DIR+'/fitpilot-prototype-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Assessment',exact:true}).click();
 await page.getByRole('button',{name:'Build strength',exact:true}).click();
 await page.getByRole('button',{name:'Continue assessment',exact:true}).click();
 await page.getByRole('button',{name:'Training regularly',exact:true}).click();
 await page.getByRole('button',{name:'Continue assessment',exact:true}).click();
 await page.getByRole('button',{name:'Vegetarian',exact:true}).click();
 await page.getByRole('button',{name:'Save profile',exact:true}).click();
 await page.getByText('Draft saved. Your assigned coach can review it.',{exact:true}).waitFor();
 if(process.env.DEMO_SCREENSHOT_DIR) await page.screenshot({path:process.env.DEMO_SCREENSHOT_DIR+'/fitpilot-guided-profile.png',fullPage:true});
 await page.getByRole('button',{name:'Train',exact:true}).click();
 await page.setViewportSize({width:1280,height:900});
 await page.getByRole('button',{name:'Demo: Chair squat',exact:true}).click();
 await page.getByText('Motion placeholder—not an instructional demonstration. Your trainer’s approved footage and technique cues will appear here.',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Close',exact:true}).click();
 await page.getByRole('button',{name:'Close',exact:true}).waitFor({state:'hidden'});

 await page.getByRole('button',{name:'Start local practice session',exact:true}).click();
 await page.getByLabel('Chair squat set 1 load kg',{exact:true}).fill('0');await page.getByRole('button',{name:'Save Chair squat set 1',exact:true}).click();
 await page.getByText('8 reps • 0 kg • pending',{exact:true}).waitFor();await page.getByRole('button',{name:'Sync saved sets',exact:true}).click();await page.getByText('8 reps • 0 kg • synced',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Exercise 2: Wall push-up',exact:true}).click();
 assert.equal(await page.getByLabel('Chair squat set 2 reps',{exact:true}).isVisible(),false);
 await page.getByRole('button',{name:'Exercise 1: Chair squat',exact:true}).click();
 await page.getByRole('button',{name:'Train',exact:true}).click();
 if(process.env.DEMO_SCREENSHOT_DIR) await page.screenshot({path:process.env.DEMO_SCREENSHOT_DIR+'/fitpilot-client.png',fullPage:true});
 const coach=await context.newPage();coach.on('pageerror',e=>errors.push(e.message));await coach.goto('http://127.0.0.1:3001/coach');await coach.locator('#login input[name=email]').fill('coach@fitpilot.test');await coach.locator('#login input[name=password]').fill('FitPilotDemo2026!');await coach.locator('#login button').click();await coach.getByRole('button',{name:'client@fitpilot.test',exact:true}).click();await coach.getByText('Revision 1 • exercise-1 set 1 • 8 reps • 0 kg',{exact:true}).first().waitFor();
 if(process.env.DEMO_SCREENSHOT_DIR) await coach.screenshot({path:process.env.DEMO_SCREENSHOT_DIR+'/fitpilot-coach.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('Demo verified: landing, client sign-in, local logging, sync and assigned coach review.');
}finally{await browser.close();}
