const fs = require('fs');
const { isUndefined } = require('util');



//https://metacpan.org/pod/XML::Twig#XML::Twig::Elt

//const XMLWriter = require('xml-writer');

// Generate doc/twog.md with `jsdoc2md --private twig.js > ..\doc\twig.md`
//https://github.com/jsdoc2md/jsdoc-to-markdown




//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment



/**
    * Optional options for the Twig parser
    * - `encoding`: Encoding of the XML File. Applies only to 'expat' parser. Defaults to 'UTF-8'.
    * - `xmlns`: Boolean. If true, then namespaces are supported. Defaults to false.
    * - `trim`: Boolean. If true, then turn any whitespace into a single space. Defaults to true.
    * @typedef {object} parserOptions 
    * @example { encoding: 'UTF-8', xmlns: true }
    */


let tree;
let current;

/**
 * Create a new Twig parser. Currently `expat` (default) and `sax` are supported.
 * @param {?string} method - The underlying parser you like to use, defaults to `expat`
 * @param {?parserOptions} method - Object of optional options 
 * @returns {Parser} - The Twig parser object
 * @throws {UnsupportedParser} - For an unsupported parser
 */
function createParser(method, options) {
   let parser;
   const namespaces = false;
   const trim = true;

   if (options?.xmlns !== undefined && typeof options.xmlns === 'boolean')
      namespaces = options.xmlns;
   if (options?.trim !== undefined && typeof options.trim === 'boolean')
      trim = options.trim;

   if (method === 'sax') {
      // Set options to have the same behaviour as in expat
      parser = require("sax").createStream(true, { strictEntities: true, position: true, xmlns: false, trim: trim });

      // parser.on("error", err =>  {...} does not work, because I need access to 'this'
      parser.on("error", function (err) {
         console.error(`error at line [${this._parser.line + 1}], column [${this._parser.column}]`, err);
         this._parser.error = null;
         this._parser.resume();
      });

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

      parser.on("comment", function (str) {
         current.comment = str;
      })

      parser.on("opentagstart", function (node) {
         if (tree === undefined) {
            tree = new Twig(node.name, current);
         } else {
            if (current.isRoot && current.name === undefined) {
               current.setRoot(node.name);
            } else {
               let elt = new Twig(node.name, current);
            }
         }
      })
      parser.on("attribute", function (attr) {
         for (let key in attr)
            current.attribute(key, attr[key]);
      })
      parser.on("text", function (str) {
         current.text = str;
      })
      parser.on("cdata", function (str) {
         current.text = str;
      })
      parser.on("closetag", function () {
         const pos = { line: this._parser.line + 1, column: this._parser.column };
         current.close(pos);
      })
   } else if (method === undefined || method === null || method === 'node-expat' || method === 'expat') {
      parser = require("node-expat").createParser();
      parser.encoding = options?.encoding === undefined ? 'UTF-8' : options.encoding;

      parser.on('error', function (err) {
         console.error("error!", err)
         this.parser.error = null;
         this.parser.resume();
      });

      parser.on('xmlDecl', function (version, encoding, standalone) {
         console.log(`xmlDecl (line ${this.parser.getCurrentLineNumber()},${this.parser.getCurrentColumnNumber()}) => version: ${version}  encoding: ${encoding}  standalone: ${standalone}`);
      })

      parser.on('processingInstruction', function (target, data) {
         console.log(`processingInstruction (line ${this.parser.getCurrentLineNumber()},${this.parser.getCurrentColumnNumber()}) => ${target} -> ${data}`);
      })

      parser.on('comment', function (s) {
         console.log(`comment (line ${this.parser.getCurrentLineNumber()},${this.parser.getCurrentColumnNumber()}) => ${s}`);
      })

      parser.on('startElement', function (name, attrs) {
         console.log(`startElement (line ${this.parser.getCurrentLineNumber()},${this.parser.getCurrentColumnNumber()}) => ${name} -> ${JSON.stringify(attrs)}`);
      })

      parser.on('text', function (text) {
         console.log(`text (line ${this.parser.getCurrentLineNumber()},${this.parser.getCurrentColumnNumber()}) => ${text.trim()}`);
         // Kann durch Kommentare zerstückelt sein, -> this.#text .= node
      })

      parser.on('endElement', function (name) {
         console.log(`endElement (line ${this.parser.getCurrentLineNumber()},${this.parser.getCurrentColumnNumber()}) => ${name}`);
      })

   } else {
      throw new UnsupportedParser(method)
   }

   return parser;
}




/**
 * Generic class modeling a XML Node
 * @class Twig
 */
class Twig {
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
    * @property {object} # - The postion of the element
    * @private
    */
   #postion = {};

   #declaration;

   #PI;

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
      } else {
         this.#name = name;
         if (attributes !== undefined)
            this.#attributes = attributes;
         if (parent === undefined) {
            console.log(`Create root element ${name}`);
            tree = this;
         } else {
            this.#parent = parent;
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
    * Returns true if element is the root object
    * @returns {boolean} true if root element
    */
   get isRoot() {
      return this.#parent === undefined;
   }

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


   get namespace() {
      return this.#parent === undefined;
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
    * Optional condition to get an attribute<br> 
    * - If `undefined`, then all attributes/elements are returned.<br> 
    * - If `string` then the attribute name must be equal to the string
    * - If RegExp` then the attribute name must match the Regular Expression
    * - For [String.prototype.includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes?retiredLocale=de) match use `{includes: '<name of attribute>'}`<br> 
    * - You can provide custom condistion by callback function, e.g. `(name, text) => { return name === 'foo' && text === 'bar'}`
    * @typedef {string|RegExp|object|function} TwigCondition 
    */


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
    * Retrieve or update XML attribute.
    * @param {?TwigCondition} cond - Optional condition to select attributes
    * @param {?string|number} text - New value of the attribute
    * @returns {object} Attributes or null if no matching attribute found
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
            throw new UnsupportedCondition(cond, ['string', 'RegEx', '{includes: <...>}']);
         } else if (typeof cond === 'object' && cond['includes'] != null) {
            attr = this.attribute(key => { return key.includes(cond.includes) });
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
      super(`Parser '${t}' is not supported. Use 'expat' (default) or 'sax'`);
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