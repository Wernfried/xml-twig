const fs = require('fs');
const twig = require('./twig.js');


//const parser = twig.createParser({ tag: twig.Any, function: anyHandler }, { method: "sax" });
//const parser = twig.createParser({ tag: twig.Any, function: anyHandler }, { method: "expat" });
//const parser = twig.createParser({ tag: twig.Any, function: anyHandler }, { method: "saxophone" });
//fs.createReadStream(`${__dirname}/samples/bookstore.xml`).pipe(parser);
//fs.createReadStream(`${__dirname}/samples/breakfast-menu.xml`).pipe(parser);

//const parser = twig.createParser({ tag: twig.Any, function: nsHandler }, { method: "sax", xmlns: true });
//const parser = twig.createParser({ tag: twig.Any, function: nsHandler }, { method: "expat", xmlns: true });
//const parser = twig.createParser({ tag: twig.Any, function: nsHandler }, { method: "saxophone", xmlns: true });
//fs.createReadStream(`${__dirname}/samples/xmlns.xml`).pipe(parser);

//const parser = twig.createParser({ tag: twig.Root, function: piHandler }, { method: "sax" });
//const parser = twig.createParser({ tag: twig.Root, function: piHandler }, { method: "expat" });
//const parser = twig.createParser({ tag: twig.Root, function: piHandler }, { method: "saxophone" });
//fs.createReadStream(`${__dirname}/samples/processingInstruction.xml`).pipe(parser);


//fs.createReadStream(`${__dirname}/samples/encoding-UTF-8.xml`).pipe(parser);
//fs.createReadStream(`${__dirname}/samples/encoding-UTF-16LE.xml`).pipe(parser);
//fs.createReadStream(`${__dirname}/samples/encoding-UTF-16BE.xml`).pipe(parser);


function anyHandler(elt) {
   console.log(`<${elt.name}> => ${elt.text} -> ${JSON.stringify(elt.attributes)}`);
}


function nsHandler(elt) {
   console.log(`${elt.name} => ${JSON.stringify(elt.namespace)} -> ${JSON.stringify(elt.attributes)}`);
   //console.log(`${elt.name} => isRoot = ${elt.isRoot}`);
   //console.log(`${elt.name} -> ${JSON.stringify(elt.PI)}`);
   //console.log(`${elt.name}`);
}

function piHandler(elt) {
   console.log(`${elt.name} -> ${JSON.stringify(elt.PI)}`);
}


