const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false }, { waitUntil: 'networkidle2' }); // Opens Browser
    const page = await browser.newPage(); // Opens new tab in browser

    await page.goto('https:www.mercadolivre.com'); // Search for Mercado Livre

    try {
        // Clicks the accept cookies button
        await page.click('button[class="cookie-consent-banner-opt-out__action cookie-consent-banner-opt-out__action--primary cookie-consent-banner-opt-out__action--key-accept"]');
        await page.waitForTimeout(1000);
    } catch (e) {
    }
    // Clicks the "CEP cancel" button
    await page.click('button[class="onboarding-cp-button andes-button andes-button--transparent andes-button--small"]')
    // Types in the search bar
    await page.type('input[name="as_word"]', 'placa de vídeo');
    // CLicks Search button
    await page.click('.nav-search-btn')
    // Wait the page loading
    await page.waitForSelector('.poly-component__title-wrapper', { waitUntil: 'networkidle2' });

    // Creates a variable with the desired information for the specified number of times
    const produtos = await page.$$eval('.ui-search-layout__item', itens => {
        return itens.slice(0, 10).map(item => {
            const nome = item.querySelector('.poly-component__title')?.innerText || 'Sem título';
            const moeda = item.querySelector('.andes-money-amount__currency-symbol')?.innerText || 'Sem moeda';
            const valorInt = item.querySelector('.poly-price__current .andes-money-amount__fraction')?.innerText || '00';
            const valorCent = item.querySelector('.andes-money-amount__cents--superscript-24')?.innerText || '00';
            const link = item.querySelector('a[class="poly-component__title"]')?.href || 'Sem link';
            return { nome, link, moeda, valorInt, valorCent };
        });
    });

    // Print the result of the search
    for (const produto of produtos) {
        console.log('========================================');
        console.log('Item:', produto.nome);
        console.log('Valor:', produto.moeda, produto.valorInt, produto.valorCent);
        console.log('link:', produto.link);
    }

    // Closes the browser
    await browser.close();
})();
