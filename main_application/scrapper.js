const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false }, { waitUntil: 'networkidle2' }); // Opens Browser
    const page = await browser.newPage(); // Opens new tab in browser

    await page.goto('https://www.mercadolivre.com'); // Search for Mercado Livre

    try {
        // Clicks the accept cookies button
        await page.click('button[class="cookie-consent-banner-opt-out__action cookie-consent-banner-opt-out__action--primary cookie-consent-banner-opt-out__action--key-accept"]');
        await page.waitForTimeout(1000);
    } catch (e) {}

    // Clicks the "CEP cancel" button
    await page.click('button[class="onboarding-cp-button andes-button andes-button--transparent andes-button--small"]');

    // Types in the search bar
    await page.type('input[name="as_word"]', 'placa de vídeo');

    // Clicks Search button
    await page.click('.nav-search-btn');

    // Waits for the page to load
    await page.waitForSelector('.poly-component__title-wrapper', { waitUntil: 'networkidle2' });

    // Creates a variable with the desired information
    const produtos = await page.$$eval('.ui-search-layout__item', itens => {
        return itens.slice(0, 52).map(item => {
            const nome = item.querySelector('.poly-component__title')?.innerText || 'Sem título';
            const moeda = item.querySelector('.andes-money-amount__currency-symbol')?.innerText || 'Sem moeda';
            const valorInt = item.querySelector('.poly-price__current .andes-money-amount__fraction')?.innerText || '00';
            const valorCent = item.querySelector('.andes-money-amount__cents--superscript-24')?.innerText || '00';
            const link = item.querySelector('a[class="poly-component__title"]')?.href || 'Sem link';
            return { nome, valor: `${moeda} ${valorInt},${valorCent}`, link };
        });
    });

    // Salva os resultados em um arquivo JSON
    fs.writeFileSync('results/produtos.json', JSON.stringify(produtos, null, 2), 'utf-8');

    console.log('Arquivo produtos.json criado com sucesso!');

    await browser.close();
})();
