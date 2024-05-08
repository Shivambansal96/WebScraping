// console.log("Day - 4 Web Scraping");

const axios = require("axios");
const fs = require('node:fs');
const cheerio = require('cheerio');
const xlsx = require('xlsx')
const { log } = require("node:console");

const baseURL = 'https://www.amazon.in/s?k=phones&crid=SA67H5AUHAEK&sprefix=phone%2Caps%2C351&ref=nb_sb_noss_1';
// const baseURL = 'https://www.naukri.com/it-jobs?src=gnbjobs_homepage_srch';
// const baseURL = 'https://wikipedia.org/'
// const baseURL = 'https://fakestoreapi.com/products';
// const baseURL = 'https://official-joke-api.appspot.com/jokes/ten';

const headers = {
    'content-type': 'text/html',
};

const getWebPageData = async(url) => {
    
    try {                        

            const response = await axios.get(url, {
                headers
            });

            const data = response.data;
                
            fs.writeFileSync('webPageAmazonData.txt', data);

            // console.log(data);

    }   
    
    catch(err) {
        
        console.log('Error = ', err);

    }
};

// getWebPageData(baseURL)


const getDataFromFile = () => {
    return fs.readFileSync('webPageAmazonData.txt', { encoding : 'utf-8'});
}

const pageHTMLString = getDataFromFile();

const $ = cheerio.load(pageHTMLString)

// const check = $('body');

const products = [];

const productDiv = $("div[data-asin]").each((index, element)=> {
    const productName =  $(element).find('span.a-text-normal').text();
    const productPrice =  $(element).find('span.a-price-whole').text();
    const productAvailability =  $(element).find('span.a-truncate-cut').text();
    const productRating =  $(element).find('span.a-icon-alt').text();

    // console.log(productPrice);
    console.log('Product Name:', productName);
    console.log('Product Price:', productPrice);
    console.log('Product Availability:', productAvailability ? productAvailability: 'No info');
    console.log('Product Rating:', productRating);
    console.log('\n');

    
        if(productPrice) {
                products.push({
                        Product_name: productName,
                        Products_price: 'Rs ' + productPrice,
                        Product_availability: productAvailability ? productAvailability: 'No info',
                        Product_rating: productRating,
                    })
                }
        })
        
    // console.log(productPrice);

console.log(products);

const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(products);

xlsx.utils.book_append_sheet(workbook, worksheet, 'Amazon Site Phone Data')
xlsx.writeFile(workbook, 'products.xlsx')