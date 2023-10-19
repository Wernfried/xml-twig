const fs = require('fs');

const handle_entire_file = rootHandler;

const handle_every_element = { function: anyHandler };

const handle_book = [
   { name: 'book', function: bookHandler },
   { name: 'ebook', function: bookHandler }
];



//const handle_ebook = [{ name: 'ebook', function: ebookHandler }];
const parser = require('./twig.js').createParser(bookHandler, { method: 'sax' })
fs.createReadStream(`${__dirname}/samples/bookstore.xml`).pipe(parser);


// partial load
// purge-up-to
// accessort

function bookHandler(elt) {
   console.log(`${elt.name} finished after ${elt.line} lines`);
   //console.log(`${elt.name} -> ${elt.index}`)
   let w = elt.root().writer(true);
   let t = elt.children();
   let tt = elt.children("ebook");
   let ttt = elt.children((x, elt) => { return elt.name === 'ebook' });

   console.log(elt.root().writer(true).toString());
   //elt.purge();
   console.log(elt.root().writer(true).toString());

}



function rootHandler(elt) {
   console.log(`<${elt.name}> finished after ${elt.line} lines`);
}

function anyHandler(elt) {
   console.log(`${'  '.repeat(elt.level)}${elt.name} => "${elt.text ?? ''}" at line ${elt.line}`);
}



/*

const twig = require('./twig.js');



const obj = new twig.Twig('tag', null, { firstName: 'Jean-Luc', lastName: 'Picard', age: 59 });

console.log(obj.attr('lastName'));
console.log(obj.attr(attr => { return ['firstName', 'lastName'].includes(attr) }));
console.log(obj.attr('lastName'));
console.log(obj.attr('lastName'));

/*
elt.hasAttribute('foo')                                                     => false
elt.hasAttribute('age')                                                     => true
elt.attr('lastName')                                                        => Picard

elt.attribute()                                                              => { "firstName": "Jean-Luc", "lastName": "Picard", "age":59 }
elt.attribute("FIRSTNAME")                                                   => null
elt.attribute("firstName")                                                   => { "firstName": "Jean-Luc" }

elt.attribute(attr => { return ['firstName', 'lastName'].includes(attr) }))  => { "firstName": "Jean-Luc", "lastName": "Picard" }
elt.attribute(attr => { return attr.includes('Name') }))                     => { "firstName": "Jean-Luc", "lastName": "Picard" }
elt.attribute(/name/i) => { "firstName": "Jean-Luc", "lastName": "Picard" }  => { "firstName": "Jean-Luc", "lastName": "Picard" }

elt.attribute((attr, val) => { return attr === 'age' && val > 50 }))         => { "age": 59 }
*/
