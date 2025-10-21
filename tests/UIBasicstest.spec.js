const{ test, expect }=require('@playwright/test');
const { log } = require('console');
const { only } = require('node:test');
const { text } = require('stream/consumers');

test('Browser Context Playwright test',async ({ browser })=>
{

    //playwright code-
    const context=await browser.newContext();
    const page=await context.newPage();
    await page.goto("https://visor.com/");
    console.log(await page.title());
    await expect(page).toHaveTitle("Vis");

});


test('Page Playwright test', async ({ browser }) => {
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Define locators
  const userName = page.locator('#username');
  const password = page.locator("[type='password']");
  const signIn   = page.locator('#signInBtn');
  const cardTitles=page.locator(".card-body a");

  // Go to the website
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

  console.log(await page.title());

  // Negative login
  await userName.fill("rahulshetty");
  await password.fill("learning");
  await signIn.click();
  console.log(await page.locator("[style*='block']").textContent());
  await expect(page.locator("[style*='block']")).toContainText('Incorrect');

  // Clear and try again
  await userName.fill("");
  await password.fill("");
  await userName.fill("rahulshettyacademy");
  await password.fill("learning");   // <-- remove the extra ')' you had
  await signIn.click();

  // This will print the text of the first product link
  console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(1).textContent());
   const allTitles= await cardTitles.allTextContents();
   console.log(allTitles);
  

  // ✅ Expectation should now be for success, not incorrect login
  await expect(page.locator(".card-body a").first()).toContainText('iphone'); 
});


test('Page Playwright login test', async ({ browser }) => {
  
  const context = await browser.newContext();
  const page = await context.newPage();

  // Define locators
  const userName = page.locator('#userEmail');
  const password = page.locator("#userPassword");
  const login   = page.locator('#login');

// Locate all .card-body elements
const cardBodies = page.locator('.card-body');

  // Go to the website
  await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

  console.log(await page.title());

  // Negative login
  await userName.fill("mitukumari2024@gmail.com");
  await password.fill("Mission@027");
  await login.click();
  console.log(await page.locator("#toast-container").textContent());
  await expect(page.locator("#toast-container")).toContainText('Incorrect');

  // Clear and try again
  await userName.fill("");
  await password.fill("");
  await userName.fill("mitukumari2024@gmail.com");
  await password.fill("Test@2027");   // <-- remove the extra ')' you had
  await login.click();


// Get the first one
const firstCard = cardBodies.first();

// Print text of first card
console.log(await firstCard.textContent());

// Print all card texts
const allTitles = await cardBodies.allTextContents();
console.log(allTitles);



});
test('UI Controls', async ({ page }) => {
  // Define locators
  const userName = page.locator('#username');
  const password = page.locator("[type='password']");
  const signIn   = page.locator('#signInBtn');
  const dropdown=page.locator('select.form-control');
  const radioBtn=page.locator('.radiotextsty');
  const okayBtn=page.locator('#okayBtn');
  const checkBox=page.locator('#terms');
  const documentLink=page.locator("[href*='documents-request']");
// Locate all .card-body elements
const cardBodies = page.locator('.card-body');
 // Go to the website
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  await userName.fill("rahulshettyacademy");
  await password.fill("learning");;  
  await dropdown.selectOption("consult") 
  await radioBtn.last().click();
  await okayBtn.click();
  await expect(page.locator('.radiotextsty').last()).toBeChecked();
  await checkBox.click();
  await expect(page.locator('#terms')).toBeChecked();
  await checkBox.uncheck();
 expect( await page.locator('#terms').isChecked()).toBeFalsy();
await expect(documentLink).toHaveAttribute("class","blinkingText")
  //await page.pause();
 
});
test('Child Windows Handling', async ({ browser }) => {
    const context = await browser.newContext();
  const page = await context.newPage();
    const userName = page.locator('#username');
await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
 const documentLink=page.locator("[href*='documents-request']");

 const [newPage]=await Promise.all([

 context.waitForEvent('page'),
  documentLink.click(),
])
const textOnNewPage = await newPage.locator('.red').textContent();

const arrayText=textOnNewPage.split("@");
const domain=arrayText[1].split(" ")[0];

await page.locator('#username').fill(domain);
await page.pause();
console.log(await page.locator('#username').inputValue());



 



 
});