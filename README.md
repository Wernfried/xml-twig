# xml-twig
Node module for processing huge XML documents in tree mode

Designed with node in mind, but should work fine in the browser or other CommonJS implementations.

Inspired by Perl module [XML::Twig](https://metacpan.org/pod/XML::Twig)

## When should I use this 
When you need to read a XML file, then you have two pinciples:

* The **Document Object Model (DOM)** style. These parsers read the entire XML document into memory. Usually they provide easy methods to navigate in the document tree or make modifications. 

DOM parsers are perfect for rather small files, for example configuration files or (X-)HTML pages.

* The **stream** or **event** based parsers. These parser read the XML file "line by line" or read "node by node". The biggest advantage of such a parser is, there is no limit for the size of the XML file. You can read XML files having a size of mmany Terabytes, because you read always just a single line/node. 

The backside: by default you cannot navigate in the document tree, you know only the current node.


This module tries to combine both principles. The XML document is read in chunks and within a chunk you have all the nice features and functions you know from a DOM based parser.

XML documents are parsed either with [sax](https://www.npmjs.com/package/sax) or [node-expat](https://www.npmjs.com/package/node-expat)


## Names and Definitions

This module tries to follow the [XML-Path Language](https://www.w3.org/TR/xpath/) specification. 


In XPath, there are seven kinds of nodes: `element`, `attribute`, `text`, `namespace`, `processingInstruction`, `comment`, and `root`. XML documents are treated as trees of nodes. These types are well explained in [W3Schools: Introduction to XML](https://www.w3schools.com/xml/xml_whatis.asp)


* **root**: The topmost element of the tree
* **ancestor**: 	All ancestors (parent, grandparent, etc.) of the current node
* **ancestorOrSelf**: 	All ancestors (parent, grandparent, etc.) of the current node and the current node itself
* **child**: 	All children of the current node
* **descendant**: 	All descendants (children, grandchildren, etc.) of the current node
* **descendantOrSelf**: 	All descendants (children, grandchildren, etc.) of the current node and the current node itself
* **following**: 	Everything in the document after the closing tag of the current node
* **followingSibling**: 	All siblings after the current node
* **sibling**: 	All iblings before and after the current node
* **siblingOrSelf**: 	All iblings before and after the current node and the current node itself
* **namespace**: 	All namespace nodes of the current node
* **parent**: 	The parent of the current node
* **preceding**: 	All nodes that appear before the current node in the document, except ancestors, attribute nodes and namespace nodes
* **precedingSibling**: 	All siblings before the current node
* **self**: 	The current node

## Limitations

Currently this module supports only reading. Writing and modifing might be added in upcoming releases.