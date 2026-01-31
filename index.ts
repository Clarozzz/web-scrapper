import chromium from "playwright"

const browser = await chromium.chromium.launch({
    headless: true
});

const url = "https://books.toscrape.com/";

const page = await browser.newPage();

await page.goto(url, {
    waitUntil: "domcontentloaded"
});

await page.waitForSelector(".product_pod");

if (!(await page.$(".product_pod"))) {
    throw new Error("No books found")
} else {
    const books = await page.$$eval(".product_pod", (results, url) =>
        results.map((element) => {
            const imgPath = element.querySelector("img")?.getAttribute("src") || "";
            const img = url + imgPath;
            const rating = element.querySelector(".star-rating")?.classList[1];
            const title = element.querySelector("h3 a")?.innerHTML || "";
            const price = element.querySelector(".price_color")?.innerHTML || "";
            const inStock = (element.querySelector(".instock") as HTMLElement)?.innerText || "";

            return {
                img,
                rating,
                title,
                price,
                inStock
            }
        }),
        url
    )

    console.log(books)

    browser.close();
}