const { DateTime } = require('luxon');
const fs = require('fs');
const twig = require('../twig.js');

let NE = 0;
const startTime = DateTime.now();

let parser = twig.createParser([{ tag: 'subsession', function: anyHandler }], { method: process.argv[2] })
let reader = fs.createReadStream(`${__dirname}/20240304015234.9-MSRAN.xml`);
console.log(`Starting with ${parser.method}...`)
reader.pipe(parser);

function anyHandler(elt) {
   NE++;
   if (NE % 25 === 0) {
      let d = DateTime.now().diff(startTime);
      console.log(`\t${NE} NE in ${d.toFormat('mm:ss.S')}`);
   }
   elt.purge();
}

reader.on('end', () => {
   let d = DateTime.now().diff(startTime);
   console.log(`All done with ${parser.method} in ${d.toFormat('mm:ss.S')}`);
});



/*
**********************
* Results
**********************

All done with expat in 02:52.676
All done with expat in 02:53.644
All done with expat in 02:54.894
All done with expat in 03:02.545
All done with expat in 03:23.34

All done with sax in 04:28.915
All done with sax in 04:05.760
All done with sax in 04:06.718
All done with sax in 04:03.962
All done with sax in 03:54.540

All done with saxophone in 02:12.565
All done with saxophone in 02:10.86
All done with saxophone in 02:13.447
All done with saxophone in 02:12.14
All done with saxophone in 02:08.658

Good old Perl XML::Twig
All done in 9:24

*/
