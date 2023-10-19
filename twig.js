const SAX = 'sax';
const EXPAT = 'expat';

let tree;
let current;

/**
 * Optional settings for the Twig parser
 * @typedef ParserOptions 
 * @param {string} method - The underlaying parser. Either `'sax'` or `'expat'`.
 * @param {string} encoding - Encoding of the XML File. Applies only to `expat` parser.
 * @param {boolean} xmlns - If true, then namespaces are accessible by `namespace` property.
 * @param {boolean} trim - If true, then turn any whitespace into a single space. Text and comments are trimmed.
 * @param {boolean} resumeAfterError - If true then parser continues reading after an error. Otherwiese it throws exception.
 * @param {boolean} partial - It true then unhandled elements are purged.
 * @example { encoding: 'UTF-8', xmlns: true }
 * @default  { method: 'expat', encoding: 'UTF-8', xmlns: false, trim: true, resumeAfterError: false, partial: false }
 */


/**
* Reference to handler functions for Twig objects.<br>
* If `name` is not specified, then handler is called on every element.<br>
* Otherwise the element name must be equal to the string or Regular Expression. You can specify custom function
* @typedef TwigHandler 
* @param {?string|RegExp|ElementCondition} name - Name of handled element or any element if not specified
* @param {function} HandlerFunction - Definition of handler function, either anonymous or explict function
*/

/**
* Handler function for Twig objects, i.e. the way you like to use the XML element.
* @typedef HandlerFunction 
* @param {Twig} elt - The current Twig element on which the function was called.
*/



/**
* Optional condition to get elements<br> 
* - If `undefined`, then all elements are returned.<br> 
* - If `string` then the element name must be equal to the string
* - If `RegExp` then the element name must match the Regular Expression
* - If [ElementConditionFilter](#ElementConditionFilter) then the element must filter function 
* - Use [Twig](#Twig) object to find a specific element (rarely used in `createParser(handler)`)
* @typedef {string|RegExp|ElementConditionFilter|Twig} ElementCondition 
*/

/**
* 
* Custom filter function to get desired elements
* @typedef {function} ElementConditionFilter 
* @param {string} name - Name of the element
* @param {Twig} elt - The full Twig object
*/


/**
 * Create a new Twig parser
 * @param {TwigHandler|TwigHandler[]} handler - Function or array of function to handle elements
 * @param {?ParserOptions} options - Object of optional options 
 * @throws {UnsupportedParser} - For an unsupported parser. Currently `expat` (default) and `sax` are supported.
 */
function createParser(handler, options) {
   options = Object.assign({ method: EXPAT, encoding: 'UTF-8', xmlns: false, trim: true, resumeAfterError: false, partial: false }, options)
   let parser;
   let namespaces = {};
   let closeEvent;

   // `parser.on("...", err =>  {...}` does not work, because I need access to 'this'

   if (options.method === SAX) {
      // Set options to have the same behaviour as in expat
      parser = require("sax").createStream(true, { strictEntities: true, position: true, xmlns: options.xmlns, trim: options.trim });

      closeEvent = "closetag";
      parser.on("opentagstart", function (node) {
         if (tree === undefined) {
            tree = new Twig(node.name, current);
         } else {
            if (current.isRoot && current.name === undefined) {
               current.setRoot(node.name);
            } else {
               let cur = new Twig(node.name, current);
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
      })

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
      })

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
      })
      parser.on("cdata", function (str) {
         current.text = str;
      })

      if (typeof handler === 'function') {
         parser.on("end", function () {
            if (typeof handler === 'function')
               handler(tree);
         })
      }
   } else if (options.method === EXPAT) {
      parser = require("node-expat").createParser();
      parser.encoding = options.encoding;
      closeEvent = "endElement";

      parser.on("startElement", function (name, attrs) {
         if (tree === undefined) {
            tree = new Twig(name, current, attrs);
         } else {
            if (current.isRoot && current.name === undefined) {
               current.setRoot(name);
            } else {
               let cur = new Twig(name, current, attrs);
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
      })

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
      })

      parser.on('processingInstruction', function (target, data) {
         tree.PI = { target: target, data: data };
      })
   } else {
      throw new UnsupportedParser(options.method);
   }

   parser.on(closeEvent, function (name) {
      let pos;
      if (options.method === SAX) {
         pos = { line: this._parser.line + 1, column: this._parser.column + 1 };
      } else if (options.method === EXPAT) {
         pos = { line: this.parser.getCurrentLineNumber(), column: this.parser.getCurrentColumnNumber() };
      }
      current.close(pos);

      if (typeof handler === 'function' && options.method === EXPAT && current.isRoot) {
         // Entire XML file was parsed at once. EXPAT parser has no event "document end", so trigger at "endElement" of root object
         handler(tree);
      } else {
         for (let hndl of Array.isArray(handler) ? handler : [handler]) {
            if (hndl.name === undefined) {
               hndl.function(current ?? tree);
            } else if (typeof hndl.name === 'string' && name === hndl.name) {
               hndl.function(current ?? tree);
            } else if (hndl.name instanceof RegExp && hndl.name.test(name)) {
               hndl.function(current ?? tree);
            } else if (typeof hndl.name === 'function' && hndl.name(name, current ?? tree)) {
               hndl.function(current ?? tree);
            }
         }
      }

      current = current.parent();
   })

   // Common events
   parser.on('text', function (str) {
      current.text = options.trim ? str.trim() : str;
   })

   parser.on("comment", function (str) {
      if (current.hasOwnProperty('comment')) {
         if (typeof current.comment === 'string') {
            current.comment = [current.comment, str.trim()]
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

   })

   parser.on('error', function (err) {
      let p;
      if (options.method === SAX) {
         p = this._parser;
         console.error(`error at line [${p.line + 1}], column [${p.column + 1}]`, err);
      } else if (options.method === EXPAT) {
         p = this.parser;
         console.error(`error at line [${p.getCurrentLineNumber()}], column [${p.getCurrentColumnNumber()}]`, err);
      }
      if (options.resumeAfterError) {
         p.error = null;
         p.resume();
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
   * @property {?object} #attributes - XML attribute `{ <attribute 1>: <value 1>, <attribute 2>: <value 2>, ... }`
   * @private
   */
   #attributes = {};

   /**
   * @property {?string|number} #text - Content of XML Element
   * @private
   */
   #text = null;

   /**
   * @property {string} #name - The XML tag name
   * @private
   */
   #name;

   /**
   * @property {?Twig[]} #children - Child XML Elements
   * @private
   */
   #children = [];

   /**
   * @property {?Twig} #parent - The parent object. Undefined on root element
   * @private
   */
   #parent;

   /**
   * @property {object} #postion - The postion of the element in #children array
   * @private
   */
   #postion = {};

   /**
   * @property {number} #level - Root element is level 0, children have 1 and so on
   * @private
   */
   #level;

   /**
   * Create a new Twig object
   * @param {string} name - The name of the XML element
   * @param {Twig} parent - The parent object
   * @param {?object} attributes - Attriubte object
   */
   constructor(name, parent, attributes) {
      current = this;
      if (name === null) {
         // Root element not available yet
         tree = this;
         this.#level = 0;
      } else {
         this.#name = name;
         if (attributes !== undefined)
            this.#attributes = attributes;
         if (parent === undefined) {
            // Root element
            tree = this;
            this.#level = 0;
         } else {
            this.#parent = parent;
            this.#level = this.#parent.#level + 1;
            parent.#children.push(this);
         }
      }
   }

   /**
   * Purges the current, typically used after element has been processed.<br>The root object cannot be purged.
   */
   purge() {
      if (!this.isRoot)
         this.#parent.#children = this.#parent.#children.filter(x => !Object.is(this, x));
   }

   /**
   * Purges up to the elt element. This allows you to keep part of the tree in memory when you purge.
   * @param {Twig} elt - Up to this element the tree will be purged. If `undefined` then `purge()` is called.<br>
   * The `elt` object itself is not purged. (use `.purge()` is you like to do so)
   */
   purgeUpTo(elt) {
      if (elt === undefined) {
         this.purge();
      } else if (!this.isRoot) {
         let purge = this;
         /*while (!purge.isRoot && Object.is(purge, elt)) {            
            
         }
         */

      }




   }

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
      return this.#level;
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
   * Returns the line where current element is closed
   * @returns {number} Current line
   */
   get line() {
      return this.#postion.line;
   }

   /**
   * Returns the column where current element is closed
   * @returns {number} Current column
   */
   get column() {
      return this.#postion.column;
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
   * @returns {string} Element text
   */
   get text() {
      return this.#text;
   }

   /**
   * Modifies the text of the element
   * @param {string} value - New value of the attribute
   * @throws {UnsupportedType} - If value is not a string or numeric type
   */
   set text(value) {
      if (!['string', 'number', 'bigint'].includes(typeof value))
         throw new UnsupportedType(value);
      if (value !== '')
         this.#text = this.#text ?? '' + value;
   }

   /**
   * Closes the element
   * @param {object} pos - The current possion (line and column) in the XML document
   */
   close = function (pos) {
      this.#postion = pos;
      Object.seal(this);
   }

   /**
   * Internal recursive function used by `writer()`
   * @param {XMLWriter} xw - The writer object
   * @param {Twig[]} children - Array of child elements
   */
   #addChild = function (xw, childArray) {
      for (let elt of childArray) {
         xw.startElement(elt.name);
         if (elt.text !== null)
            xw.text(elt.text);
         if (elt.attributes !== null) {
            for (let key in elt.attributes)
               xw.writeAttribute(key, elt.attributes[key]);
         }
         this.#addChild(xw, elt.children());
         xw.endElement();
      }
   }

   /**
   * Creates xml-writer from current element
   * @param {?boolean|string} indented - `true` or intention character
   * @returns {XMLWriter} 
   */
   writer = function (indented) {
      const XMLWriter = require('xml-writer');
      let xw = new XMLWriter(indented);
      xw.startElement(this.#name);
      for (let key in this.#attributes)
         xw.writeAttribute(key, this.#attributes[key]);
      if (this.#text !== null)
         xw.text(this.#text);
      this.#addChild(xw, this.#children);
      xw.endElement();
      return xw;
   }


   /**
   * Returns attriute value or `null` if not found.<br>
   * If more than one  matches the condition, then it returns object as [attribute()](#attribute)
   * @param {?AttributeCondition} condition - Optional condition to select attribute
   * @returns {string|number|object} - The value of the attrubute or `null` if the  does not exist
   */
   attr = function (condition) {
      let attr = this.attribute(condition);
      if (attr === null)
         return null;

      return Object.keys(attr).length === 1 ? attr[Object.keys(attr)[0]] : attr;
   }

   /**
   * Check if the attribute exist or not
   * @param {string} name - The name of the attribute
   * @returns {boolean} - Returns `true` if the attribute exists, else `false`
   */
   hasAttribute = function (name) {
      return this.#attributes[name] !== undefined;
   }

   /**
   * Retrieve or update XML attribute.
   * @param {?AttributeCondition} condition - Optional condition to select attributes
   * @param {?string|number} text - New value of the attribute
   * @returns {object} Attributes or `null` if no matching attribute found
   * @example attribute((name, val) => { return name === 'age' && val > 50})
   * attribute((name) => { return ['firstName', 'lastName'].includes(name) })
   * attribute('firstName')
   * attribute(/name/i)
   */
   attribute = function (condition, text) {
      if (text === undefined) {
         let attr;
         if (condition === undefined) {
            attr = this.#attributes;
         } else if (typeof condition === 'function') {
            attr = Object.fromEntries(Object.entries(this.#attributes).filter(([key, val]) => condition(key, val)));
         } else if (typeof condition === 'string') {
            attr = this.attribute(key => { return key === condition });
         } else if (condition instanceof RegExp) {
            attr = this.attribute(key => { return condition.test(key) });
         } else if (condition instanceof Twig) {
            throw new UnsupportedCondition(condition, ['string', 'RegEx', 'function']);
         } else {
            return this.attribute();
         }
         return attr === null || Object.keys(attr).length == 0 ? null : attr;
      } else {
         if (text === null) {
            delete this.#attributes[condition];
         } else {
            if (!['string', 'number', 'bigint'].includes(typeof text))
               throw new UnsupportedType(text);
            if (typeof condition !== 'string')
               throw new UnsupportedCondition(condition, ['string']);
            this.#attributes[condition] = text;
         }
      }
   }

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
   }

   /**
   * Returns the parent element or null if root element
   * @returns {Twig} The parament element
   */
   parent = function () {
      return this.isRoot ? null : this.#parent;
   }

   /**
   * @returns {Twig} - The current element
   */
   self = function () {
      return this;
   }

   /**
   * Common function to filter Twig elements from array
   * @param {Twig[]} elts  - Array of elements you like to filter
   * @param {?ElementCondition} condition - The filter condition
   * @returns {Twig[]} List of matching elements or empty array
   */
   filterElements(elts, condition) {
      if (condition === undefined) {
         return elts;
      } else if (typeof condition === 'string') {
         return elts.filter(x => x.name === condition);
         //return this.filterElements(elts, x => { return x === condition });
      } else if (condition instanceof RegExp) {
         return elts.filter(x => x.condition.test(x.name));
      } else if (condition instanceof Twig) {
         return elts.filter(x => Object.is(x, condition));
      } else if (typeof condition === 'function') {
         return elts.filter(x => condition(x.name, x));
      }
   }

   /**
   * All children, optionally matching `condition` of the current element or empty array 
   * @condition {?ElementCondition} condition - Optional condition
   * @returns {Twig[]} 
   */
   children = function (condition) {
      return this.filterElements(this.#children, condition);
   }

   /**
   * Returns the next matching element. 
   * @condition {?ElementCondition} condition - Optional condition
   * @returns {Twig} - The next element
   */
   next = function (condition) {
      if (this.isRoot) {
         return null;
      } else {
         let elt;
         if (this.hasChildren) {
            elt = this.#children[0];
         } else {
            elt = this.#parent.#children[this.index + 1];
            if (elt === undefined) {
               elt = this.#parent;
               elt = elt.#parent.#children[elt.index + 1];
            }
         }
         if (elt === undefined)
            elt = this.root();

         let ret = this.filterElements([elt], condition);
         return ret.length === 0 ? elt.next(condition) : ret[0];
      }
   }

   /**
   * Returns the first matching element. This is usally the first element which has no child elements
   * @condition {?ElementCondition} condition - Optional condition
   * @returns {Twig} - The first element
   */
   first = function (condition) {
      let elt;
      if (this.root().hasChildren) {
         elt = this.root().#children[0];
         while (elt.hasChildren)
            elt = elt.#children[0];
      } else {
         elt = this.root();
      }
      let ret = this.filterElements([elt], condition);
      return ret.length === 0 ? elt.next(condition) : ret[0];
   }

   /**
   * Returns the last matching element. This is usally the root element
   * @condition {?ElementCondition} condition - Optional condition
   * @returns {Twig} - The last element
   */
   last = function (condition) {
      let ret = this.filterElements([this.root()], condition);
      return ret.length === 0 ? this.root().previous(condition) : ret[0];
   }

   previous = function (condition) {
      throw new NotImplementedYet()
   }


   find = function (condition, startAt) {
      throw new NotImplementedYet()
   }

   descendant = function (condition) {
      throw new NotImplementedYet()
   }

   descendantOrSelf = function (condition) {
      throw new NotImplementedYet()
   }


   ancestor = function (condition) {
      throw new NotImplementedYet()
   }

   ancestorOrSelf = function (condition) {
      throw new NotImplementedYet()
   }

   following = function (condition) {
      throw new NotImplementedYet()
   }
   followingSibling = function (condition) {
      throw new NotImplementedYet()
   }

   preceding = function (condition) {
      throw new NotImplementedYet()
   }
   precedingSibling = function (condition) {
      throw new NotImplementedYet()
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
      super(`Parser '${t}' is not supported. Use EXPAT (default) or SAX`);
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

/**
 * Generic error for unsupported data types
 * @exception NotImplementedYet
 */
class NotImplementedYet extends TypeError {
   constructor() {
      super(`Method not yet implemented`);
   }
}




module.exports = { createParser, Twig };

/*
// All events emit with a single argument. To listen to an event, assign a function to on<eventname>. 
sax.EVENTS = [
   'text',
   'processinginstruction',
   'sgmldeclaration',
   'doctype',
   'comment',
   'opentagstart',
   'attribute',
   'opentag',
   'closetag',
   'opencdata',
   'cdata',
   'closecdata',
   'error',
   'end',
   'ready',
   'script',
   'opennamespace',
   'closenamespace'
 ]
parser.onerror = function (e) {
  // an error happened.
};




node-expat.events = {
   #on('startElement' function (name, attrs) {})
   #on('endElement' function (name) {})
   #on('text' function (text) {})
   #on('processingInstruction', function (target, data) {})
   #on('comment', function (s) {})
   #on('xmlDecl', function (version, encoding, standalone) {})
   #on('startCdata', function () {})
   #on('endCdata', function () {})
   #on('entityDecl', function (entityName, isParameterEntity, value, base, systemId, publicId, notationName) {})
   #on('error', function (e) {})
   #stop() pauses
   #resume() resumes
}

*/