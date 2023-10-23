const fs = require('fs');
const twig = require('./twig.js');


const parser = twig.createParser({ tag: 'book', event: 'bookElement' });
fs.createReadStream(`${__dirname}/samples/bookstore.xml`).pipe(parser);


parser.on('bookElement', (elt) => {
   console.log(`<${elt.name}> finished after ${parser.currentLine} lines`);
}) 

