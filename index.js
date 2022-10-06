const puppeteer = require('puppeteer');
const keyword = "20219628";

(async () => {
    const browser = await puppeteer.launch({
        args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    await page.goto(`https://kobis.or.kr/kobis/business/mast/mvie/searchMovieList.do?dtTp=movie&dtCd=${keyword}`);

    // let data = await page.$eval(
    //     "#ui-id-1 > div > div.item_tab.basic > div.ovf.info.info1 > a > img", element => {
    //         return element.src;
    //     });   

    let data = {};
    const image = await page.$("#ui-id-1 > div > div.item_tab.basic > div.ovf.info.info1 > a > img");
    data.imgPath = await page.evaluate((data) => {
        return data.src;
    }, image);
    const summaryInfo = await page.$("#ui-id-1 > div > div.item_tab.basic > div.ovf.info.info1 > dl > dd:nth-child(8)");
    data.summary = await page.evaluate((data) => {
        return data.textContent;
    }, summaryInfo);
    data.synopsis = await page.$eval(
        "#ui-id-1 > div > div.item_tab.basic > div:nth-child(5) > p", element => {
            return element.textContent;
    });
    const directorInfo = await page.$("dl.desc_info > div > dd > a");
    data.director = await page.evaluate((data) => {
        return data.textContent;
    },directorInfo);
    const actorInfo = await page.$$eval("dl.desc_info > div:nth-child(2) > dd > table:nth-child(1) > tbody > tr > td > a"
    , e => e.map((a) => a.textContent));
    data.actors = actorInfo;
   
    console.log(data);

    //await page.waitForNavigation({timeout:3000});
    await browser.close();   
})();
 