const SAX = 'sax';
const EXPAT = 'expat';

let tree;
let current;



class RootHandler { }
class AnyHandler { }


/** 
* @constant {RootHandler} Root
* @type {RootHandler}
`*/
const Root = new RootHandler();

/** 
* @constant {AnyHandler} Any
* @type {AnyHandler}
*/
const Any = new AnyHandler();


/**
* Optional settings for the Twig parser
* @typedef ParserOptions 
* @property {'sax' | 'expat'} [method] - The underlying parser. Either `'sax'` or `'expat'`.
* @property {string} [encoding] - Encoding of the XML File. Applies only to `expat` parser.
* @property {boolean} [xmlns] - If `true`, then namespaces are accessible by `namespace` property.
* @property {boolean} [trim] - If `true`, then turn any whitespace into a single space. Text and comments are trimmed.
* @property {boolean} [resumeAfterError] - If `true` then parser continues reading after an error. Otherwise it throws exception.
* @property {boolean} [partial] - It `true` then unhandled elements are purged.
* @example { encoding: 'UTF-8', xmlns: true }
* @default  { method: 'sax', encoding: 'UTF-8', xmlns: false, trim: true, resumeAfterError: false, partial: false }
*/

/**
* Reference to handler functions for Twig objects.<br> 
* Element can be specified as string, Regular Expression, custom function, `Twig.Root` or `Twig.Any`<br> 
* You can specify a `function` or a `event` name
* @typedef TwigHandler
* @property {HandlerCondition} tag - Element specification
* @property {HandlerFunction} [function] - Definition of handler function, either anonymous or explicit function
* @property {string} [event] - Type of the event to be emitted
*/

/**
* Condition to specify when handler shall be called<br> 
* - If `undefined`, then all elements are returned.<br> 
* - If `string` then the element name must be equal to the string
* - If `RegExp` then the element name must match the Regular Expression
* - If [HandlerConditionFilter](#HandlerConditionFilter) then function must return `true`
* - Use `Twig.Root` to call the handler on root element, i.e. when the end of document is reached
* - Use `Twig.Any` to call the handler on every element
* @typedef {string|RegExp|HandlerConditionFilter|RootHandler|AnyHandler|undefined} HandlerCondition 
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
* Create a new Twig parser
* @param {TwigHandler|TwigHandler[]} handler - Object or array of element specification and function to handle elements
* @param {ParserOptions} [options] - Object of optional options 
* @throws {UnsupportedParser} - For an unsupported parser. Currently `expat` and `sax` (default) are supported.
*/
function createParser(handler, options) {
   options = Object.assign({ method: SAX, encoding: 'UTF-8', xmlns: false, trim: true, resumeAfterError: false, partial: false }, options);
   let parser;
   let namespaces = {};
   let closeEvent;

   if (options.partial) {
      const handle1 = Array.isArray(handler) ? handler : [handler];
      let any = handle1.find(x => x.tag instanceof AnyHandler);
      if (any !== undefined)
         console.warn(`Using option '{ partial: true }' and handler '{ tag: Any, function: ${any.function.toString()} }' does not make much sense`);
   }

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

      closeEvent = "closetag";
      parser.on("opentagstart", function (node) {
         if (tree === undefined) {
            tree = new Twig(node.name, current);
         } else {
            if (current.isRoot && current.name === undefined) {
               current.setRoot(node.name);
            } else {
               let elt = new Twig(node.name, current);
               if (options.partial) {
                  for (let hndl of Array.isArray(handler) ? handler : [handler]) {
                     if (typeof hndl.tag === 'string' && node.name === hndl.tag) {
                        elt.pin();
                        break;
                     } else if (hndl.tag instanceof RegExp && hndl.tag.test(node.name)) {
                        elt.pin();
                        break;
                     } else if (typeof hndl.tag === 'function' && hndl.tag(node.name, current ?? tree)) {
                        elt.pin();
                        break;
                     }
                  }
               }
            }
         }
         if (options.xmlns) {
            if (node.name.includes(':')) {
               let prefix = node.name.split(':')[0];
               if (namespaces[prefix] !== undefined) {
                  Object.defineProperty(current, 'namespace', {
                     value: { local: prefix, uri: namespaces[prefix] },
                     writable: false,
                     enumerable: true
                  });
               }
            }
         }
      });

      parser.on("processinginstruction", function (pi) {
         if (pi.name === 'xml') {
            // SAX parser handles XML declaration as Processing Instruction
            let declaration = {};
            for (let item of pi.body.split(' ')) {
               let [k, v] = item.split('=');
               declaration[k] = v.replaceAll('"', '').replaceAll("'", '');
            }
            tree = new Twig(null);
            Object.defineProperty(tree, 'declaration', {
               value: declaration,
               writable: false,
               enumerable: true
            });
         } else {
            Object.defineProperty(tree, 'PI', {
               value: { target: pi.name, data: pi.body },
               writable: false,
               enumerable: true
            });
         }
      });

      parser.on("attribute", function (attr) {
         current.attribute(attr.name, attr.value);
         if (attr.uri !== undefined && attr.uri !== '') {
            namespaces[attr.local] = attr.uri;
            Object.defineProperty(current, 'namespace', {
               value: { local: attr.local, uri: attr.uri },
               writable: false,
               enumerable: true
            });
         }
      });
      parser.on("cdata", function (str) {
         current.text = current.text ?? '' + str;
      });

      let hndl = Array.isArray(handler) ? handler : [handler];
      let rootHandler = hndl.find(x => x.tag instanceof RootHandler);
      parser.on("end", function () {
         if (typeof rootHandler?.function === 'function') rootHandler.function(tree);
         if (typeof rootHandler?.event === 'string') parser.emit(rootHandler.event, tree);
      });

   } else if (options.method === EXPAT) {
      parser = require("node-expat").createParser();
      parser.encoding = options.encoding;

      Object.defineProperty(parser, 'currentLine', {
         enumerable: true,
         get() { return parser.parser.getCurrentLineNumber(); }
      });
      Object.defineProperty(parser, 'currentColumn', {
         enumerable: true,
         get() { return parser.parser.getCurrentColumnNumber(); }
      });
      closeEvent = "endElement";

      parser.on("startElement", function (name, attrs) {
         if (tree === undefined) {
            tree = new Twig(name, current, attrs);
         } else {
            if (current.isRoot && current.name === undefined) {
               current.setRoot(name);
            } else {
               let elt = new Twig(name, current, attrs);
               if (options.partial) {
                  for (let hndl of Array.isArray(handler) ? handler : [handler]) {
                     if (typeof hndl.tag === 'string' && name === hndl.tag) {
                        elt.pin();
                        break;
                     } else if (hndl.tag instanceof RegExp && hndl.tag.test(name)) {
                        elt.pin();
                        break;
                     } else if (typeof hndl.tag === 'function' && hndl.tag(name, current ?? tree)) {
                        elt.pin();
                        break;
                     }
                  }
               }
            }
         }
         if (options.xmlns) {
            for (let key of Object.keys(attrs).filter(x => x.startsWith('xmlns:')))
               namespaces[key.split(':')[1]] = attrs[key];
            if (name.includes(':')) {
               let prefix = name.split(':')[0];
               if (namespaces[prefix] !== undefined) {
                  Object.defineProperty(current, 'namespace', {
                     value: { local: prefix, uri: namespaces[prefix] },
                     writable: false,
                     enumerable: true
                  });
               }
            }
         }
      });

      parser.on('xmlDecl', function (version, encoding, standalone) {
         tree = new Twig(null);
         let dec = {};
         if (version !== undefined) dec.version = version;
         if (encoding !== undefined) dec.encoding = encoding;
         if (standalone !== undefined) dec.standalone = standalone;
         Object.defineProperty(tree, 'declaration', {
            value: dec,
            writable: false,
            enumerable: true
         });
      });

      parser.on('processingInstruction', function (target, data) {
         tree.PI = { target: target, data: data };
      });
   } else {
      throw new UnsupportedParser(options.method);
   }

   parser.on(closeEvent, function (name) {
      current.close();
      let purge = true;

      for (let hndl of Array.isArray(handler) ? handler : [handler]) {
         if (hndl.tag instanceof AnyHandler) {
            if (typeof hndl.function === 'function') hndl.function(current ?? tree);
            if (typeof hndl.event === 'string') parser.emit(hndl.event, current ?? tree);
            purge = false;
         } else if (hndl.tag instanceof RootHandler && options.method === EXPAT && current.isRoot) {
            if (typeof hndl.function === 'function') hndl.function(tree);
            if (typeof hndl.event === 'string') parser.emit(hndl.event, tree);
            purge = false;
         } else if (typeof hndl.tag === 'string' && name === hndl.tag) {
            if (typeof hndl.function === 'function') hndl.function(current ?? tree);
            if (typeof hndl.event === 'string') parser.emit(hndl.event, current ?? tree);
            purge = false;
         } else if (hndl.tag instanceof RegExp && hndl.tag.test(name)) {
            if (typeof hndl.function === 'function') hndl.function(current ?? tree);
            if (typeof hndl.event === 'string') parser.emit(hndl.event, current ?? tree);
            purge = false;
         } else if (typeof hndl.tag === 'function' && hndl.tag(name, current ?? tree)) {
            if (typeof hndl.function === 'function') hndl.function(current ?? tree);
            if (typeof hndl.event === 'string') parser.emit(hndl.event, current ?? tree);
            purge = false;
         }
      }

      if (options.partial && purge && !current.pinned && !current.isRoot)
         current.purge();
      current = current.parent();

   });

   // Common events
   parser.on('text', function (str) {
      current.text = current.text ?? '' + options.trim ? str.trim() : str;
   });

   parser.on("comment", function (str) {
      if (current.hasOwnProperty('comment')) {
         if (typeof current.comment === 'string') {
            current.comment = [current.comment, str.trim()];
         } else {
            current.comment.push(str.trim());
         }
      } else {
         Object.defineProperty(current, 'comment', {
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
   * Create a new Twig object
   * @param {?string} name - The name of the XML element
   * @param {Twig} [parent] - The parent object
   * @param {object} [attributes] - Attribute object
   * @param {string|number} [index] - Position name 'first', 'last' or the position in the current `children` array.<br>Defaults to 'last'
   */
   constructor(name, parent, attributes, index) {
      if (index === undefined)
         current = this;

      if (name === null) {
         // Root element not available yet
         tree = this;
      } else {
         this.#name = name;
         if (attributes !== undefined)
            this.#attributes = attributes;
         if (parent === undefined) {
            // Root element
            tree = this;
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
   * Purges up to the elt element. This allows you to keep part of the tree in memory when you purge.
   * @param {Twig} [elt] - Up to this element the tree will be purged. The `elt` object itself is not purged.<br>
   * If `undefined` then the current element is purged (i.e. `purge()`)
   */
   purgeUpTo = function (elt) {
      if (elt === undefined) {
         this.purge();
      } else {
         const purgeThis = this.descendantOrSelf();
         let toPurge = purgeThis[purgeThis.length - 1];
         const descendantOrSelf = elt.descendantOrSelf();
         const stopAt = descendantOrSelf[descendantOrSelf.length - 1];
         while (toPurge !== null && !Object.is(toPurge, stopAt)) {
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
   * The text of the element. No matter if given as text or CDATA entity
   * @returns {string} Element text or empty string
   */
   get text() {
      return this.#text ?? '';
   }

   /**
   * Update the text of the element
   * @param {string|number|bigint|boolean} value - New text of the element
   * @throws {UnsupportedType} - If value is not a string, boolean or numeric type
   */
   set text(value) {
      if (typeof value === 'string')
         this.#text = value;
      else if (['number', 'bigint', 'boolean'].includes(typeof value))
         this.#text = value.toString();
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
   * Internal recursive function used by `writer()`
   * @param {XMLWriter} xw - The writer object
   * @param {Twig[]} childArray - Array of child elements
   */
   #addChild = function (xw, childArray) {
      for (let elt of childArray) {
         xw.startElement(elt.name);
         for (let [key, val] of Object.entries(elt.attributes))
            xw.writeAttribute(key, val);
         if (elt.text !== null)
            xw.text(elt.text);
         this.#addChild(xw, elt.children());
      }
      xw.endElement();
   };


   /**
   * Creates xml-writer from current element
   * @param {?boolean|string|XMLWriter} par - `true` or intention character or an already created XMLWriter
   * @returns {XMLWriter} 
   */
   writer = function (par) {
      const XMLWriter = require('xml-writer');
      let xw = par instanceof XMLWriter ? par : new XMLWriter(par);

      xw.startElement(this.#name);
      for (let [key, val] of Object.entries(this.#attributes))
         xw.writeAttribute(key, val);
      if (this.#text !== null)
         xw.text(this.#text);
      this.#addChild(xw, this.#children);
      xw.endElement();
      return xw;
   };

   /**
   * Returns attribute value or `null` if not found.<br>
   * If more than one  matches the condition, then it returns object as [attribute()](#attribute)
   * @param {AttributeCondition} [condition] - Optional condition to select attribute
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
   * @param {AttributeCondition} [condition] - Optional condition to select attributes
   * @param {string|number|bigint|boolean} [value] - New value of the attribute.<br>If `undefined` then existing attributes is returned.
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
   * @param {ElementCondition} [condition] - The filter condition
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
   * @param {ElementCondition} [condition] - The filter condition
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
   * @param {ElementCondition} [condition] - Optional condition
   * @returns {Twig[]} 
   */
   children = function (condition) {
      return this.filterElements(this.#children, condition);
   };

   /**
   * Returns the next matching element. 
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {ElementCondition} [condition] - Optional condition
   * @returns {?Twig} - The first element
   */
   first = function (condition) {
      if (this === null)
         return null;
      return this.testElement(this.root(), condition) ? this.root() : this.root().next(condition);
   };

   /**
   * Returns the last matching element. 
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {ElementCondition} [condition] - Optional condition
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
   * @param {?string} [text] - Text of the element
   * @param {?object} [attributes] - Element attributes
   * @param {name|number} [position] - Position name 'first', 'last' or the position in the `children`
   * @returns {Twig} - The appended element
   */
   addElement = function (name, text, attributes, position) {
      let twig = new Twig(name, this, attributes ?? {}, position ?? 'last');
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
 * Error for unsupported data types
 * @exception UnsupportedParser
 */
class UnsupportedParser extends TypeError {
   /**
   * @param {string} t Parser type
   */
   constructor(t) {
      super(`Parser '${t}' is not supported. Use 'expat' or 'sax' (default)`);
   }
}

/**
 * Generic error for unsupported data types
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
 * Generic error for unsupported data types
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
