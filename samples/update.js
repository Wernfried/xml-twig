const fs = require('fs');
const twig = require('../twig.js');


function bookHandler(elt) {
   if (elt.attr('category') == 'fantasy') {
      console.log(elt.writer(true).toString());
      let t = elt.addElement('newTag', 'some Text > more', null);
      console.log(t.writer(true).toString());
      console.log(elt.root().writer(true).toString());
   }
}

parser = twig.createParser({ tag: 'ebook', function: bookHandler })
fs.createReadStream(`${__dirname}/bookstore.xml`).pipe(parser)

