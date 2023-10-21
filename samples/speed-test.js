const { DateTime } = require('luxon');
const startTime = DateTime.now();
const fs = require('fs');
const twig = require('xml-twig');

let NE = 0;
console.log('Starting...')
let parser = twig.createParser([{ tag: 'subsession', function: anyHandler }], { method: 'expat' })
let reader = fs.createReadStream(`${__dirname}/20231019015552.1-MSRAN.xml`);
reader.pipe(parser);

function anyHandler(elt) {
   NE++;
   if (NE % 25 === 0) {
      let d = DateTime.now().diff(startTime);
      console.log(`${NE} NE in ${d.toFormat('mm:ss.S')}`);
   }
   elt.purge();
}

reader.on('end', () => {
   let d = DateTime.now().diff(startTime);
   console.log(`All done in ${d.toFormat('mm:ss.S')}`);
});



/*
**********************
* Results
**********************

Node.js with expat:
	25 NE in 00:16.321
	50 NE in 00:27.867
	75 NE in 00:52.757
	100 NE in 01:11.297
	125 NE in 01:29.996
	150 NE in 01:46.358
	175 NE in 02:02.486
	200 NE in 02:21.25
All done in 02:21.31

Node.js with sax:
	25 NE in 00:32.988
	50 NE in 00:53.964
	75 NE in 01:38.18
	100 NE in 02:12.977
	125 NE in 02:47.781
	150 NE in 03:17.601
	175 NE in 03:48.676
	200 NE in 04:22.523
All done in 04:22.528


Good old Perl XML::Twig
	25 NE in 1:14
	50 NE in 2:03
	75 NE in 3:43
	100 NE in 5:02
	125 NE in 6:12
	150 NE in 7:16
	175 NE in 8:17
	200 NE in 9:24
All done in 9:24

*/
