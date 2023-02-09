const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');



/////////////////////////////////////////
////////FILES//////////

// const message = 'hello get me job';
// console.log(message);

// Bloking

// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);

// const textOut = `This is what we know about avocado: ${textIn}.\nCreated On ${new Date().toUTCString()}`
// console.log(textOut);
// fs.writeFileSync('./txt/input1.txt',textOut);

// Non blocking

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         // console.log(err);
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', "gimme job of 10LPA", 'utf-8', err => {
//                 console.log('Task for AI is given');
//             })
//         })
//     })
// })
// console.log("Will Read File!");
// nofunc("hello","NodataFound");

// function nofunc(err,data){
//     console.log(data);
// }

/////////////////////////////////////
/////SERVER


const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
  );
  const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
  );
  const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
  );


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true}))

console.log(slugs);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

          const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
          const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
          res.end(output);
        // res.end(tempOverview);

        // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
          const product = dataObj[query.id];
          const output = replaceTemplate(tempProduct, product);
          res.end(output);

        // res.end("This is Product");


        // API
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
          res.end(data);



        // Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
})

server.listen(3001, '127.0.0.1', () => {
    console.log("listening on port 3001");
})

