const fs = require('fs');
const twig = require('../twig.js');

/*
// Sample 1.1
function rootHandler(elt) {
   console.log(`<${elt.name}> finished after ${parser.currentLine} lines`);
}

parser = twig.createParser({ tag: twig.Root, function: rootHandler }, { method: 'sax' })
fs.createReadStream(`${__dirname}/bookstore.xml`).pipe(parser)


// Sample 1.2
parser = twig.createParser({ tag: twig.Root, function: rootHandler }, { method: 'expat' })
/parser.write('<html><head><title>Hello World</title></head><body><p>Foobar</p></body></html>');


// Sample 2
parser = twig.createParser({ tag: twig.Root, event: 'rootElement' }, { method: 'sax' })
fs.createReadStream(`${__dirname}/bookstore.xml`).pipe(parser)

parser.on('rootElement', (elt) => {
   console.log(`<${elt.name}> finished after ${parser.currentLine} lines`);
})



// Sample 3
function bookHandler(elt) {
   console.log(`${elt.attr("category")} ${elt.name} at line ${parser.currentLine}`)
   elt.purge() // -> without `purge()` the entire XML document will be loaded into memory
}

handle_book = [
   { tag: 'book', function: bookHandler },
   { tag: 'ebook', function: bookHandler }
];
handle_book = [
   { tag: /book$/, function: bookHandler }
];
handle_book = [{
   tag: function (name, elt) { return name.endsWith('book') },
   function: bookHandler
}];
handle_book = [{
   tag: function (name, elt) { return ['book', 'ebook'].includes(name) },
   function: bookHandler
}];
handle_book = [{
   tag: function (name, elt) { return ['book', 'ebook'].includes(elt.name) },
   function: bookHandler
}];

parser = twig.createParser(handle_book, { method: 'sax' })
fs.createReadStream(`${__dirname}/bookstore.xml`).pipe(parser)



// Sample 4
function anyHandler(elt) {
   console.log(`${'  '.repeat(elt.level)}${elt.name} => "${elt.text ?? ''}" at line ${parser.currentLine}`)
   elt.purge() // -> without `purge()` the entire XML document will be loaded into memory
}

parser = twig.createParser({ tag: twig.Any, function: anyHandler }) 
// or with Regular Expression: `{ tag: tag: /i/, function: anyHandler }` 
// or with Function: `{ tag: () => {return true}, function: anyHandler }`
fs.createReadStream(`${__dirname}/bookstore.xml`).pipe(parser)
*/

// Sample 5
const handle_ebook = [
   { tag: 'ebook', function: ebookHandler },
   { tag: twig.Root, function: rootHandler }
];
const parser = twig.createParser(handle_ebook, { partial: true })
fs.createReadStream(`${__dirname}/bookstore.xml`).pipe(parser);

function ebookHandler(elt) {
   //console.log(`${elt.name} at line ${parser.currentLine}`)
}

function rootHandler(elt) {
   console.log( elt.writer('  ').toString() );
}


