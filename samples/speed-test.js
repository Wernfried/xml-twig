const fs = require('fs');
const path = require('path');
const twig = require('../twig.js');
const { pipeline } = require('stream/promises');
const { DateTime } = require('luxon');

let NE = 0;
let startTime = DateTime.now();
let printNE = true;

function anyHandler(elt) {
   NE++;
   if (printNE && NE % 25 === 0) {
      let d = DateTime.now().diff(startTime);
      console.log(`\t${NE} NE in ${d.toFormat('mm:ss.S')}`);
   }
   elt.purge();
}

async function parse(method) {
   const parser = twig.createParser([{ tag: 'subsession', function: anyHandler }], { method: method })
   const reader = fs.createReadStream(`${__dirname}/20240304015234.9-MSRAN.xml`);

   NE = 0;
   startTime = DateTime.now();
   await pipeline(reader, parser);
   let d = DateTime.now().diff(startTime);
   console.log(`Finished with ${method} in ${d.toFormat('mm:ss.S')}`);
   printNE = false;
}

const main = async () => {

   for (let method of ["sax", "expat"]) {
      console.log(`Running with ${method}...`);
      printNE = true;
      for (let i = 0; i <= 5; i++)
         await parse(method);
   }
}

main();


/*
**********************
* Results
**********************

Running with sax...
	25 NE in 00:21.260
	50 NE in 00:46.36
	75 NE in 01:08.314
	100 NE in 01:36.5
	125 NE in 02:11.869
	150 NE in 02:49.940
	175 NE in 03:15.653
Finished with sax in 03:37.656
Finished with sax in 03:41.884
Finished with sax in 03:45.146
Finished with sax in 03:42.84
Finished with sax in 03:57.614
Finished with sax in 03:42.634

Running with expat...
	25 NE in 00:15.746
	50 NE in 00:33.605
	75 NE in 00:48.993
	100 NE in 01:07.777
	125 NE in 01:32.327
	150 NE in 01:59.544
	175 NE in 02:17.560
Finished with expat in 02:33.545
Finished with expat in 02:32.371
Finished with expat in 02:39.785
Finished with expat in 02:33.270
Finished with expat in 02:33.231
Finished with expat in 02:38.269


Good old Perl XML::Twig
	25 NE in 1:14
	50 NE in 2:03
	75 NE in 3:43
	100 NE in 5:02
	125 NE in 6:12
	150 NE in 7:16
	175 NE in 8:17
	200 NE in 9:24
Finished with perl in 9:24

*/
