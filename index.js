// 7. Using Modules 1: Core Modules

// module to read files (Ses 8)
const fs = require("fs"); //File System

// module for Server Protocol (Ses 11)
const http = require("http");

// module for Routing (Ses 12)
const url = require("url");

// now we can do things like reading files from the file system -> to do so we need a Node Module
// NodeJS is built around this concept of modules -> all kinds of aditional functionality is stored in a module
// We do require them into our code and then store it in a variable

// Node Modules Documentation are very important: how to look them up: nodejs.org -> Docs -> Choose Version -> on left side you will find all relevant modules

// 8. Reading and Writing Files
//the read File Sync functions takes two arguments (path, character encoding) -> if dont declare second argument it gives us a Buffer
// Shortcut Backslash: ⌥ + ⇧ + 7
// \n = new Line

// const textIn = fs.readFileSync("./starter/txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

// fs.writeFileSync("./starter/txt/output.txt", textOut); //(Path, What you want to write into the File)
// console.log("File written"); //created a file to directory

// 10-Reading and Writing Files Asynchronously (Non-Blocking)

// fs.readFile("./startesfgfr/txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR!");
//   fs.readFile(`./starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./starter/txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "/starter/txt/final.txt",
//         `${data2}\n${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("Your File has been written");
//         }
//       );
//     });
//   });
// });

// 11-Creating a simple web server

// const server = http.createServer((req, res) => {
//   console.log(req);
//   res.end("hello from the server!"); // each time the server hits a new request, the callbackfunction will be called, wich has acces to the request object
// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("Listening to requests on port 8000");
// });

// 12. Routing
//Routing means implementing diferrent actions for different URLs

// const server = http.createServer((req, res) => {
//   console.log(req.url);
//   const pathName = req.url;
//   if (pathName === "/" || pathName === "/overview") {
//     res.end("This is the OVERVIEW");
//   } else if (pathName === "/product") {
//     res.end("This is the PRODUCT");
//   } else {
//     res.writeHead(404, {
//       "Content-type": "text/html",
//       "my-own-header": "hello world",
//     }); // HTTP Header is a piece of information about the response we are sending back
//     res.end("<h6>404 Page not Found</h6>");
//   }
// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("Listening to requests on port 8000");
// });

// 13. Building a (Very) simple API
// An API is like an service where we can request data

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENtS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  "utf-8"
);

const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(output);

    //Product Page
  } else if (pathname === "/product/") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === "/api") {
    const productData = JSON.parse(data);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);

    //Not Found Page
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    }); // HTTP Header is a piece of information about the response we are sending back
    res.end("<h6>404 Page not Found</h6>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});

// All Node.js scripts get access to a variable called dirname,
// and this variable always translates to the directory in which the script that we are currently executing is located

// 14. HTML Templating: Building the Templates
