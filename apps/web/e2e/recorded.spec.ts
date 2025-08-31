import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:4000/");
  await page.getByRole("button", { name: "PLAY" }).click();
  await page.getByText("logo").click();
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("john");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("azertyuiop");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByText("Invalid email format").click();
  await page.getByRole("button", { name: "Cancel" }).click();
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Don't have an account?" }).click();
  await page.getByRole("textbox", { name: "Pseudo*" }).click();
  await page.getByRole("textbox", { name: "Pseudo*" }).fill("bonjour");
  await page.getByRole("textbox", { name: "Pseudo*" }).press("Tab");
  await page.getByRole("textbox", { name: "Email*" }).fill("bonjour@ok.com");

  await page.waitForTimeout(600);

  // Fixing webkit navigation
  const passwordInput = page.getByRole("textbox", {
    name: "Password*",
    exact: true,
  });
  await passwordInput.waitFor({ state: "visible" });
  await expect(passwordInput).toBeVisible();
  await page.waitForTimeout(600);
  await passwordInput.click({ force: true });
  await passwordInput.fill("haha");

  await page.getByText("Password requires at least 1").click();

  // Fixing webkit navigation
  const backButton = page.getByRole("button", { name: "<<<" });
  await backButton.waitFor({ state: "visible" });
  await expect(backButton).toBeVisible();
  await page.waitForTimeout(600);
  await backButton.click();

  await page.goto("http://localhost:4000/play");
  await page
    .locator("div:nth-child(3) > .w-8 > .cursor-default")
    .first()
    .click();
  await page
    .locator("div:nth-child(3) > .w-8 > .cursor-default")
    .first()
    .fill("5");
  await page
    .locator("div:nth-child(2) > div > div > .w-8 > .cursor-default")
    .first()
    .click();
  await page
    .locator("div:nth-child(2) > div > div > .w-8 > .cursor-default")
    .first()
    .fill("2");
  await page
    .locator(
      "div:nth-child(2) > div > div:nth-child(2) > .w-8 > .cursor-default",
    )
    .first()
    .click();
  await page
    .locator(
      "div:nth-child(2) > div > div:nth-child(2) > .w-8 > .cursor-default",
    )
    .first()
    .fill("1");
  await page.locator("svg").first().click();
  await page.locator("svg").nth(1).click();
  await page.locator("svg").first().click();
  await page.locator("svg").first().click();
  await page
    .locator("div:nth-child(3) > div > div > .w-8 > .cursor-default")
    .first()
    .click();
  await page
    .locator("div:nth-child(3) > div > div > .w-8 > .cursor-default")
    .first()
    .fill("8");
  await page.locator("svg").first().click();
  await page
    .locator("div:nth-child(3) > .w-8 > .cursor-default")
    .first()
    .click();
  await page.locator("svg").nth(2).hover();
  await page.getByText("Erase last selected cell (2,").first().click();
  await page.locator("svg").nth(2).click();
});
