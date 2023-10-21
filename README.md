# xml-twig
Node module for processing huge XML documents in tree mode

Inspired by Perl module [XML::Twig](https://metacpan.org/pod/XML::Twig)


## When should I use this, motivation of this module
When you need to read a XML file, then you have two principles:

* The **Document Object Model (DOM)** style. These parser read the entire XML document into memory. Usually they provide easy methods to navigate in the document tree or make modifications. 

   DOM parsers are perfect for rather small files, for example configuration files or (X-)HTML pages. However, for bigger XML files you may run into memory limits.

* The **stream** or **event** based parsers. These parser read the XML file "line by line". The biggest advantage of such a parser is, there is no limit in the size of the XML file. You can read XML files having a size of many terabytes, because you read always just a single node. 

   The backside: By default you cannot navigate in the document tree, you know only the current node.

This module tries to combine both principles. The XML document can be read in chunks and within a chunk you have all the nice features and functions you know from a DOM based parser.

## Dependencies
XML documents are read either with [sax](https://www.npmjs.com/package/sax) or [node-expat](https://www.npmjs.com/package/node-expat) parser. More parser may be added in future releases. By default the `sax` parser is used.

**NOTE: The `node-expat` module is not automatically installed with this module. Install the parser by yourself, if you like to use it**

## Installation

Install module like any other node module and optionally `node-expat`:
```
npm install xml-twig

# and optionally 
npm install node-expat

```
In my tests I parsed a 750 MB big XML file, the `node-expat` is around two times faster than `sax` (node-expat: 2:20 Minutes, sax: 4:20 Minutes). However, you may run into problems when you try to install the `node-expat` parser. That's the reason why `node-expat` parsers is not installed automatically. 


## How to use it

#### Names and Definitions

In XML-Path, there are seven kinds of nodes: `element`, `attribute`, `text`, `namespace`, `processingInstruction`, `comment`, and `document`, see [Nodes at W3C](https://www.w3.org/TR/xpath-datamodel-31/#Node). XML documents are treated as trees of nodes.

The [Twig](./doc/twig.md#Twig) Class models a "some-kind" Element tree.  I try to follow the [XML-Path](https://www.w3.org/TR/xpath/) conventions whenever possible to avoid confusion.


#### XML-Namespaces

When the XML-Files uses [Namespaces](https://www.w3schools.com/xml/xml_namespaces.asp) then you can address the elements as they appear in the file, for example `cd:data`. 
With option `{ namespaces : true }` you will get access to the `.namespace` property.

### Read XML Document

- **Read entire XML file at once**

  This module is designed to read huge XML-Files. Of course, it works also well for small files. First create the Twig parser. Then create a Stream and pipe it to the parser.

   ```
   const fs = require('fs')
   const twig = require('xml-twig')

   function rootHandler(elt) {
      console.log(`<${elt.name}> finished after ${parser.currentLine} lines`);
   }

   const parser = twig.createParser({ tag: twig.Root, function: rootHandler }, { method: 'sax' })
   fs.createReadStream(`${__dirname}/bookstore.xml`).pipe(parser)

   // Output -> <bookstore> finished after 48 lines


   // Or use a Parser object instead of a Stream - works only with 'expat'!
   const parser = twig.createParser({ tag: twig.Root, function: rootHandler }, { method: 'expat' })
   parser.write('<html><head><title>Hello World</title></head><body><p>Foobar</p></body></html>');

   // Output -> xml finished after 1 lines
   ```

   If you prefer [events](https://nodejs.org/api/events.html), then use `event` property instead of `function` in handler declaration:

   ```
   const parser = twig.createParser({ tag: twig.Root, event: 'rootElement' }, { method: 'sax' })
   fs.createReadStream(`${__dirname}/bookstore.xml`).pipe(parser)

   parser.on('rootElement', (elt) => {
      console.log(`<${elt.name}> finished after ${parser.currentLine} lines`);
   })
   ```


- **Read XML Document in chucks**
  
  The key feature of this module is to read and process XML files in chunks. You need to create handler functions for elements you like to process.


   ```
   function bookHandler(elt) {
      console.log(`${elt.attr("category")} ${elt.name} at line ${parser.currentLine}`)
      elt.purge() // -> without `purge()` the entire XML document will be loaded into memory
   }

   // different styles: below `handle_book` are all equivalent (with sample file `bookstore.xml`)
   handle_book = [
      { tag: 'book', function: bookHandler },
      { tag: 'ebook', function: bookHandler }
   ];
   handle_book = { tag: /book$/, function: bookHandler };
   handle_book = [{
      tag: function(name, elt) { return name.endsWith('book') },
      function: bookHandler
   }];
   handle_book = [{
      tag: function(name, elt) { return ['book', 'ebook'].includes(name) },
      function: bookHandler
   }];
   handle_book = [{
      tag: function(name, elt) { return ['book', 'ebook'].includes(elt.name) },
      function: bookHandler
   }];

   const parser = twig.createParser(handle_book, { method: 'sax' })
   fs.createReadStream(`${__dirname}/bookstore.xml`).pipe(parser)

   Output: 
   
   cooking book at line 8
   children book at line 15
   fantasy ebook at line 23
   web book at line 34
   biography ebook at line 42
   web book at line 48
   ```

- **Read every element from XML Document**
  
   ```
   function anyHandler(elt) {
      console.log(`${'  '.repeat(elt.level)}${elt.name} => "${elt.text ?? ''}" at line ${parser.currentLine}`)
      elt.purge() // -> without `purge()` the entire XML document will be loaded into memory
   }

   const parser = twig.createParser({ tag: twig.Any, function: anyHandler }) 
   // or with Regular Expression -> `{ tag: /./, function: anyHandler }` 
   // or with Function -> `{ tag: () => {return true}, function: anyHandler }`
   fs.createReadStream(`${__dirname}/bookstore.xml`).pipe(parser)

   Output: 

      title => "Everyday Italian" at line 4
      author => "Giada De Laurentiis" at line 5
      year => "2005" at line 6
      price => "30.00" at line 7
   book => "" at line 8
      title => "Harry Potter" at line 10
      author => "J K. Rowling" at line 11
      year => "2005" at line 12
      price => "29.99" at line 13
   book => "" at line 14
   ... some more
   bookstore => "" at line 48

   ```

Be aware if you run methods like `elt.followingSibling()`, `elt.descendant()`, `elt.next()`, etc. on the current element. Such calls return empty result, because following element are not yet read from the XML file. You must navigate to an earlier element, e.g.<br>
`elt.root().children()[0].followingSibling()`


- **Read only parts from XML Document**

   If you like to read only certain elements, use option `partial: true`. The `root` element is always read. 

   This sample program reads the `root` element and `<ebook>` elements (include their children elements), and the branches to reach the element.

   ```
   const handle_ebook = [
      { tag: 'ebook', function: ebookHandler },
      { tag: twig.Root, function: rootHandler }
   ];
   const parser = twig.createParser(handle_ebook, { partial: true })
   fs.createReadStream(`${__dirname}/bookstore.xml`).pipe(parser);

   function ebookHandler(elt) {
      console.log(`${elt.name} at line ${parser.currentLine}`)
   }

   function rootHandler(elt) {
      console.log( elt.writer('  ').toString() );
   }


   Output:

   ebook at line 23
   ebook at line 41
   <bookstore>
     <ebook category="fantasy">
       <title lang="en">Harry Potter</title>
       <author>Joanne Kathleen Rowling</author>
       <year>2001</year>
       <price>12.99</price>
       <format>Kindle</format>
       <device>ePub</device>
     </ebook>
     <ebook category="biography">
       <title lang="en">The Autobiography of Benjamin Franklin</title>
       <author>Benjamin Franklin</author>
       <year>1996</year>
       <price>39.99</price>
       <format>Kindle</format>
       <device>ePub</device>
     </ebook>
   </bookstore>
   ```

For details and other options, see [ParserOptions](./doc/twig.md#ParserOptions) and [TwigHandler](./doc/twig.md#TwigHandler)


### Access elements and attributes

#### Get XML Attributes

`.hasAttribute(name)`: Checks if the attribute exists and returns `true` or `false`

`.attr(condition)`: Returns the value of attribute. If more than one attribute matches, then it returns all attributes as object

`.attribute(condition)`: Get attributes as object or `null` if no matching attribute was found. If `condition` is `undefined`, then all attributes are returned.

   Specify attribute name or regular expression or custom condition. For details see [AttributeCondition](./doc/twig.md#AttributeCondition).<br>
   Let's assume an XML element like this: `<person firstName="Jean-Luc", lastName="Picard", age="59" />` 

Here are some examples the get attribute and values:
```
.hasAttribute('foo')                                                   => false
.hasAttribute('age')                                                   => true

.attr('lastName')                                                      => Picard
.attr(/^first/)                                                        => Jean-Luc
.attr(/name/i)                                                         => { "firstName": "Jean-Luc", "lastName": "Picard" }
.attr(key => { return ['firstName', 'lastName'].includes(key) })       => { "firstName": "Jean-Luc", "lastName": "Picard" }

.attribute()                                                            => { "firstName": "Jean-Luc", "lastName": "Picard", "age":59 }
.attribute("FIRSTNAME")                                                 => null
.attribute("firstName")                                                 => { "firstName": "Jean-Luc" }
.attribute(/name/i)                                                     => { "firstName": "Jean-Luc", "lastName": "Picard" }

.attribute(key => { return ['firstName', 'lastName'].includes(key) }))  => { "firstName": "Jean-Luc", "lastName": "Picard" }
.attribute(key => { return key.includes('Name') }))                     => { "firstName": "Jean-Luc", "lastName": "Picard" }

.attribute((key, val) => { return key === 'age' && val > 50 }))         => { "age": 59 }
```

#### Twig Methods, accessing XML Elements

`.root()` - **Twig**: The topmost element of the tree

`.self()` - **Twig**: The current element

`.parent()` - **Twig**: The parent of the current element

`.children(condition)` - **Twig[]**: All matching children of the current element or empty array

`.next(condition)` - **Twig**: Returns the next elt (optionally matching condition) element. This is defined as the next element which opens after the current element opens. Which usually means the first child of the element. Counter-intuitive as it might look this allows you to loop through the whole document by starting from the `root`.

`.previous(condition)` - **Twig**: Return the previous elt (optionally matching condition) of the element. This is the first element which opens before the current one. It is usually either the last descendant of the previous sibling or simply the parent

`.first(condition)` - **Twig**: Returns the first (optionally matching condition) element. Usually the `root` element.

`.last(condition)` - **Twig**: Returns the last (optionally matching condition) element. Usually the last element in the document without children.

`.ancestor(condition)` - **Twig[]**: All ancestors (parent, grandparent, etc.) of the current element (optionally matching condition) or an empty array.

`.ancestorOrSelf(condition)` - **Twig[]**: All ancestors (parent, grandparent, etc.) of the current element and the current element itself (optionally matching condition) or an empty array.

`.descendant(condition)` - **Twig[]**: All descendants (children, grandchildren, etc.) of the current element (optionally matching condition) or an empty array.

`.descendantOrSelf(condition)` - **Twig[]**: All descendants (children, grandchildren, etc.) of the current element and the current element itself (optionally matching condition) or an empty array.

`.sibling(condition)` - **Twig[]**: All siblings (optionally matching condition) before and after the current element or an empty array.

`.siblingOrSelf(condition)` - **Twig[]**: All siblings (optionally matching condition) before and after the current element and the current element itself or an empty array.

`.followingSibling(condition)` - **Twig[]**: All siblings (optionally matching condition) after the current element or an empty array.

`.precedingSibling(condition)` - **Twig[]**: All siblings (optionally matching condition) before the current element or an empty array.

`.nextSibling(condition)` - **Twig**: Returns the next (optionally matching condition) sibling element. 

`.prevSibling(condition)` - **Twig**: Returns the previous (optionally matching condition) sibling element. 

`.find(condition)` - **Twig**: Find a specific element in current element and returns the first match. In principle `.descendant(condition)[0]`

`.purge()` - void: Removes the current element from tree. Usually this method is called after the element has been processed and when not needed anymore.

`.purgeUpTo(elt)` - void: Purges up to the elt element. This allows you to keep part of the tree in memory when you purge. 

`.writer(indented|xw)` - **XMLWriter**: Returns a [XMLWriter](https://www.npmjs.com/package/xml-writer) object you can use to print the currently loaded XML tree.<br>Instead of providing an indented parameter (`true`, `false` or indent character) you can also provide an `XMLWriter` object which adds more flexibility.

**condition** Parameter

You can specify condition on above methods. You can filter elements by following conditions:

- If `undefined`, then all elements are returned.

- If `string` then the element name must be equal to the string

  Example: `"book"`

- If `RegExp` then the element name must match the Regular Expression

  Example: `/book$/i`

- With `ElementConditionFilter` you can specify any custom filter function.<br>

  Example: `(name, elt) => { return name === 'book' && elt.children().length > 1 }`

- With a `Twig` object, you can specify the element directly. Apart from `purgeUpTo(elt)`, it is rarely used, because when you know the element then there is no reason to find it again.

  Example: `elt.children()[2]`


For details see [ElementCondition](./doc/twig.md#ElementCondition).

For methods which return a **Twig[]** array, a call like `elt.siblings("book")` is equal to `elt.sibling().filter( x => x.name === "book" )`

For methods which return a single **Twig** element (e.g. `elt.next("book")`) the method is executed in a loop till a `<book>` element is found.


#### Twig Properties

`.isEmpty` - **boolean**: `true` if empty. An empty element ha no text nor any child elements, however empty elements can have attributes.

`.level` - **integer**: The level of the element. Root element has 0, children have 1, grand-children 2 and so on

`.isRoot` - **boolean**: `true` for the root element

`.hasChildren` - **boolean**: `true` if the element has any child elements

`.isFirstChild` - **boolean**: `true` if the element is the first child in the parent

`.isLastChild` - **boolean**: `true` if the element is the last child in the parent

`.index` - **integer**: The postion (starting at 0) of the element within the parent. The root element returns always 0

`.name` - **string**: Name of the element/tag

`.tag` - **string**: Synonym for `name`

`.text` - **string**: The text of an element, no matter if given as CDATA entity or plain character data node (PCDATA)

`.attributes` - **object**: All attributes of the object

`.comment` - **string|string[]**: Comments or array of comments inside the element

`.declaration` - **object**: The XML-Declaration object, exist only on `root`. 

   Example  `{version: '1.0', encoding: 'UTF-8'}`. 

`.PI` - **object**: Processing Instruction, exist only on `root`. 

   Example `{ target: 'xml-stylesheet', data: 'type="text/xsl" href="style.xsl"' }`. 

`.namespace` - **object**: Namespace of the element or `null`. Only available if parsed with option `xmlns: true`. 

   Example `{ local: 'h', uri: 'http://www.w3.org/TR/html4/' }`


## Limitations

This `xml-twig` module focus on reading a XML files. In principle it would be possible to create a XML file from scratch with the [Twig](./doc/twig.md#Twig) class. However, I think there are better modules available. Of course, you may run operations like `elt.root().children().push(elt.root().children()[0])`, but I think this is not so handy to use.

Accessing Twig-Elements by [XML-Path](https://www.w3.org/TR/xpath/) language is not supported. One reason it, the `Twig` class models more an [Element](https://www.w3schools.com/xml/xml_elements.asp) rather than a [Node](https://www.w3schools.com/xml/dom_nodes.asp) which would be more generic.






