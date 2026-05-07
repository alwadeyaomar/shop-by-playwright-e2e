import {Page, Locator, expect} from '@playwright/test'
import { ProductCard } from './components/ProductCard';

export class SmartphonesPage {
    readonly page: Page;
    readonly searchByWordsInput: Locator;
    readonly productCards: Locator;
    readonly sortSelect: Locator;
    readonly minPriceInput: Locator;
    readonly maxPriceInput: Locator;
    readonly applyFilterBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.searchByWordsInput = page.getByTestId('filter-group-type_find').locator('input').first();
        this.productCards = page.locator('[data-testid^="model-item-"]');
        this.sortSelect = page.locator('.PanelSetUp__SortBlock').locator('span').first();
        this.minPriceInput = page.locator('input[name="price_before"]').first()
        this.maxPriceInput = page.locator('input[name="price_after"]').first()
        this.applyFilterBtn = page.getByTestId('filter-apply').first()
    }

    async searchFor(keyword: string) {
        await this.searchByWordsInput.fill(keyword);
        await this.searchByWordsInput.press('Enter');
        await this.page.locator('.ModelList').waitFor({ state: 'visible' })
    }

    async getCards(): Promise<Array<Locator>> {
        return this.productCards.all()
    }

    async verifyProductsHaveBasicElements(){
        const cards = await this.getCards();
        for (const card of cards) {
            const productCard = new ProductCard(card)
            await productCard.validateAll();
        }
    }

    async verifySearchResult(keyword:string){
        const cards = await this.getCards();
        for (const card of cards) {
            const productCard = new ProductCard(card)
            await productCard.hasKeywordInTitle(keyword);
        }
    }

    async sortProduct(filterText:string){
        await this.sortSelect.click();
        await this.page.locator('li', { hasText: filterText }).click();
        
        await this.page.waitForLoadState("networkidle")

        const cards = await this.getCards();
        const prices:Array<number> = []

        for (const card of cards) {
            const productCard = new ProductCard(card)
            prices.push(await productCard.getPriceValue());
        }

        const isSorted = prices.every(
            (num, index, arr) => index === 0 || arr[index - 1] <= num
        );
          
        expect(isSorted, `Products are sorted in ascending order`).toBeTruthy();
    }

    async validateProductsPriceInRange(min: number, max: number){
        await this.minPriceInput.click()
        await this.minPriceInput.pressSequentially(min.toString())

        await this.maxPriceInput.click()
        await this.maxPriceInput.pressSequentially(max.toString())

        await this.applyFilterBtn.click()

        await this.page.waitForLoadState("networkidle")
        
        await expect(this.productCards.first()).toBeVisible();

        const cards = await this.getCards();
        for (const card of cards) {
            const productCard = new ProductCard(card)
            await productCard.checkPriceInRange(min, max)
        }

    }
}