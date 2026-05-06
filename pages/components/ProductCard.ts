import { Locator, expect } from '@playwright/test';

export class ProductCard {
  readonly title: Locator;
  readonly price: Locator;
  readonly image: Locator;

  constructor(private readonly card: Locator) {
    this.title = card.locator('.ModelList__InfoModelBlock').locator('.ModelList__NameBlock')
    this.price = card.locator('.ModelList__PriceBlock').locator('span.PriceBlock__PriceValue')
    this.image = card.locator('.ModelList__IconBlock').locator('img:not(.ModelList__GalleryHide, .lazyLoadImage)').first()
  }

  async scrollIntoView() {
    await this.card.scrollIntoViewIfNeeded();
    await this.card.page().waitForTimeout(300);
  }

  async waitForImageLoaded() {
    await this.scrollIntoView();
    await expect(this.image).toBeVisible();

    // await expect(this.image).not.toHaveAttribute('srcset', /loading-image\.svg/, {
    //   timeout: 5000,
    // });

    // const isLoaded = await this.image.evaluate(
    //   (el: HTMLImageElement) => el.complete && el.naturalWidth > 0
    // );
    // expect(isLoaded).toBe(true);
  }

  async getTitleText(): Promise<string> {
    return (await this.title.textContent())?.trim() ?? '';
  }

  async getPriceValue(): Promise<number> {
    const text = await this.price.textContent() ?? '';
    const cleaned = text.replace(/[^\d]/g, '');
    return parseInt(cleaned, 10);
  }

  async validateAll() {
    await this.waitForImageLoaded();

    await expect(this.title).toBeVisible();
    expect((await this.getTitleText()).length).toBeGreaterThan(0);

    await expect(this.price).toBeVisible();
    expect(await this.getPriceValue()).toBeGreaterThan(0);
  }
}