const fs = require('fs');

const SAX = 'sax';
const EXPAT = 'expat';

//https://metacpan.org/pod/XML::Twig#XML::Twig::Elt

//const XMLWriter = require('xml-writer');

// Generate doc/twog.md with `jsdoc2md --private twig.js > ..\doc\twig.md`
//https://github.com/jsdoc2md/jsdoc-to-markdown




//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment



/**
 * Optional options for the Twig parser
 * @typedef ParserOptions 
 * @param {string} method - The underlaying parser. Either SAX or EXPAT.
 * @param {string} encoding - Encoding of the XML File. Applies only to EXPAT parser.
 * @param {boolean} xmlns - If true, then namespaces are supported.
 * @param {boolean} trim - If true, then turn any whitespace into a single space.
 * @param {boolean} resumeAfterError - If true then parser continues reading after an error. Otherwiese it throws exception.
 * @param {boolean} partial - It true then unhandled elements are purged.
 * @example { encoding: 'UTF-8', xmlns: true }
 * @default  { method: EXPAT, encoding: 'UTF-8', xmlns: false, trim: true, resumeAfterError: false, partial: false }
 */


/**
* Handler functions for Twig objects.<br>
* If `name` is not specified, then handler is called on every element. Otherwise the element name must be equal to the string or Regular Expression
* @typedef TwigHandler 
* @param {?string|RegExp} name - Name of handled element or any element if not specified
* @param {function} function - Definition of handler function, either anonymous or explict function
*/



let tree;
let current;

/**
 * Create a new Twig parser
 * @param {TwigHandler|TwigHandler[]} handler - Function or array of function to handle elements
 * @param {?ParserOptions} options - Object of optional options 
 * @throws {UnsupportedParser} - For an unsupported parser. Currently `expat` (default) and `sax` are supported.
 * @example 
 * function rootHandler(tree, elt) {
 *   console.log(elt.name);
 * }
 * createParser(rootHandler, { method: SAX });
 * @example 
 * function oneHandlerForAll(tree, elt) {
 *   console.log(elt.name);
 * }
 * createParser(
 *   [ {function: oneHandlerForAll} ], 
 *   { method: SAX }
 * );
 * @example 
 * function bookHandler(tree, elt) {
 *   console.log(elt.name);
 * }
 * function customerHandler(tree, elt) {
 *   console.log(elt.name);
 * }
 * createParser(
 *   [ {name: 'book', function: bookHandler}, {name: 'customer', function: customerHandler} ], 
 *   { method: SAX }
 * );
 */
function createParser(handler, options) {
   options = Object.assign({ method: EXPAT, encoding: 'UTF-8', xmlns: false, trim: true, resumeAfterError: false, partial: false }, options)
   let parser;
   let events = {};
   let namespaces = {};

   if (options.method === SAX) {
      // Set options to have the same behaviour as in expat
      parser = require("sax").createStream(true, { strictEntities: true, position: true, xmlns: options.xmlns, trim: options.trim });

      events = { method: SAX, create: "opentagstart", close: "closetag" };

      // parser.on("error", err =>  {...} does not work, because I need access to 'this'
      parser.on("processinginstruction", function (pi) {
         if (pi.name === 'xml') {
            let declaration = {};
            for (let item of pi.body.split(' ')) {
               let [k, v] = item.split('=');
               declaration[k] = v.replaceAll('"', '').replaceAll("'", '');
            }
            tree = new Twig(null);
            current.declaration = declaration;
         } else {
            tree.PI = { target: pi.name, data: pi.body };
         }
      })

      parser.on("attribute", function (attr) {
         current.attribute(attr.name, attr.value);
         if (attr.uri !== undefined && attr.uri !== '') {
            namespaces[attr.local] = attr.uri;
            current.namespace = { local: attr.local, uri: attr.uri };
         }
      })
      parser.on("cdata", function (str) {
         current.text = str;
      })

      if (typeof handler === 'function') {
         parser.on("end", function () {
            handler(tree);
         })
      }
   } else if (options.method === EXPAT) {
      parser = require("node-expat").createParser();
      parser.encoding = options.encoding;
      events = { method: EXPAT, create: "startElement", close: "endElement" };

      parser.on('xmlDecl', function (version, encoding, standalone) {
         tree = new Twig(null);
         let dec = {};
         if (version !== undefined) dec.version = version;
         if (encoding !== undefined) dec.encoding = encoding;
         if (standalone !== undefined) dec.standalone = standalone;
         current.declaration = dec;
      })

      parser.on('processingInstruction', function (target, data) {
         tree.PI = { target: target, data: data };
      })
   } else {
      throw new UnsupportedParser(options.method);
   }

   parser.on(events.create, function (node, attrs) {
      let name = node;
      if (events.method === SAX)
         name = node.name;

      if (tree === undefined) {
         tree = new Twig(name, current, attrs);
      } else {
         if (current.isRoot && current.name === undefined) {
            current.setRoot(name);
         } else {
            let elt = new Twig(name, current, attrs);
         }
      }
      if (options.xmlns) {
         if (events.method === SAX && name.includes(':')) {
            let prefix = name.split(':')[0];
            if (namespaces[prefix] !== undefined)
               current.namespace = { local: prefix, uri: namespaces[prefix] };
         } else if (events.method === EXPAT) {
            for (let key of Object.keys(attrs).filter(x => x.startsWith('xmlns:')))
               namespaces[key.split(':')[1]] = attrs[key];
            if (name.includes(':')) {
               let prefix = name.split(':')[0];
               if (namespaces[prefix] !== undefined)
                  current.namespace = { local: prefix, uri: namespaces[prefix] };
            }
         }
      }
   })

   parser.on(events.close, function (name) {
      let pos;
      if (events.method === SAX) {
         pos = { line: this._parser.line + 1, column: this._parser.column + 1 };
      } else if (events.method === EXPAT) {
         pos = { line: this.parser.getCurrentLineNumber(), column: this.parser.getCurrentColumnNumber() };
      }
      console.log(`Close ${current.name}`);
      current.close(pos);

      /*if (typeof handler === 'function' && events.method === EXPAT && current === undefined) {
         handler(tree);
      } else if (Array.isArray(handler)) {
         if (typeof handler.name === 'string' && name === handler.name)
            handler.function
         else if (typeof handler.includes === 'string' && name.includes(handler.includes))
            handler.function
         else if (handler.name instanceof RegExp && handler.regex.test(name))
            handler.function;
      }*/
   })


   parser.on('text', function (str) {
      current.text = options.trim ? str.trim() : str;
   })

   parser.on("comment", function (str) {
      current.comment = options.trim ? str.trim() : str;;
   })

   parser.on('error', function (err) {
      let p;
      if (events.method === SAX) {
         p = this._parser;
         console.error(`error at line [${p.line + 1}], column [${p.column + 1}]`, err);
      } else if (events.method === EXPAT) {
         p = this.parser;
         console.error(`error at line [${p.getCurrentLineNumber()}], column [${p.getCurrentColumnNumber()}]`, err);
      }
      if (resumeAfterError) {
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
   * Optional condition to get elements<br> 
   * - If `undefined`, then all elements are returned.<br> 
   * - If `string` then the element name must be equal to the string
   * - If `RegExp` then the element name must match the Regular Expression
   * - If [ElementConditionFilter](#ElementConditionFilter) then the element must filter function 
   * - Use [Twig](#Twig) object to find a specific element
   * @typedef {string|RegExp|ElementConditionFilter|Twig} ElementCondition 
   */

   /**
   * 
   * Custom filter function to get desired elements
   * @typedef {function} ElementConditionFilter 
   * @param {string} name - Name of the element
   * @param {Twig} elt - The full element Twig object
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
   #text;

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
   * @property {object} #namespace - XML Namespace of the element. Only used when parsed  with `xmlns: true`
   * @private
   */
   #namespace;

   /**
   * @property {object} #declaration - XML Declaration object, exist only on root
   * @private
   */
   #declaration;

   /**
   * @property {object} #PI - XML Declaration object, exist only on root
   * @private
   */
   #PI;

   /**
   * @property {string|string[]} #comment - Comment inside the XML Elements
   * @private
   */
   #comment;

   /**
   * Create a new Twig object
   * @param {string} name - The name of the XML element
   * @param {Twig} parent - The parent object
   * @param {?object} attributes - Attriubte object
   */
   constructor(name, parent, attributes) {
      current = this;
      if (name === null) {
         console.log(`Create empty root`);
         // Root element not available yet
         tree = this;
         this.#level = 0;
      } else {
         this.#name = name;
         if (attributes !== undefined)
            this.#attributes = attributes;
         if (parent === undefined) {
            console.log(`Create root element ${name}`);
            tree = this;
            this.#level = 0;
         } else {
            this.#parent = parent;
            this.#level = this.#parent.#level + 1;
            parent.#children.push(this);
            console.log(`Create element ${name} in ${current.#parent.#name}`);
         }
      }
   }

   setRoot(name) {
      console.log(`Update root element to ${name}`);
      if (this.isRoot)
         this.#name = name;
   }

   /**
   * Returns true if the element is empty, otherwise false.
   * An empty element ha no text nor any child elements, however empty elements can have attributes.
   * @returns {boolean} true if empty element
   */
   get isEmpty() {
      return this.#text === undefined && this.#children.length == 0;
   }

   /**
   * Returns the level of the element. Root element has 0, children jave 1, grand-children 2 and so on
   * @returns {number} The level of the element. 
   */
   get level() {
      return this.#level;
   }

   /**
   * Returns true if element is the root object
   * @returns {boolean} true if root element
   */
   get isRoot() {
      return this.#parent === undefined;
   }

   /**
   * Returns the root object
   * @returns {Twig} The root element of XML tree
   */
   get root() {
      if (this.isRoot)
         return this
      else
         return root(this.#parent);
   }

   /**
   * Returns true if element has child elements
   * @returns {boolean} true if has child elements exists
   */
   get hasChildren() {
      return this.#children.length > 0;
   }


   /**
   * Returns the line where current element is closed
   * @returns {number} Current line
   */
   get currentLine() {
      return this.#postion.line;
   }

   /**
   * Returns the name of the element. Same as tag()
   * @returns {string} Element name
   */
   get name() {
      return this.#name;
   }
   /**
   * Returns the name of the element. Same as name()
   * @returns {string} Element name
   */
   get tag() {
      return this.name();
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
      this.#text = this.#text ?? '' + value.toString();
   }

   /**
   * Comment in element. A XML Element may contain an array of multiple comments.
   * @returns {string|string[]} The comment or an array of all comments
   */
   get comment() {
      return this.#comment;
   }
   /**
   * Modifies the comment of the element. A XML Element may contain an array of multiple comments.
   * @param {string} str - New comment to be added
   */
   set comment(str) {
      if (this.#comment === undefined)
         this.#comment = str
      else if (typeof this.#comment === 'string')
         this.#comment = [this.#comment, str]
      else
         this.#comment.push(str);
   }

   /**
   * The XML declaration. Available only on root element.
   * @returns {string} The declaration of the XML
   */
   get declaration() {
      return this.isRoot ? null : this.#declaration;
   }
   /**
   * Set the XML declaration
   * @param {object} dec - The XML declaration, e.g. `{ version: "1.0", encoding:"UTF-8" }`
   */
   set declaration(dec) {
      if (this.isRoot)
         this.#declaration = dec;
   }

   /**
   * The XML declaration. Available only on root element.
   * @returns {string|string[]} The declaration of the XML
   */
   get PI() {
      return this.isRoot ? null : this.#PI;
   }
   /**
   * Set Processing Instruction. According ty my knowlege a XML must not contain more than one PI
   * @param {object} pi - The Processing Instruction object in form of `{ target: <target>, data: <instruction> }`. 
   */
   set PI(pi) {
      if (this.isRoot)
         this.#PI = pi;
   }

   /**
   * The XML namespace
   * @returns {object} The XML namespace of the element
   */
   get namespace() {
      return this.#namespace;
   }
   /**
   * Set the XML namespace
   * @param {object} nw - XML namespace definition
   */
   set namespace(ns) {
      this.#namespace = ns;
   }


   /**
   * Closes the element
   * @param {object} pos - The current possion (line and column) in the XML document
   */
   close = function (pos) {
      this.#postion = pos;
      Object.seal(this);
      current = this.#parent;
   }




   dump = function (indented) {
      addChild = function (xw, elements) {
         for (let child of elements) {
            xw.startElement(child);
            this.writer.addChild(xw, child);
            xw.endElement();
         }
      }

      const XMLWriter = require('xml-writer');
      const xw = new XMLWriter(indented);
      xw.startElement(this.#name);
      for (let key in this.#attributes)
         xw.writeAttribute(key, this.#attributes[key]);
      if (this.#text !== undefined && this.#text !== null)
         xw.text(this.#text);

      addChild(xw, this.#children);
      xw.endDocument();

      return xw;
   }



   /**
   * 
   * @param {string} name - The name of the attribute
   * @returns {string|number} - The value of the attrubute or `null` if the attribute does not exist
   */
   attr = function (name) {
      let attr = attribute(name);
      return attr === null ? null : attribute(cond).value;
   }

   /**
   * Check if the attribute exist or not
   * @param {string} name - The name of the attribute
   * @returns {boolean} - Returns true if the attribute exists, else false
   */
   hasAttribute = function (name) {
      return attribute(name) !== null;
   }



   /**
   * Retrieve or update XML attribute.
   * @param {?AttributeCondition} cond - Optional condition to select attributes
   * @param {?string|number} text - New value of the attribute
   * @returns {object} Attributes or `null` if no matching attribute found
   * @example attribute((name, val) => { return name === 'age' && val > 50})
   * attribute((name) => { return ['firstName', 'lastName'].includes(name) })
   * attribute('firstName')
   * attribute(/name/i)
   */
   attribute = function (cond, text) {
      if (text === undefined) {
         let attr;
         if (cond === undefined) {
            attr = this.#attributes;
         } else if (typeof cond === 'function') {
            attr = Object.fromEntries(Object.entries(this.#attributes).filter(([key, text]) => cond(key, text)));
         } else if (typeof cond === 'string') {
            attr = this.attribute(key => { return key === cond });
         } else if (cond instanceof RegExp) {
            attr = this.attribute(key => { return cond.test(key) });
         } else if (cond instanceof Twig) {
            throw new UnsupportedCondition(cond, ['string', 'RegEx', 'function']);
         } else {
            return this.attribute();
         }
         return attr === null || Object.keys(attr).length == 0 ? null : attr;
      } else {
         if (text === null) {
            delete this.#attributes[code];
         } else {
            if (!['string', 'number', 'bigint'].includes(typeof text))
               throw new UnsupportedType(text);
            if (typeof text !== 'string')
               throw new UnsupportedCondition(cond, ['string']);
            this.#attributes[cond] = text;
         }
      }
   }

   /**
   * Returns the parent element or null if root element
   * @returns {Twig} The parament element
   */
   get parent() {
      return this.isRoot ? null : this.#parent;
   }


   child = function (filter, strict = false) {
      throw new NotImplementedYet()
   }

   descendant = function (filter, strict = false) {
      throw new NotImplementedYet()
   }

   descendantOrSelf = function (filter, strict = false) {
      throw new NotImplementedYet()
   }


   ancestor = function (filter, strict = false) {
      throw new NotImplementedYet()
   }

   ancestorOrSelf = function (filter, strict = false) {
      throw new NotImplementedYet()
   }

   following = function (filter, strict = false) {
      throw new NotImplementedYet()
   }
   followingSibling = function (filter, strict = false) {
      throw new NotImplementedYet()
   }

   preceding = function (filter, strict = false) {
      throw new NotImplementedYet()
   }
   precedingSibling = function (filter, strict = false) {
      throw new NotImplementedYet()
   }

   next = function (filter, strict = false) {
      throw new NotImplementedYet()
   }
   previous = function (filter, strict = false) {
      throw new NotImplementedYet()
   }

   self = function () {
      return this;
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
   * @param {*} cond The condition value
   * @param {string[]} t List of supported data types
   */
   constructor(cond, t) {
      super(`Condition '${JSON.stringify(cond)}' must be a ${t.map(x => `'${x}'`).join(' or ')}`);
   }
}

/**
 * Generic error for unsupported data types
 * @exception NotImplementedYet
 */
class NotImplementedYet extends TypeError {
   /**
   * @param {*} cond The condition value
   * @param {string[]} t List of supported data types
   */
   constructor() {
      super(`Method not yet implemented`);
   }
}




module.exports = { createParser };

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