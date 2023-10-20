const fs = require('fs');
const process = require('process');

const parser = require('xml-twig').createParser({ name: /book$/, function: bookHandler }, { method: 'sax' })
fs.createReadStream(`${__dirname}/../samples/bookstore.xml`).pipe(parser)


function bookHandler(elt) {
   console.log(`${elt.attr("category")} ${elt.name} at line ${elt.line}`)
   elt.purge()
}


function rootHandler(elt) {
   console.log(`${elt.name} finished after ${elt.line} lines`);
}


