const fs = require("fs");
const http = require('http');
const url = require('url');



///////////////////////////////////
// Files Readng And Writing 

// Synchronous way to read file and write file node.js

// const text = fs.readFileSync('./txt/input.txt' , 'utf-8')
// console.log(text);

// const addText = `this is what we know about avacados . ${text}.\nCreated on ${Date.toString()}`
// fs.writeFileSync('./txt/output.txt' , addText)
// console.log('File Written')

// const outPutTxt = fs.readFileSync('./txt/output.txt' , 'utf-8')
// console.log(outPutTxt)

// const read_this_text = `The avoado is aldee used as ythe base for the mexiacn dip knan as guacamole, as well as a sprad or corn totillas or toast, served witj spices.`

// fs.writeFileSync('./txt/read-this.txt', read_this_text )
// console.log("adding file text")


// Asynchoronous way to Read and Add file in node.js

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("writing changes😐🙄");
//       });
//     });
//   });
// });


/////////////////////////////////////////
// Server

function replaceTemplate (template , product){
        let output = template.replace(/{%PRODUCTNAME%}/g , product.productName);
        output = output.replace(/{%IMAGE%}/g , product.image);
        output = output.replace(/{%PRICE%}/g , product.price);
        output = output.replace(/{%NUTRIENTS%}/g , product.nutrients);
        output = output.replace(/{%FROM%}/g , product.from);
        output = output.replace(/{%QUANTITY%}/g , product.quantity);
        output = output.replace(/{%DESCRIPTION%}/g , product.description);
        output = output.replace(/{%ID%}/g , product.id);

        if(!product.organic){
            output = output.replace(/{%NOT_ORGANIC%}/g , 'not-organic');
        }
        return output;
}


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html` , 'utf-8') 
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html` , 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html` , 'utf-8')

const apiData = fs.readFileSync(`${__dirname}/dev-data/data.json` , 'utf-8')
const dataObj = JSON.parse(apiData)


const myServer = http.createServer((req , res ) => {
    console.log(req.url)
    console.log(url.parse(req.url , true))
    const pathName = req.url;

    if(pathName === '/' || pathName === '/overview'){
        res.writeHead(200 , {
            'Content-type' : "text/html" ,
        })

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard , el)).join('');
        const replaceHtml = tempOverview.replace('{%PRODUCT_CARDS%}' , cardsHtml)

        res.end(replaceHtml)
        

    }else if (pathName === '/product'){
  
        res.end('this is product')
    }else if(pathName === '/api'){
        res.writeHead(200 , {
            'Content-type' : "application/json" ,
        })
        res.end(apiData)
    }else {
        res.writeHead(404 , {
            'Content-type' : "text/html" ,
            'my-own-headers' : "Hello World"
        })
        res.end(`<h1> Page not found </h1>`)
    }

});

myServer.listen(8000 , '127.0.0.1' , ()=>{
    console.log("Server Start Listening")
})





