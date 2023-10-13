# xml-twig
Node module for processing huge XML documents in tree mode

Inspired by Perl module [XML::Twig](https://metacpan.org/pod/XML::Twig)

## When should I use this 
When you need to read a XML file, then you have two pinciples:
* The Document Object Model (DOM) style. These parsers read the entire XML document into memory. Usually they provide easy methods to navigate in the document tree or make modifications. DOM parsers are perfect for rather small files, for example configuration files or (X-)HTML pages.
* The stream or event based parsers. These parser read the XML file "line by line" or read "node by node". The biggest advantage of such a parser is, there is no limit for the size of the XML file. You can read XML files having a size of mmany Terabytes, because you read always just a single line/node. The backside: by default you cannot navigate in the document tree, you know only the current node.



