import { Locator, expect } from '@playwright/test';

export class ProductCard {
  private readonly title: Locator;
  private readonly price: Locator;
  private readonly image: Locator;

  constructor(private readonly card: Locator) {
    this.title = card.locator('.ModelList__InfoModelBlock').locator('.ModelList__NameBlock').first()
    this.price = card.locator('.ModelList__PriceBlock').locator('span.PriceBlock__PriceValue').first()
    this.image = card.locator('.ModelList__IconBlock').locator('img').first()
  }

  public async getTitleText(): Promise<string> {
    return (await this.title.textContent())?.trim() ?? '';
  }

  public async getPriceValue(): Promise<number> {
    const text = await this.price.textContent() ?? '';
    const cleaned = text.replace(/[^\d]/g, '');
    return parseInt(cleaned, 10);
  }

  public async validateAll() {
    await this.card.scrollIntoViewIfNeeded();
    await expect(this.image).toBeVisible();

    await expect(this.title).toBeVisible();
    expect((await this.getTitleText()).length).toBeGreaterThan(0);

    await expect(this.price).toBeVisible();
    expect(await this.getPriceValue()).toBeGreaterThan(0);
  }
}