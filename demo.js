const fs = require('fs');




//const expatParser = require('./twig.js').createParser(handler, { method: 'sax' });
const parser = require('./twig.js').createParser(
   [
      { name: 'book', function: handler },
      { name: /book/i, function: handler },
      { includes: 'book', function: handler }
   ],
   { method: 'sax' });
fs.createReadStream(`${__dirname}/samples/bookstore.xml`).pipe(parser);

//const saxParser = require('./twig.js').createParser(handler, { method: 'sax' })
//fs.createReadStream(`${__dirname}/samples/bookstore.xml`).pipe(saxParser);


//const parser = require('./twig.js').createParser(handler)
//fs.createReadStream(`${__dirname}/samples/bookstore.xml`).pipe(parser);



function handler(tree, elt) {
   console.log("Done");
   console.log(tree.name);
   console.log(tree.currentLine);
}



/*
const obj = new Elt('tag', null, { firstName: 'Jean-Luc', lastName: 'Picard', age: 59 });
console.log(`attribute => ${JSON.stringify(obj.attribute())}`);
console.log(`attribute("FIRSTNAME") => ${JSON.stringify(obj.attribute("FIRSTNAME"))}`);
console.log(`attribute("firstName") => ${JSON.stringify(obj.attribute("firstName"))}`);
console.log(`attribute({includes: 'Name'}) => ${JSON.stringify(obj.attribute({ includes: 'Name' }))}`);
console.log(`attribute({includes: 'name'}) => ${JSON.stringify(obj.attribute({ includes: 'name' }))}`);
console.log(`attribute => ${JSON.stringify(obj.attribute((attr, val) => { return attr === 'age' && val > 50 }))}`);
console.log(`attribute(/name/i) => ${JSON.stringify(obj.attribute(/name/i))}`);
*/