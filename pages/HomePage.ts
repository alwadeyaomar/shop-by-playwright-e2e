import {Page, Locator, expect} from '@playwright/test'

export class HomePage {
    readonly page: Page;
    readonly smartphonesLink: Locator;

    constructor(page: Page){
        this.page = page;
        this.smartphonesLink = page.getByTestId('fast-link-6').first();
    }

    async open() {
        await this.page.goto('https://shop.by/');
        await expect(this.page).toHaveTitle(/Shop.by/);
    }

    async goToSmartphones(){
        await this.smartphonesLink.click()
        await this.page.locator('.ModelList').waitFor({ state: 'visible' })
    }
}