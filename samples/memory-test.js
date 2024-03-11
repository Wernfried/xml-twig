const fs = require('fs');
const process = require('process');
const twig = require('xml-twig');

let Entry = 0;

let parser = twig.createParser([{ tag: 'Entry', function: EntryHandler }], { method: 'expat' })
// http://aiweb.cs.washington.edu/research/projects/xmltk/xmldata/data/SwissProt/SwissProt.xml.gz
// For more files see http://aiweb.cs.washington.edu/research/projects/xmltk/xmldata/www/repository.html
let reader = fs.createReadStream(`SwissProt.xml`);
reader.pipe(parser);

function EntryHandler(elt) {
   Entry++;
   if (Entry % 10000 === 0) {
      console.log(`Entry ${Entry}`)
      let len = elt.root().writer().toString().length;
      len = Math.round((len / 1024 / 1024 + Number.EPSILON) * 100) / 100;
      console.log(`Size of XML string: ${len} MiB`);
      for (const [key, value] of Object.entries(process.memoryUsage())) {
         console.log(`   Memory usage by ${key}, ${Math.round((value / 1024 / 1024 + Number.EPSILON) * 100) / 100} MiB`)
      }
   }   
}



/*
**********************
* Results
**********************

# Set memory limit to 4GiB for demonstration reasons:
NODE_OPTIONS=--max-old-space-size=4096

Entry 10000
Size of XML string: 21.08 MiB
   Memory usage by rss, 1897.36 MiB
   Memory usage by heapTotal, 1855.68 MiB
   Memory usage by heapUsed, 1807.43 MiB
   Memory usage by external, 1.13 MiB
   Memory usage by arrayBuffers, 0.7 MiB

Entry 20000
Size of XML string: 40.86 MiB
   Memory usage by rss, 3615.75 MiB
   Memory usage by heapTotal, 3562.62 MiB
   Memory usage by heapUsed, 3482.97 MiB
   Memory usage by external, 0.63 MiB
   Memory usage by arrayBuffers, 0.2 MiB

<--- Last few GCs --->

[18648:000001F930FC8F90]    13906 ms: Scavenge 4047.7 (4123.2) -> 4047.3 (4133.7) MB, 3.4 / 0.0 ms  (average mu = 0.332, current mu = 0.185) allocation failure;
[18648:000001F930FC8F90]    13916 ms: Scavenge 4054.1 (4133.7) -> 4053.8 (4135.2) MB, 4.0 / 0.0 ms  (average mu = 0.332, current mu = 0.185) allocation failure;
[18648:000001F930FC8F90]    13925 ms: Scavenge 4055.1 (4135.2) -> 4054.3 (4156.2) MB, 8.3 / 0.0 ms  (average mu = 0.332, current mu = 0.185) allocation failure;


<--- JS stacktrace --->

FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
 1: 00007FF604481C7F node_api_throw_syntax_error+175855
 2: 00007FF604406476 EVP_MD_meth_get_input_blocksize+59654
 3: 00007FF604408160 EVP_MD_meth_get_input_blocksize+67056
 4: 00007FF604EB0434 v8::Isolate::ReportExternalAllocationLimitReached+116
 5: 00007FF604E9B7C2 v8::Isolate::Exit+674
 6: 00007FF604D1D65C v8::internal::EmbedderStackStateScope::ExplicitScopeForTesting+124
 7: 00007FF604D1A87B v8::internal::Heap::CollectGarbage+3963
 8: 00007FF604D30AB3 v8::internal::HeapAllocator::AllocateRawWithLightRetrySlowPath+2099
 9: 00007FF604D3135D v8::internal::HeapAllocator::AllocateRawWithRetryOrFailSlowPath+93
10: 00007FF604D40B20 v8::internal::Factory::NewFillerObject+816
11: 00007FF604A31565 v8::internal::DateCache::Weekday+1349
12: 00007FF604F4D961 v8::internal::SetupIsolateDelegate::SetupHeap+558193
13: 00007FF5B03D1532

*/

