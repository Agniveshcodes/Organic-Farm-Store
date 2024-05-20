const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');
const slugify = require('slugify');
const replacePlaceHolder = require('./replace');
const replaceProductCard = require('./replaceCard')

const name = 'Rohit page';
const image =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ86U5achMelt_m38QlJfvO_ErE7Yrkycw0MQ&usqp=CAU';

let output;

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-Card.html`,
  'utf-8'
);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const tempProductCard = fs.readFileSync(
  `${__dirname}/templates/template-productCard.html`,
  'utf-8'
);

const tempPractise = fs.readFileSync(
  `${__dirname}/templates/template-practise.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const cardHtml = dataObj
      .map((el) => replacePlaceHolder(tempCard, el))
      .join();
    const overviewHtml = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);

    res.end(overviewHtml);
  }

  // product
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const productId = dataObj[query.id];
    const productHtml = replacePlaceHolder(tempProduct, productId);

    res.end(productHtml);
  }

  // practise
  else if (pathname === '/practise') {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    let output = dataObj.map(function (el) {
      return replaceProductCard(tempProductCard, el)
    }).join('');

    let productCard = tempPractise.replace('{product_card}' , output)

    res.end(productCard);
  }

  // api
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  }

  // error
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`<img src=${image} alt="">`);
  }
});

server.listen(8080, '127.0.0.1', () => {
  console.log('server started');
});
