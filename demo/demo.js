const fs = require('fs');
const twig = require('../twig.js');


function rootHandler(elt) {
   console.log(`<${elt.name}> finished after ${parser.currentLine} lines`);
}

//parser = twig.createParser({ element: twig.Root, handler: rootHandler }, { method: 'sax' })
//fs.createReadStream(`${__dirname}/../samples/bookstore.xml`).pipe(parser)


//parser = twig.createParser({ element: twig.Root, handler: rootHandler }, { method: 'expat' })
//parser.write('<html><head><title>Hello World</title></head><body><p>Foobar</p></body></html>');



function bookHandler(elt) {
   console.log(`${elt.attr("category")} ${elt.name} at line ${parser.currentLine}`)
   elt.purge() // -> without `purge()` the entire XML document will be loaded into memory
}


handle_book = [
   { element: 'book', handler: bookHandler },
   { element: 'ebook', handler: bookHandler }
];
handle_book = [
   { element: /book$/, handler: bookHandler }
];
handle_book = [{
   element: function(name, elt) { return name.endsWith('book') },
   handler: bookHandler
}];
handle_book = [{
   element: function(name, elt) { return ['book', 'ebook'].includes(name) },
   handler: bookHandler
}];
handle_book = [{
   element: function(name, elt) { return ['book', 'ebook'].includes(elt.name) },
   handler: bookHandler
}];

parser = twig.createParser(handle_book, { method: 'sax' })
fs.createReadStream(`${__dirname}/../samples/bookstore.xml`).pipe(parser)







