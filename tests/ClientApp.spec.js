
import { test, expect } from '@playwright/test';

import dotenv from 'dotenv';

dotenv.config();


const email = process.env.EMAIL;
const password = process.env.PASSWORD;

test.only('Client App login test', async ({ page }) => {
// Define locators
  const login   = page.locator('#login');
const products = page.locator(".card-body");
const cardTitles=page.locator(".card-body b")
const productName= 'ZARA COAT 3';




  // Go to the website
  await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
  await page.locator("#userEmail").fill(email);
  await page.locator("#userPassword").fill(password);
  await page.locator("[value='Login']").click();
  await page.waitForLoadState('networkidle');
  await page.locator(".card-body b").first().waitFor();
   const allTitles= await cardTitles.allTextContents();
   console.log(allTitles);
   const count=await products.count();
   for(let i=0;i<count;++i){

   if (await products.nth(i).locator("b").textContent()==productName)
   {
//add to cart
    await products.nth(i).locator("text=Add To Cart").click();
break;
   }



   }
   await page.locator("[routerlink$='/dashboard/cart']").click();
  // await page.locator("div.li").first().waitFor();
 const bool= page.locator("h3:has-text('productName')").isVisible();
 expect(bool).toBeTruthy();
   await page.locator("text=Checkout").click();
   await page.locator("input.input.txt.text-validated").first().fill("3425 2434 2345 2345");
   // Locate the dropdown
const firstDropdown = page.locator('select.input.ddl').first();
const secondDropdown = page.locator('select.input.ddl').nth(1);


// Select by value
await firstDropdown.selectOption('05');
await secondDropdown.selectOption('20');
const cvvInput = page.locator('input.input.txt:below(:text("CVV Code"))').nth(0);
await cvvInput.waitFor({ state: 'visible' });
await cvvInput.click();
await cvvInput.fill('431');
await page.locator('input.input.txt').nth(1).fill('John Doe'); // Name on Card

await page.locator('input.input.txt').nth(2).fill('abcd'); // Name on Card
await page.locator('input.input.txt').nth(3).fill('ytr'); // Name on Card
//await page.locator("text=Apply Coupon").nth(1).click();
await page.locator("input[placeholder='Select Country']").pressSequentially("Ind");
const dropdown=page.locator(".ta-results");
await dropdown.waitFor();
 const optionsCount= await dropdown.locator("button").count();
 for(let i=0;i<optionsCount;++i){
const text=await dropdown.locator("button").nth(i).textContent();
if(text===" India"){
  await dropdown.locator("button").nth(i).click();
  break;
}

 }
await expect(page.locator('label', { hasText: email })).toBeVisible();
await page.locator('.btnn.action__submit.ng-star-inserted').click();
await expect(page.locator('.hero-primary')).toHaveText(" Thankyou for the order. ");
const orderId=await page.locator("label.ng-star-inserted").textContent();
console.log("OrderID" , orderId);
await page.locator(".btn.btn-custom[routerlink='/dashboard/myorders']").click();
await page.locator("tbody").waitFor();
const rows=await page.locator("tbody tr");
for (let i=0;i<await rows.count();i++){
const rowOrderId=await rows.nth(i).locator("th").textContent();
if(orderId.includes(rowOrderId)){
  await rows.nth(i).locator("button").first().click();
  break;
}

}

const orderIdDetails=await page.locator(".col-text").textContent();
await expect(orderId.includes(orderIdDetails)).toBeTruthy();
});
