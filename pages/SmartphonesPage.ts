import {Page, Locator, expect} from '@playwright/test'
import { ProductCard } from './components/ProductCard';

export class SmartphonesPage {
    readonly page: Page;
    readonly searchByWordsInput: Locator;
    readonly productCards: Locator;
    readonly sortCheapButton: Locator;
    readonly minPriceInput: Locator;
    readonly maxPriceInput: Locator;
    readonly applyFilterBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.searchByWordsInput = page.getByTestId('filter-group-type_find').locator('input').first();
        this.productCards = page.locator('[data-testid^="model-item-"]');
    }

    async searchFor(keyword: string) {
        await this.searchByWordsInput.fill(keyword);
        await this.searchByWordsInput.press('Enter');
        await this.page.locator('.ModelList').waitFor({ state: 'visible' })
    }

    async getCards(): Promise<ProductCard[]> {
        const count = await this.productCards.count();
        return Array.from({ length: count }, (_, i) =>
          new ProductCard(this.productCards.nth(i))
        );
    }

    async verifyProductsHaveBasicElements(){
        const cards = await this.getCards();
        for (const card of cards) {
            await card.validateAll();
        }
    }
}