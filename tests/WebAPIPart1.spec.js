const { test, expect, request } = require('@playwright/test');

const loginPayload = {
  userEmail: "mitukumari2024@gmail.com",
  userPassword: "Test@2027"
};

const productName = "ZARA COAT 3";

let token;

test.beforeAll(async () => {

  const apiContext = await request.newContext();

  // ✅ CORRECT API ENDPOINT
  const loginResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    {
      data: loginPayload,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  expect(loginResponse.ok()).toBeTruthy();

  const loginResponseJson = await loginResponse.json();

  // ✅ SAFE TOKEN HANDLING
  token = loginResponseJson.token || loginResponseJson.data?.token;

  console.log("Token generated:", token);
});

test('Client App E2E Shopping Flow (API Login)', async ({ page }) => {

  // ✅ Inject token into browser
  await page.addInitScript(value => {
    window.localStorage.setItem('token', value);
  }, token);

  // ✅ Go directly to application (skip login page)
  await page.goto("https://rahulshettyacademy.com/client");

  // ---------------- PRODUCTS ----------------
  const products = page.locator(".card-body");
  const cardTitles = page.locator(".card-body b");

  await cardTitles.first().waitFor();

  const count = await products.count();

  for (let i = 0; i < count; i++) {
    const title = await products.nth(i).locator("b").textContent();

    if (title.trim() === productName) {
      await products.nth(i).locator("text=Add To Cart").click();
      break;
    }
  }

  // ---------------- CART ----------------
 await page.locator("[routerlink*='cart']").click();

// wait for cart to load
await page.locator("h3").first().waitFor();

// correct assertion
await expect(page.locator(`h3:has-text("${productName}")`)).toBeVisible();

  // ---------------- CHECKOUT ----------------
  await page.locator("text=Checkout").click();

  await page.locator("input.input.txt.text-validated").first().fill("4111111111111111");

  const dropdowns = page.locator("select.input.ddl");
  await dropdowns.first().selectOption("05");
  await dropdowns.nth(1).selectOption("20");

  await page.locator("input.input.txt").nth(1).fill("431");
  await page.locator("input.input.txt").nth(2).fill("John Doe");
  await page.locator("input.input.txt").nth(3).fill("abcd");

  // ---------------- COUNTRY ----------------
  await page.locator("input[placeholder='Select Country']").pressSequentially("Ind");

  const dropdown = page.locator(".ta-results");
  await dropdown.waitFor();

  const optionsCount = await dropdown.locator("button").count();

  for (let i = 0; i < optionsCount; i++) {
    const text = await dropdown.locator("button").nth(i).textContent();

    if (text.trim() === "India") {
      await dropdown.locator("button").nth(i).click();
      break;
    }
  }

  // ---------------- PLACE ORDER ----------------
  await page.locator(".btnn.action__submit").click();

  await expect(page.locator(".hero-primary"))
    .toHaveText(" Thankyou for the order. ");

  const orderId = await page.locator("label.ng-star-inserted").textContent();
  console.log("Order ID:", orderId);

  // ---------------- ORDER HISTORY ----------------
await page.locator("label").filter({ hasText: "Orders History Page" }).click();

  await page.locator("tbody").waitFor();

  const rows = page.locator("tbody tr");

  for (let i = 0; i < await rows.count(); i++) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();

    if (orderId.includes(rowOrderId.trim())) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }

  const orderIdDetails = await page.locator(".col-text").textContent();

  expect(orderId.trim().includes(orderIdDetails.trim())).toBeTruthy();
});