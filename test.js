const fs = require('fs');
const path = require('path');
const twig = require('./twig.js');
const { pipeline } = require('stream/promises');

async function parse(file, handler, options) {
   const parser = twig.createParser(handler, options);
   const reader = fs.createReadStream(file);
   console.log(`Start parsing of ${path.basename(file)} with ${options.method}`);
   await pipeline(reader, parser);
   console.log(`Parsing ${path.basename(file)} done`);
}

//const parser = twig.createParser({ tag: twig.Root, function: anyHandler }, { method: 'sax' });
//fs.createReadStream(`${__dirname}/samples/bookstore.xml`).pipe(parser);


//fs.createReadStream(`${__dirname}/samples/encoding-UTF-8.xml`).pipe(parser);
//fs.createReadStream(`${__dirname}/samples/encoding-UTF-16LE.xml`).pipe(parser);
//fs.createReadStream(`${__dirname}/samples/encoding-UTF-16BE.xml`).pipe(parser);

function anyHandler(elt) {
   console.log(`<${elt.name}> => ${elt.text} -> ${JSON.stringify(elt.attributes)}`);
}

function nsHandler(elt) {
   console.log(`${elt.name} => ${JSON.stringify(elt.namespace)} -> ${JSON.stringify(elt.attributes)}`);
}

function piHandler(elt) {
   console.log(`${elt.name} -> ${JSON.stringify(elt.PI)}`);
}


const main = async () => {

   for (let file of ["bookstore", "breakfast-menu"]) {
      for (let method of ["sax", "expat"])
         await parse(`${__dirname}/samples/${file}.xml`, { tag: twig.Any, function: anyHandler }, { method: method });
   }

   for (let method of ["sax", "expat"])
      await parse(`${__dirname}/samples/xmlns.xml`, { tag: twig.Any, function: nsHandler }, { method: method, xmlns: true });

   for (let method of ["sax", "expat"])
      await parse(`${__dirname}/samples/processingInstruction.xml`, { tag: twig.Root, function: piHandler }, { method: method });

}

main();

