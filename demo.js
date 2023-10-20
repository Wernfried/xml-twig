const fs = require('fs');


//const handle_ebook = [{ name: 'ebook', function: ebookHandler }];
//const parser = require('./twig.js').createParser({function:anyHandler}, { method: 'sax' })
//const parser = require('./twig.js').createParser(rootHandler, { method: 'sax'})

const parser = require('./twig.js').createParser([
   { name: 'ebook', function: anyHandler }
], { method: 'sax', partial: true })

fs.createReadStream(`${__dirname}/samples/bookstore.xml`).pipe(parser);


// partial load
// purge-up-to
// accessort

function anyHandler(elt) {   
   console.log( elt.root().writer('  ').toString());
   elt.purge();
}



function rootHandler(elt) {  
  
   console.log( elt.writer(true).toString());


/*
   let el = elt.last();
   while (el !== null) {
      console.log(`${el.name} -> ${el.text} at line ${el.line}`);
      el = el.previous();
   }
*/

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
