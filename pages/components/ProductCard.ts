import { Locator, expect } from '@playwright/test';

export class ProductCard {
  private readonly title: Locator;
  private readonly price: Locator;
  private readonly image: Locator;

  constructor(private readonly card: Locator) {
    this.title = card.locator('.ModelList__InfoModelBlock').locator('.ModelList__NameBlock').first()
    this.price = card.locator('.ModelList__PriceBlock').locator('span.PriceBlock__PriceValue').first()
    this.image = card.locator('.ModelList__IconBlock').locator('img:not(.ModelList__GalleryHide, .lazyLoadImage)').first()
  }

  public async getTitleText(): Promise<string> {
    return (await this.title.textContent())?.trim() ?? '';
  }

  public async getPriceValue(): Promise<number> {
    const text = await this.price.textContent() ?? '';
    const cleaned = text
      .replace(/\s/g, '')
      .replace(/[^\d.,]/g, '')
      .replace(',', '.');

    const price = parseFloat(cleaned);
    return price;
  }

  public async validateAll() {
    await this.card.scrollIntoViewIfNeeded();
    await expect(this.image, `Product has visible image`).toBeVisible();

    await expect(this.title, `Product has visible title`).toBeVisible();
    expect((await this.getTitleText()).length, `Product has not empty title`).toBeGreaterThan(0);

    await expect(this.price, `Product has price = ${this.price}`).toBeVisible();
    expect(await this.getPriceValue(), `Product has zero price`).toBeGreaterThan(0);
  }

  public async hasKeywordInTitle(keyword: string){
    const titleText = await this.getTitleText()
    expect(titleText?.toLowerCase(), `Product has word '${keyword}' in  title(${titleText})`).toContain(keyword);
  }

  public async checkPriceInRange(min: number, max: number): Promise<boolean>{
    const price = await this.getPriceValue()
    console.log(price)
    const isPriceInRange = (price >= min && price <= max);
    expect(isPriceInRange).toBeTruthy()
    return isPriceInRange
  }
}