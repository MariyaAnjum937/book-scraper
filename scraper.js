const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const {Parser} = require('json2csv');


// define the URL that you want to scrape

const START_URL = "https://books.toscrape.com/"

// create an async function that sends a request to that page

async function scrapePage(url){
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const books = [];
    $("article.product_pod").each((_, el) => {
        books.push({
            title: $(el).find("h3 a").attr("title"),
            price: $(el).find(".price_color").text().trim(),
            availability: $(el).find(".availability").text().trim(),
            rating: $(el).find(".star-rating").attr("class")
        });
    });

    fs.writeFileSync("books.json", JSON.stringify(books, null, 2));

    const parser = new Parser();
    const csv = parser.parse(books);
    fs.writeFileSync("books.csv", csv);

    return books;
}

scrapePage(START_URL)
    .then((books) => {
        console.log(books);
    })
    .catch((error) => {
        console.error("Scraping failed:", error.message);
    });