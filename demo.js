const fs = require('fs');


//const handle_ebook = [{ name: 'ebook', function: ebookHandler }];
const parser = require('./twig.js').createParser(rootHandler, { method: 'sax' })
fs.createReadStream(`${__dirname}/samples/bookstore.xml`).pipe(parser);


// partial load
// purge-up-to
// accessort

function anyHandler(elt) {
   console.log(`${elt.name} -> ${elt.isFirstChild} ${elt.isLastChild} at line ${elt.line}`)
}



function rootHandler(elt) {
   let f;
   let el = elt.first();
   while (el !== null) {
      //console.log(`<${el.name}> ${el.name} at line ${el.line}`);
      if (el.line === 21) {
         f = el;
         break;
      }
      el = el.next();
   }

   let rr = el.find(f);
   console.log(`<${rr.name}> ${rr.name} at line ${rr.line}`);


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
