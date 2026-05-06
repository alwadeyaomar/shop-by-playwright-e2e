import {test} from '@playwright/test'
import { HomePage} from '../pages/HomePage'
import { SmartphonesPage} from '../pages/SmartphonesPage'

test.describe('Поиск и фильтрация смартфонов', ()=>{
    test('Сценарий поиска iPhone, сортировки и фильтрации по цене', async ({page}) =>{

        const homePage = new HomePage(page);
        const smartphonesPage = new SmartphonesPage(page)

        await test.step('Открыть главную страницу', async () =>{
            await homePage.open();
        })

        await test.step('Перейти в раздел смартфонов', async ()=>{
            await homePage.goToSmartphones()
        })

        await test.step('Поиск слова "iPhone" в названии', async () => {
            await smartphonesPage.searchFor('iPhone');
        });

        await test.step('Проверка наличия заголовка, цены и изображения', async () => {
            await smartphonesPage.verifyProductsHaveBasicElements();
        });
        
    })
})