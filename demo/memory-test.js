const fs = require('fs');
const process = require('process');

let NE = 0;
console.log('Starting...')
let parser = require('xml-twig').createParser([{ name: 'subsession', function: anyHandler }], { method: 'expat' })
let reader = fs.createReadStream(`${__dirname}/../samples/20231019015552.1-MSRAN.xml`);
reader.pipe(parser);

function anyHandler(elt) {
   NE++;
   if (NE % 5 === 0) {
      for (const [key, value] of Object.entries(process.memoryUsage())) {
         console.log(`   Memory usage by ${key}, ${Math.round((value / 1024 / 1024 + Number.EPSILON) * 100) / 100} MiB`)
      }
   }
   //elt.purge();
}

reader.on('end', () => {
   console.log(`All done`);
});



/*
**********************
* Results
**********************

NODE_OPTIONS=--max-old-space-size=4096

5 NE
   Memory usage by rss, 1070.65 MiB
   Memory usage by heapTotal, 1025.37 MiB
   Memory usage by heapUsed, 989.72 MiB
   Memory usage by external, 1.24 MiB
   Memory usage by arrayBuffers, 0.83 MiB
10 NE
   Memory usage by rss, 2816.7 MiB
   Memory usage by heapTotal, 2760.62 MiB
   Memory usage by heapUsed, 2690.95 MiB
   Memory usage by external, 1.42 MiB
   Memory usage by arrayBuffers, 1.02 MiB

<--- Last few GCs --->

[6508:00000223570D04D0]    20692 ms: Scavenge 4034.0 (4122.1) -> 4032.4 (4135.1) MB, 13.7 / 0.0 ms  (average mu = 0.431, current mu = 0.348) allocation failure;
[6508:00000223570D04D0]    23749 ms: Mark-sweep 4046.7 (4135.1) -> 4044.6 (4150.4) MB, 3030.4 / 0.0 ms  (average mu = 0.250, current mu = 0.055) allocation failure; scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
 1: 00007FF7BCDB9E7F node_api_throw_syntax_error+175967
 2: 00007FF7BCD40C06 SSL_get_quiet_shutdown+65750
 3: 00007FF7BCD41FC2 SSL_get_quiet_shutdown+70802
 4: 00007FF7BD7DA214 v8::Isolate::ReportExternalAllocationLimitReached+116
 5: 00007FF7BD7C5572 v8::Isolate::Exit+674
 6: 00007FF7BD6473CC v8::internal::EmbedderStackStateScope::ExplicitScopeForTesting+124
 7: 00007FF7BD6445EB v8::internal::Heap::CollectGarbage+3963
 8: 00007FF7BD65A823 v8::internal::HeapAllocator::AllocateRawWithLightRetrySlowPath+2099
 9: 00007FF7BD65B0CD v8::internal::HeapAllocator::AllocateRawWithRetryOrFailSlowPath+93
10: 00007FF7BD66A903 v8::internal::Factory::NewFillerObject+851
11: 00007FF7BD35BEB5 v8::internal::DateCache::Weekday+1349
12: 00007FF7BD8778B1 v8::internal::SetupIsolateDelegate::SetupHeap+558193
13: 00007FF73D9F10A1


*/

