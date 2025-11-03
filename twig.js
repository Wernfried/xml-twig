/**
* @version: 1.9.2
* @author: Wernfried Domscheit
* @copyright: Copyright (c) 2025 Wernfried Domscheit. All rights reserved.
* @website: https://www.npmjs.com/package/xml-twig
*/

const SAX = 'sax';
const EXPAT = ['expat', 'node-expat'];

/**
* @external XMLWriter
* @see {@link https://www.npmjs.com/package/xml-writer|xml-writer}
*/

/**
* @external sax
* @see {@link https://www.npmjs.com/package/sax|sax}
*/

/**
* @external node-expat
* @see {@link https://www.npmjs.com/package/node-expat|node-expat}
*/

/**
* @external libxmljs
* Though module looks promising, it is not implemented, because it does not support Streams.
* According to {@link https://github.com/libxmljs/libxmljs/issues/390|Stream Support} it was requested in 2016, i.e. 8 years ago. 
* Apart from that, documentation is very sparse.
* @see {@link https://www.npmjs.com/package/libxmljs|libxmljs}
*/

/*
* Other parsers I had a look at:
* {@link https://www.npmjs.com/package/sax-wasm|sax-wasm}: not a 'stream.Writable'
* {@link https://www.npmjs.com/package/@rubensworks/saxes|saxes}: not a 'stream.Writable'
* {@link https://www.npmjs.com/package/node-xml-stream|node-xml-stream}: Lacks comment and processinginstruction and maybe self closing tags
* {@link https://www.npmjs.com/package/node-xml-stream-parser|node-xml-stream-parser}: Lacks comment and processinginstruction
* {@link https://www.npmjs.com/package/saxes-stream|saxes-stream}: not a 'stream.Writable'
* {@link https://www.npmjs.com/package/xml-streamer|xml-streamer}: based on 'node-expat', does not add any benefit
*/


class RootHandler { }
class AnyHandler { }


/** 
* @constant {RootHandler} Root
* @type {RootHandler}
*/
const Root = new RootHandler();

/** 
* @constant {AnyHandler} Any
* @type {AnyHandler}
*/
const Any = new AnyHandler();


/**
* Optional settings for the Twig parser
* @typedef ParserOptions 
* @property {'sax' | 'expat'} method - The underlying parser. Either `'sax'`, `'expat'`.
* @property {boolean} xmlns - If `true`, then namespaces are accessible by `namespace` property.
* @property {boolean} trim - If `true`, then turn any whitespace into a single space. Text and comments are trimmed.
* @property {boolean} resumeAfterError - If `true` then parser continues reading after an error. Otherwise it throws exception.
* @property {boolean} partial - If `true` then unhandled elements are purged.
* @property {string} [file - Optional. The name of file to be parsed. Just used for information and logging purpose.
* @example { method: 'expat', xmlns: true }
* @default  { method: 'sax', xmlns: false, trim: true, resumeAfterError: false, partial: false }
*/

/**
* Reference to handler functions for Twig objects.<br> 
* Element can be specified as string, Regular Expression, custom function, `Twig.Root` or `Twig.Any`<br> 
* You can specify a `function` or a `event` name
* @typedef TwigHandler
* @property {HandlerCondition} tag - Element specification
* @property {HandlerFunction} function - Definition of handler function, either anonymous or explicit function
* @property {string} event - Type of the event to be emitted
*/

/**
* Condition to specify when handler shall be called<br> 
* - If `string` then the element name must be equal to the string
* - If `string[]` then the element name must be included in string array
* - If `RegExp` then the element name must match the Regular Expression
* - If [HandlerConditionFilter](#HandlerConditionFilter) then function must return `true`
* - Use `Twig.Root` to call the handler on root element, i.e. when the end of document is reached
* - Use `Twig.Any` to call the handler on every element
* @typedef {string|string[]|RegExp|HandlerConditionFilter|Root|Any} HandlerCondition 
*/

/**
* Handler function for Twig objects, i.e. the way you like to use the XML element.
* @typedef {function} HandlerFunction 
* @param {Twig} elt - The current Twig element on which the function was called.
*/

/**
* Custom filter function to specify when handler shall be called
* @typedef {function} HandlerConditionFilter 
* @param {string} name - Name of the element
* @returns {boolean} If the function returns `true`, then it is included in the filter
*/

/**
* Optional condition to get elements<br> 
* - If `undefined`, then all elements are returned.<br> 
* - If `string` then the element name must be equal to the string
* - If `RegExp` then the element name must match the Regular Expression
* - If [ElementConditionFilter](#ElementConditionFilter) then function must return `true`
* - Use [Twig](#Twig) object to find a specific element
* @typedef {string|RegExp|ElementConditionFilter|Twig|undefined} ElementCondition 
*/

/**
* Custom filter function to select desired elements
* @typedef {function} ElementConditionFilter 
* @param {string} name - Name of the element
* @param {Twig} elt - The Twig object
* @returns {boolean} If the function returns `true`, then it is included in the filter
*/

/**
* @typedef Parser
* @property {number} currentLine - The currently processed line in the XML-File.
* @property {number} currentColumn - The currently processed column in the XML-File.
* @property {string} file - The name of file to be parsed. Just used for information and logging purpose.
* @property {object} twig - Object with XML tree and current XML element
* @property {string} method - The underlying parser. Either `'sax'`, `'expat'`.
* @returns {external:sax|external:node-expat} The parser Object
*/

/**
* Create a new Twig parser
* @param {TwigHandler|TwigHandler[]} handler - Object or array of element specification and function to handle elements
* @param {ParserOptions} options - Object of optional options 
* @throws {UnsupportedParser} - For an unsupported parser. Currently `expat` and `sax` (default) are supported.
* @returns {Parser} The parser Object
*/
function createParser(handler, options = {}) {
   options = Object.assign({ method: SAX, xmlns: false, trim: true, resumeAfterError: false, partial: false }, options);
   let parser;
   let namespaces = {};

   const handlerCheck = Array.isArray(handler) ? handler : [handler];
   if (handlerCheck.find(x => x.tag === undefined) != null || handlerCheck.find(x => x.tag.length == 0) != null)
      throw new ReferenceError(`'handler.tag' is not defined`);
   if (options.partial && handlerCheck.find(x => x.tag instanceof AnyHandler) != null)
      console.warn(`Using option '{ partial: true }' and handler '{ tag: Any, function: ${any.function.toString()} }' does not make much sense`);

   // `parser.on("...", err =>  {...}` does not work, because I need access to 'this'
   if (options.method === SAX) {
      // Set options to have the same behavior as in expat
      parser = require("sax").createStream(true, { strictEntities: true, position: true, xmlns: options.xmlns, trim: options.trim });

      Object.defineProperty(parser, 'currentLine', {
         enumerable: true,
         get() { return parser._parser.line + 1; }
      });
      Object.defineProperty(parser, 'currentColumn', {
         enumerable: true,
         get() { return parser._parser.column + 1; }
      });

      parser.on("closetag", onClose.bind(null, handler, parser, options));
      parser.on("opentagstart", onStart.bind(null, parser, {
         handler: Array.isArray(handler) ? handler : [handler],
         options: options,
         namespaces: namespaces
      }));

      parser.on("processinginstruction", function (pi) {
         if (pi.name === 'xml') {
            // SAX parser handles XML declaration as Processing Instruction
            let declaration = {};
            for (let item of pi.body.split(' ')) {
               let [k, v] = item.split('=');
               declaration[k] = v.replaceAll('"', '').replaceAll("'", '');
            }
            parser.twig.tree = new Twig(parser, null);
            Object.defineProperty(parser.twig.tree, 'declaration', {
               value: declaration,
               writable: false,
               enumerable: true
            });
         } else if (parser.twig.tree.PI === undefined) {
            Object.defineProperty(parser.twig.tree, 'PI', {
               value: { target: pi.name, data: pi.body },
               writable: false,
               enumerable: true
            });
         }
      });

      parser.on("attribute", function (attr) {
         if (options.xmlns && (attr.uri ?? '') !== '' && attr.local !== undefined) {
            namespaces[attr.local] = attr.uri;
            if (parser.twig.current.name.includes(':')) {
               Object.defineProperty(parser.twig.current, 'namespace', {
                  value: { local: attr.local, uri: attr.uri },
                  writable: false,
                  enumerable: true
               });
            } else {
               parser.twig.current.attribute(attr.name, attr.value);
            }
         } else {
            parser.twig.current.attribute(attr.name, attr.value);
         }
      });
      parser.on("cdata", function (str) {
         parser.twig.current.text = options.trim ? str.trim() : str;
      });

      parser.on('end', function () {
         parser.twig = { current: null, tree: null };
         parser.emit("finish");
         parser.emit("close");
      });

   } else if (EXPAT.includes(options.method)) {
      parser = require("node-expat").createParser();
      Object.defineProperty(parser, 'currentLine', {
         enumerable: true,
         get() { return parser.parser.getCurrentLineNumber(); }
      });
      Object.defineProperty(parser, 'currentColumn', {
         enumerable: true,
         get() { return parser.parser.getCurrentColumnNumber(); }
      });

      parser.on("endElement", onClose.bind(null, handler, parser, options));
      parser.on("startElement", onStart.bind(null, parser, {
         handler: Array.isArray(handler) ? handler : [handler],
         options: options,
         namespaces: namespaces
      }));

      parser.on('xmlDecl', function (version, encoding, standalone) {
         parser.twig.tree = new Twig(parser, null);
         let dec = {};
         if (version !== undefined) dec.version = version;
         if (encoding !== undefined) dec.encoding = encoding;
         if (standalone !== undefined) dec.standalone = standalone;
         Object.defineProperty(parser.twig.tree, 'declaration', {
            value: dec,
            writable: false,
            enumerable: true
         });
      });

      parser.on('processingInstruction', function (target, data) {
         parser.twig.tree.PI = { target: target, data: data };
      });

      parser.on('end', function () {
         parser.twig = { current: null, tree: null };
         parser.emit("finish");
      });

   } else {
      throw new UnsupportedParser(options.method);
   }

   Object.defineProperty(parser, 'twig', {
      enumerable: true,
      value: { current: null, tree: null },
      writable: true
   });

   Object.defineProperty(parser, 'method', {
      value: options.method,
      writable: false,
      enumerable: true
   });

   Object.defineProperty(parser, 'trimText', {
      value: options.trim,
      writable: false,
      enumerable: true
   });

   if (options.file != null) {
      Object.defineProperty(parser, 'file', {
         value: options.file,
         writable: false,
         enumerable: true
      });
   }

   // Common events
   parser.on('text', function (str) {
      if (parser.twig.current === null) return;
      parser.twig.current.text = str;
   });

   parser.on("comment", function (str) {
      if (parser.twig.current.hasOwnProperty('comment')) {
         if (typeof parser.twig.current.comment === 'string') {
            parser.twig.current.comment = [parser.twig.current.comment, str.trim()];
         } else {
            parser.twig.current.comment.push(str.trim());
         }
      } else {
         Object.defineProperty(parser.twig.current, 'comment', {
            value: str.trim(),
            writable: true,
            enumerable: true,
            configurable: true
         });
      }
   });

   parser.on('error', function (err) {
      console.error(`error at line [${parser.currentLine}], column [${parser.currentColumn}]`, err);
      if (options.resumeAfterError) {
         parser.underlyingParser.error = null;
         parser.underlyingParser.resume();
      }
   });

   return parser;
}


/**
* Common Event hanlder for starting tag
* @param {Parser} parser - The main parser object
* @param {object} binds - Additional parameter object
* @param {object|string} node - Node or Node name
* @param {object} attrs - Node Attributes
*/
function onStart(parser, binds, node, attrs) {

   const name = typeof node === 'string' ? node : node.name;
   const handler = binds.handler;
   const options = binds.options;
   let namespaces = binds.namespaces;

   let attrNS = {};
   if (options.xmlns && attrs !== undefined) {
      for (let key of Object.keys(attrs).filter(x => !(x.startsWith('xmlns:') && name.includes(':'))))
         attrNS[key] = attrs[key];
   }

   if (parser.twig.tree === null) {
      parser.twig.tree = new Twig(parser, name, parser.twig.current, options.xmlns ? attrNS : attrs);
   } else {
      if (parser.twig.current.isRoot && parser.twig.current.name === undefined) {
         parser.twig.current.setRoot(name);
         if (attrs !== undefined) {
            for (let [key, val] of Object.entries(options.xmlns ? attrNS : attrs))
               parser.twig.current.attribute(key, val);
         }
      } else {
         let elt = new Twig(parser, name, parser.twig.current, options.xmlns ? attrNS : attrs);
         if (options.partial) {
            for (let hndl of handler) {
               if (typeof hndl.tag === 'string' && name === hndl.tag) {
                  elt.pin();
                  break;
               } else if (Array.isArray(hndl.tag) && hndl.tag.includes(name)) {
                  elt.pin();
                  break;
               } else if (hndl.tag instanceof RegExp && hndl.tag.test(name)) {
                  elt.pin();
                  break;
               } else if (typeof hndl.tag === 'function' && hndl.tag(name, parser.twig.current ?? parser.twig.tree)) {
                  elt.pin();
                  break;
               }
            }
         }
      }
   }

   if (options.xmlns) {
      if (EXPAT.includes(options.method)) {
         for (let key of Object.keys(attrs).filter(x => x.startsWith('xmlns:')))
            namespaces[key.split(':')[1]] = attrs[key];
      }
      if (name.includes(':')) {
         let prefix = name.split(':')[0];
         if (namespaces[prefix] !== undefined) {
            Object.defineProperty(parser.twig.current, 'namespace', {
               value: { local: prefix, uri: namespaces[prefix] },
               writable: false,
               enumerable: true
            });
         }
      }
   }
}

/**
* Common Event hanlder for closing tag. On closed elements it either calls the Handler function or emits the specified event.
* @param {TwigHandler|TwigHandler[]} handler - Object or array of element specification and function to handle elements
* @param {Parser} parser - The main parser object
* @param {external:sax|external:node-expat} parser - SAXStream or node-expat Stream object
* @param {ParserOptions} options - Object of optional options 
* @param {string} name - Event handler parameter
*/
function onClose(handler, parser, options, name) {
   parser.twig.current.close();
   let purge = true;

   for (let hndl of Array.isArray(handler) ? handler : [handler]) {
      if (hndl.tag instanceof AnyHandler) {
         if (typeof hndl.function === 'function') hndl.function(parser.twig.current ?? parser.twig.tree, parser);
         if (typeof hndl.event === 'string') parser.emit(hndl.event, parser.twig.current ?? parser.twig.tree);
         purge = false;
      } else if (hndl.tag instanceof RootHandler && parser.twig.current.isRoot) {
         if (typeof hndl.function === 'function') hndl.function(parser.twig.tree, parser);
         if (typeof hndl.event === 'string') parser.emit(hndl.event, parser.twig.tree);
         purge = false;
      } else if (Array.isArray(hndl.tag) && hndl.tag.includes(name)) {
         if (typeof hndl.function === 'function') hndl.function(parser.twig.current ?? parser.twig.tree, parser);
         if (typeof hndl.event === 'string') parser.emit(hndl.event, parser.twig.current ?? parser.twig.tree);
         purge = false;
      } else if (typeof hndl.tag === 'string' && name === hndl.tag) {
         if (typeof hndl.function === 'function') hndl.function(parser.twig.current ?? parser.twig.tree, parser);
         if (typeof hndl.event === 'string') parser.emit(hndl.event, parser.twig.current ?? parser.twig.tree);
         purge = false;
      } else if (hndl.tag instanceof RegExp && hndl.tag.test(name)) {
         if (typeof hndl.function === 'function') hndl.function(parser.twig.current ?? parser.twig.tree, parser);
         if (typeof hndl.event === 'string') parser.emit(hndl.event, parser.twig.current ?? parser.twig.tree);
         purge = false;
      } else if (typeof hndl.tag === 'function' && hndl.tag(name, parser.twig.current ?? parser.twig.tree)) {
         if (typeof hndl.function === 'function') hndl.function(parser.twig.current ?? parser.twig.tree, parser);
         if (typeof hndl.event === 'string') parser.emit(hndl.event, parser.twig.current ?? parser.twig.tree);
         purge = false;
      }
   }

   if (options.partial && purge && !parser.twig.current.pinned && !parser.twig.current.isRoot)
      parser.twig.parser.twig.current.purge();
   parser.twig.current = parser.twig.current.parent();

}

/**
 * Generic class modeling a XML Node
 * @class Twig
 */
class Twig {
   /**
   * Optional condition to get attributes<br> 
   * - If `undefined`, then all attributes are returned.<br> 
   * - If `string` then the attribute name must be equal to the string
   * - If `RegExp` then the attribute name must match the Regular Expression
   * - If [AttributeConditionFilter](#AttributeConditionFilter) then the attribute must filter function 
   * @typedef {string|RegExp|AttributeConditionFilter} AttributeCondition 
   */

   /**
   * Custom filter function to get desired attributes
   * @typedef {function} AttributeConditionFilter 
   * @param {string} name - Name of the attribute
   * @param {string|number} value - Value of the attribute
   */

   /**
   * XML Processing Instruction object, exist only on root
   * @typedef {object} #PI 
   */

   /**
   * XML Declaration object, exist only on root
   * @typedef {object} #declaration 
   */

   /**
   * XML namespace of element. Exist onl when parsed with `xmlns: true`
   * @typedef {object} #namespace 
   */

   /**
   * Comment or array of comments inside the XML Elements
   * @typedef {string|string[]} #comment 
   */

   /**
    * XML attribute `{ <attribute 1>: <value 1>, <attribute 2>: <value 2>, ... }`
   * @type {?object}
   */
   #attributes = {};

   /**
    * Content of XML Element
   * @type {?string|number}
   */
   #text = null;

   /**
    * The XML tag name
   * @type {string} 
   */
   #name;

   /**
    * Child XML Elements
   * @type {Twig[]}
   */
   #children = [];

   /**
    * The parent object. Undefined on root element
   * @type {Twig | undefined} 
   */
   #parent;

   /**
    * Determines whether twig is needed in partial load
   * @type {boolean}
   */
   #pinned = false;

   /**
    * Determines whether text is trimmed
   * @type {boolean}
   */
   #trim = true;

   /**
   * Create a new Twig object
   * @param {Parser} parser - The main parser object
   * @param {?string} name - The name of the XML element
   * @param {Twig} parent - The parent object
   * @param {object} attributes - Attribute object
   * @param {string|number} index - Position name 'first', 'last' or the position in the current `children` array.<br>Defaults to 'last'
   */
   constructor(parser, name, parent, attributes, index) {
      if (index === undefined)
         parser.twig.current = this;

      this.#trim = parser.trimText;
      if (name === null) {
         // Root element not available yet
         parser.twig.tree = this;
      } else {
         this.#name = name;
         if (attributes !== undefined)
            this.#attributes = attributes;
         if (parent === undefined) {
            // Root element
            parser.twig.tree = this;
         } else {
            this.#parent = parent;
            if (this.#parent.#pinned)
               this.#pinned = true;
            if (index === 'last' || index === undefined) {
               parent.#children.push(this);
            } else if (index === 'first') {
               parent.#children.unshift(this);
            } else if (typeof index === 'number') {
               parent.#children = parent.#children.slice(0, index).concat(this, parent.#children.slice(index));
            } else {
               parent.#children.push(this);
            }

         }
      }
   }

   /**
   * Purges the current, typically used after element has been processed.<br>The root object cannot be purged.
   */
   purge = function () {
      if (!this.isRoot)
         this.#parent.#children = this.#parent.#children.filter(x => !Object.is(this, x));
   };

   /**
   * Purges up to the elt element. This allows you to keep part of the tree in memory when you purge.<br>
   * The `elt` object is not purged. If you like to purge including `elt`, use `.purgeUpTo(elt.previous())`
   * @param {Twig} elt - Up to this element the tree will be purged.
   * If `undefined` then the current element is purged (i.e. `purge()`)
   */
   purgeUpTo = function (elt) {
      if (elt === undefined) {
         this.purge();
      } else {
         let toPurge = this;
         while (toPurge !== null && !Object.is(toPurge, elt)) {
            const prev = toPurge.previous();
            toPurge.purge();
            toPurge = prev;
         }
      }
   };

   /**
   * Escapes special XML characters. According W3C specification these are only `&, <, >, ", '` - this is a XML parser, not HTML!
   * @param {string} text - Input text to be escaped
   */
   escapeEntity = function (text) {
      return text
         .replaceAll("&", "&amp;")
         .replaceAll("<", "&lt;")
         .replaceAll(">", "&gt;")
         .replaceAll('"', "&quot;")
         .replaceAll("'", "&apos;");
   };

   /**
   * Sets the name of root element. In some cases the root is created before the XML-Root element is available<br>
   * Used internally!
   * @param {string} name - The element name
   * @private
   */
   setRoot(name) {
      if (this.isRoot)
         this.#name = name;
   }

   /**
   * Returns `true` if the element is empty, otherwise `false`.
   * An empty element has no text nor any child elements, however empty elements can have attributes.
   * @returns {boolean} true if empty element
   */
   get isEmpty() {
      return this.#text === null && this.#children.length == 0;
   }

   /**
   * Returns the level of the element. Root element has 0, children have 1, grand-children 2 and so on
   * @returns {number} The level of the element. 
   */
   get level() {
      let ret = 0;
      let p = this.#parent;
      while (p !== undefined) {
         p = p.#parent;
         ret++;
      }
      return ret;
   }

   /**
   * Returns `true` if element is the root object
   * @returns {boolean} true if root element
   */
   get isRoot() {
      return this.#parent === undefined;
   }

   /**
   * Returns `true` if element has child elements
   * @returns {boolean} true if has child elements exists
   */
   get hasChildren() {
      return this.#children.length > 0;
   }

   /**
   * The position in `#children` array. For root object 0
   * @returns {number} Position of element in parent
   */
   get index() {
      return this.isRoot ? 0 : this.#parent.#children.indexOf(this);
   }

   /**
   * The X-Path position of the element
   * NOTE: Applies only to currently loaded elements. 
   * @returns {string} X-Path 
   */
   get path() {
      if (this.isRoot)
         return `/${this.#name}`;

      let ret = [];
      if (this.#parent.children(this.#name).length > 1) {
         let sameChildren = this.#parent.children(this.#name);
         ret.unshift(`${this.#name}[${sameChildren.indexOf(this) + 1}]`);
      } else {
         ret.unshift(this.#name);
      }
      if (!this.isRoot) {
         let parent = this.#parent;
         while (!parent.isRoot) {
            if (parent.#parent.children(parent.#name).length > 1) {
               let sameChildren = parent.#parent.children(parent.#name);
               ret.unshift(`${parent.#name}[${sameChildren.indexOf(parent) + 1}]`);
            } else {
               ret.unshift(parent.#name);
            }
            parent = parent.#parent;
         }
      }
      return '/' + ret.join('/');
   }

   /**
   * Returns the name of the element.
   * @returns {string} Element name
   */
   get name() {
      return this.#name;
   }
   /**
   * Returns the name of the element. Synonym for `twig.name`
   * @returns {string} Element name
   */
   get tag() {
      return this.#name;
   }

   /**
   * The text of the element. No matter if given as text or CDATA entity.
   * If option `trim: true`, then whitespace from both ends of the string are removed
   * @returns {string} Element text or empty string
   */
   get text() {
      if (this.#text === null)
         return ''
      else
         return this.#trim ? this.#text.trim() : this.#text;
   }

   /**
   * Update the text of the element
   * @param {string|number|bigint|boolean} value - New text of the element
   * @throws {UnsupportedType} - If value is not a string, boolean or numeric type
   */
   set text(value) {
      if (this.#text === null) this.#text = '';
      if (typeof value === 'string')
         this.#text += value;
      else if (['number', 'bigint', 'boolean'].includes(typeof value))
         this.#text += value.toString();
      else
         throw new UnsupportedType(value);
   }

   /**
   * Pins the current element. Used for partial reading.
   */
   pin = function () {
      this.#pinned = true;
   };

   /**
   * Checks if element is pinned
   * @returns {boolean} `true` when the element is pinned
   */
   get pinned() {
      return this.#pinned;
   }

   /**
   * Closes the element
   */
   close = function () {
      Object.seal(this);
   };

   /**
   * XML-Twig for dummies :-)
   * @returns {string} The XML-Tree which is currently available in RAM - no valid XML Structure
   */
   debug = function () {
      return this.root().writer(true, true).output;
   };

   /**
   * Returns XML string of the element
   * @returns {string} The XML-Element as string
   */
   toString = function () {
      return this.writer(true).toString();
   };

   /**
   * Internal recursive function used by `writer()`
   * @param {external:XMLWriter} xw - The writer object
   * @param {Twig[]} childArray - Array of child elements
   */
   #addChild = function (xw, childArray, cur, debug) {
      for (let elt of childArray) {
         xw.startElement(elt.name);
         for (let [key, val] of Object.entries(elt.attributes))
            xw.writeAttribute(key, val);
         if (elt.text !== null)
            xw.text(elt.text);
         this.#addChild(xw, elt.children(), elt, debug);
      }
      if (!debug || Object.isSealed(cur)) xw.endElement();
   };

   /**
   * Creates xml-writer from current element
   * @param {?boolean|string|external:XMLWriter} par - `true` or intention character or an already created XMLWriter
   * @returns {external:XMLWriter} 
   */
   writer = function (par, debug) {
      const XMLWriter = require('xml-writer');
      let xw = par instanceof XMLWriter ? par : new XMLWriter(par);

      xw.startElement(this.#name);
      for (let [key, val] of Object.entries(this.#attributes))
         xw.writeAttribute(key, val);
      if (this.#text !== null)
         xw.text(this.#text);
      this.#addChild(xw, this.#children, this, debug);
      if (!debug || Object.isSealed(this)) xw.endElement();
      return xw;
   };

   /**
   * Returns attribute value or `null` if not found.<br>
   * If more than one  matches the condition, then it returns object as [attribute()](#attribute)
   * @param {AttributeCondition} condition - Optional condition to select attribute
   * @returns {?string|number|object} - The value of the attribute or `null` if the  does not exist
   */
   attr = function (condition) {
      let attr = this.attribute(condition);
      if (attr === null)
         return null;

      return Object.keys(attr).length === 1 ? attr[Object.keys(attr)[0]] : attr;
   };

   /**
   * Returns all attributes of the element
   * @returns {object} All XML Attributes
   */
   get attributes() {
      return this.#attributes;
   }

   /**
   * Check if the attribute exist or not
   * @param {string} name - The name of the attribute
   * @returns {boolean} - Returns `true` if the attribute exists, else `false`
   */
   hasAttribute = function (name) {
      return this.#attributes[name] !== undefined;
   };

   /**
   * Retrieve or update XML attribute. For update, the condition must be a string, i.e. must match to one attribute only.
   * @param {AttributeCondition} condition - Optional condition to select attributes
   * @param {string|number|bigint|boolean} value - New value of the attribute.<br>If `undefined` then existing attributes is returned.
   * @returns {object} Attributes or `null` if no matching attribute found
   * @example attribute((name, val) => { return name === 'age' && val > 50})
   * attribute((name) => { return ['firstName', 'lastName'].includes(name) })
   * attribute('firstName')
   * attribute(/name/i)
   */
   attribute = function (condition, value) {
      if (value === undefined) {
         let attr;
         if (condition === undefined) {
            attr = this.#attributes;
         } else if (typeof condition === 'function') {
            attr = Object.fromEntries(Object.entries(this.#attributes).filter(([key, val]) => condition(key, val)));
         } else if (typeof condition === 'string') {
            attr = this.attribute(key => key === condition);
         } else if (condition instanceof RegExp) {
            attr = this.attribute(key => condition.test(key));
         } else if (condition instanceof Twig) {
            throw new UnsupportedCondition(condition, ['string', 'RegEx', 'function']);
         } else {
            return this.attribute();
         }
         return attr === null || Object.keys(attr).length == 0 ? null : attr;
      } else if (typeof condition === 'string') {
         if (typeof value === 'string')
            this.#attributes[condition] = value;
         else if (['number', 'bigint', 'boolean'].includes(typeof value))
            this.#attributes[condition] = value.toString();
         else
            throw new UnsupportedType(value);
      } else {
         console.warn('Condition must be a `string` if you like to update an attribute');
      }
   };

   /**
   * Delete the attribute
   * @param {string} name - The attribute name
   */
   deleteAttribute = function (name) {
      delete this.#attributes[name];
   };

   /**
   * Returns the root object
   * @returns {Twig} The root element of XML tree
   */
   root = function () {
      if (this.isRoot) {
         return this;
      } else {
         let ret = this.#parent;
         while (!ret.isRoot) {
            ret = ret.#parent;
         }
         return ret;
      }
   };

   /**
   * Returns the parent element or null if root element
   * @returns {Twig} The parament element
   */
   parent = function () {
      return this.isRoot ? null : this.#parent;
   };

   /**
   * @returns {Twig} - The current element
   */
   self = function () {
      return this;
   };

   /**
   * Common function to filter Twig elements from array
   * @param {Twig|Twig[]} elements - Array of elements you like to filter or a single element
   * @param {ElementCondition} condition - The filter condition
   * @returns {Twig[]} List of matching elements or empty array
   */
   filterElements(elements, condition) {
      if (!Array.isArray(elements))
         return this.filterElements([elements], condition);

      if (condition !== undefined) {
         if (typeof condition === 'string') {
            return elements.filter(x => x.name === condition);
         } else if (condition instanceof RegExp) {
            return elements.filter(x => condition.test(x.name));
         } else if (condition instanceof Twig) {
            return elements.filter(x => Object.is(x, condition));
         } else if (typeof condition === 'function') {
            return elements.filter(x => condition(x.name, x));
         }
      }

      return elements;
   }

   /**
   * Common function to filter Twig element
   * @param {Twig} element - Element you like to filter
   * @param {ElementCondition} condition - The filter condition
   * @returns {boolean} `true` if the condition matches
   */
   testElement(element, condition) {
      if (condition === undefined) {
         return true;
      } else if (typeof condition === 'string') {
         return element.name === condition;
      } else if (condition instanceof RegExp) {
         return condition.test(element.name);
      } else if (condition instanceof Twig) {
         return Object.is(element, condition);
      } else if (typeof condition === 'function') {
         return condition(element.name, element);
      }
      return false;
   }

   /**
   * All children, optionally matching `condition` of the current element or empty array 
   * @param {ElementCondition} condition - Optional condition
   * @returns {Twig[]} 
   */
   children = function (condition) {
      return this.filterElements(this.#children, condition);
   };

   /**
   * The first matching child, optionally matching `condition` of the current element or null
   * @param {ElementCondition} condition - Optional condition
   * @returns {?Twig} 
   */
   firstChild = function (condition) {
      let _children = this.children(condition);
      return _children.length == 0 ? null : _children[0];
   };

   /**
   * The last matching child, optionally matching `condition` of the current element or null
   * @param {ElementCondition} condition - Optional condition
   * @returns {?Twig} 
   */
   lastChild = function (condition) {
      let _children = this.children(condition);
      return _children.length == 0 ? null : _children[_children.length - 1];
   };

   /**
   * Returns the next matching element. 
   * @param {ElementCondition} condition - Optional condition
   * @returns {?Twig} - The next element
   * @see https://www.w3.org/TR/xpath-datamodel-31/#document-order
   */
   next = function (condition) {
      if (this === null)
         return null;

      let elt;
      if (this.hasChildren) {
         elt = this.#children[0];
      } else {
         elt = this.nextSibling();
         if (elt === null) {
            elt = this.#parent;
            elt = elt.nextSibling();
         }
      }
      if (elt === null)
         return null;

      return this.testElement(elt, condition) ? elt : elt.next(condition);
   };

   /**
   * Returns the previous matching element. 
   * @param {ElementCondition} condition - Optional condition
   * @returns {?Twig} - The previous element
   * @see https://www.w3.org/TR/xpath-datamodel-31/#document-order
   */
   previous = function (condition) {
      if (this === null || this.isRoot)
         return null;

      let elt = this.prevSibling();
      if (elt === null) {
         elt = this.parent();
      } else {
         elt = elt.descendantOrSelf();
         elt = elt[elt.length - 1];
      }

      return this.testElement(elt, condition) ? elt : elt.previous(condition);
   };

   /**
   * Returns the first matching element. This is usually the root element
   * @param {ElementCondition} condition - Optional condition
   * @returns {?Twig} - The first element
   */
   first = function (condition) {
      if (this === null)
         return null;
      return this.testElement(this.root(), condition) ? this.root() : this.root().next(condition);
   };

   /**
   * Returns the last matching element. 
   * @param {ElementCondition} condition - Optional condition
   * @returns {?Twig} - The last element
   */
   last = function (condition) {
      if (this === null)
         return null;

      let elt = this.root();
      if (this.root().hasChildren) {
         elt = this.root().#children[this.root().#children.length - 1];
         while (elt.hasChildren)
            elt = elt.children()[elt.children().length - 1];
      }

      return this.testElement(elt, condition) ? elt : elt.previous(condition);
   };

   /**
   * Check if the element is the first child of the parent
   * @returns {boolean} `true` if the first child else `false`
   */
   get isFirstChild() {
      if (this.isRoot) {
         return false;
      } else {
         return this.index === 0;
      }
   }

   /**
   * Check if the element is the last child of the parent
   * @returns {boolean} `true` if the last child else `false`
   */
   get isLastChild() {
      if (this.isRoot) {
         return false;
      } else {
         return this.index === this.#parent.#children.length - 1;
      }
   }

   /**
   * Returns descendants (children, grandchildren, etc.) of the current element
   * @param {ElementCondition} condition - Optional condition
   * @returns {Twig[]} - Array of descendants or empty array 
   */
   descendant = function (condition) {
      let elts = [];
      for (let c of this.#children) {
         elts.push(c);
         elts = elts.concat(c.descendant());
      }
      return this.filterElements(elts, condition);
   };

   /**
   * Returns descendants (children, grandchildren, etc.) of the current element and the current element itself
   * @param {ElementCondition} condition - Optional condition
   * @returns {Twig[]} - Array of descendants or empty array 
   */
   descendantOrSelf = function (condition) {
      let elts = [this];
      for (let c of this.#children) {
         elts.push(c);
         elts = elts.concat(c.descendant());
      }
      return this.filterElements(elts, condition);
   };

   /**
   * Returns ancestors (parent, grandparent, etc.)  of the current element
   * @param {ElementCondition} condition - Optional condition
   * @returns {Twig[]} - Array of ancestors or empty array 
   */
   ancestor = function (condition) {
      let elts = [];
      if (!this.isRoot) {
         let parent = this.#parent;
         elts.push(parent);
         while (!parent.isRoot) {
            parent = parent.#parent;
            elts.push(parent);
         }
      }
      return this.filterElements(elts, condition);
   };

   /**
   * Returns ancestors (parent, grandparent, etc.)  of the current element and the current element itself
   * @param {ElementCondition} condition - Optional condition
   * @returns {Twig[]} - Array of ancestors or empty array 
   */
   ancestorOrSelf = function (condition) {
      let elts = [this];
      if (!this.isRoot) {
         let parent = this.#parent;
         elts.push(parent);
         while (!parent.isRoot) {
            parent = parent.#parent;
            elts.push(parent);
         }
      }
      return this.filterElements(elts, condition);
   };

   /**
   * Returns all sibling element of the current element
   * @param {ElementCondition} condition - Optional condition
   * @returns {Twig[]} - Array of sibling or empty array 
   */
   sibling = function (condition) {
      let elts = [];
      if (!this.isRoot) {
         elts = this.#parent.#children.filter(x => !Object.is(x, this));
      }
      return this.filterElements(elts, condition);
   };

   /**
   * Returns all sibling element of the current element and the current element itself
   * @param {ElementCondition} condition - Optional condition
   * @returns {Twig[]} - Array of sibling or empty array 
   */
   siblingOrSelf = function (condition) {
      let elts = [this];
      if (!this.isRoot) {
         elts = this.#parent.#children;
      }
      return this.filterElements(elts, condition);
   };

   /**
   * Returns all following sibling element of the current element
   * @param {ElementCondition} condition - Optional condition
   * @returns {Twig[]} - Array of sibling or empty array 
   */
   followingSibling = function (condition) {
      let elts = [];
      if (!this.isRoot) {
         elts = this.#parent.#children.slice(this.index + 1);
      }
      return this.filterElements(elts, condition);
   };

   /**
   * Returns all preceding sibling element of the current element
   * @param {ElementCondition} condition - Optional condition
   * @returns {Twig[]} - Array of sibling or empty array 
   */
   precedingSibling = function (condition) {
      let elts = [];
      if (!this.isRoot) {
         elts = this.#parent.#children.slice(0, this.index);
      }
      return this.filterElements(elts, condition);
   };

   /**
   * Returns next sibling element of the current element
   * @param {ElementCondition} condition - Optional condition
   * @returns {?Twig} - The next sibling or `null`
   */
   nextSibling = function (condition) {
      let elt;
      if (!this.isRoot)
         elt = this.#parent.#children[this.index + 1];
      if (elt === undefined)
         return null;

      return this.testElement(elt, condition) ? elt : elt.nextSibling(condition);
   };

   /**
   * Returns previous sibling element of the current element
   * @param {ElementCondition} condition - Optional condition
   * @returns {?Twig} - The previous sibling or `null`
   */
   prevSibling = function (condition) {
      if (!this.isRoot && this.index > 0) {
         let elt = this.#parent.#children[this.index - 1];
         return this.testElement(elt, condition) ? elt : elt.prevSibling(condition);
      } else {
         return null;
      }
   };

   /**
   * Find a specific element within current element. Same as `.descendant(condition)[0]`
   * @param {ElementCondition} condition - Find condition
   * @returns {?Twig} - First matching element or `null`
   */
   find = function (condition) {
      let children = this.filterElements(this.#children, condition);
      if (children.length > 0)
         return children[0];

      for (let child of this.#children) {
         let ret = child.find(condition);
         if (ret !== null)
            return ret;
      }
      return null;
   };

   /**
   * Add a new element in the current element
   * @param {string} name - The tag name
   * @param {?string} text - Text of the element
   * @param {?object} attributes - Element attributes
   * @param {name|number} position - Position name 'first', 'last' or the position in the `children`
   * @returns {Twig} - The appended element
   */
   addElement = function (parser, name, text, attributes, position) {
      let twig = new Twig(parser, name, this, attributes ?? {}, position ?? 'last');
      twig.#text = text ?? null;
      twig.close();
      return twig;
   };

   /**
   * Deletes the current element from tree, same as `purge()`. The root object cannot be deleted.
   */
   delete = function () {
      this.purge();
   };


}


/**
 * Generic error for non implemented feature
 * @exception NotImplementedYet
 */
class NotImplementedYet extends TypeError {
   constructor() {
      super(`Net yet implemented`);
   }
}


/**
 * Error for unsupported parser
 * @exception UnsupportedParser
 */
class UnsupportedParser extends TypeError {
   /**
   * @param {string} t Parser type
   */
   constructor(t) {
      super(`Parser '${t}' is not supported. Use 'expat', 'sax' (default)`);
   }
}

/**
 * Generic error for unsupported data type
 * @exception UnsupportedType
 */
class UnsupportedType extends TypeError {
   /**
   * @param {*} t Parameter which was used
   */
   constructor(t) {
      super(`Type ${typeof t} is not supported in XML`);
   }
}

/**
 * Generic error for unsupported condition
 * @exception UnsupportedCondition
 */
class UnsupportedCondition extends TypeError {
   /**
   * @param {*} condition The condition value
   * @param {string[]} t List of supported data types
   */
   constructor(condition, t) {
      super(`Condition '${JSON.stringify(condition)}' must be a ${t.map(x => `'${x}'`).join(' or ')}`);
   }
}


module.exports = { createParser, Twig, Any, Root };
