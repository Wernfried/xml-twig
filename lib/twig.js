
//https://metacpan.org/pod/XML::Twig#XML::Twig::Elt

//const XMLWriter = require('xml-writer');

//https://www.npmjs.com/package/libxmljs ?? NodeJS bindings for libxml2 written in Typescript

//https://github.com/jsdoc2md/dmd



//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment



class Comment {
   #text;
}

class CData {
   #text;
}

class PI {
   #text;
}

/**
 * A module for adding two values.
 * @class Elt
 */
class Elt {
   #attributes = {};
   #text;
   #children = [];
   #parent;
   #name;
   #open;

   /**
    * Creeate a new Elt object
    * @param {string} name 
    * @param {?string|number} text 
    * @param {?object} attributes 
    */
   constructor(name, text, attributes) {
      this.#name = name;
      this.#attributes = attributes;
      this.#text = text;
      this.#open = false;
   }


   #addChild = function (xw, elements) {
      for (let child of elements) {
         xw.startElement(child);
         this.#addChild(xw, child);
         xw.endElement();
      }

   }

   dump = function (indented) {

      let xw = new XMLWriter(indented);
      xw.startElement(this.#name);
      for (let key in this.#attributes)
         xw.writeAttribute(key, this.#attributes[key]);
      if (this.#text !== undefined && this.#text !== null)
         xw.text(this.#text);

      this.#addChild(xw, this.#children);
      xw.endDocument();

      return xw;

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
    * The text of the element
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
      this.#text = value;
   }

   get namespace() {
      return this.#parent === undefined;
   }
   get processingInstruction() {
      return this.#parent === undefined;
   }
   get comment() {
      return this.#parent === undefined;
   }

   get comment() {
      return this.#parent === undefined;
   }

   /**
    * Closes the element
    */
   close = function () {
      this.#open = false;
   }


   attr = function (name) {
      let attr = attribute(name);
      return attr === null ? null : attribute(cond).value;
   }


   /**
    * Retrive or update XML attribute.
    * @param {?string|RegExp|object|function} cond - If undefined, then all attributes are returned. 
    * If string or RegExp then attributes matching this string are returned. 
    * For [String.prototype.includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes?retiredLocale=de) match use `{includes: '<name of attribute>'}`
    * You can provide any filter by callback function, e.g. `(name, text) => { return name === 'foo' && text === 'bar'}`
    * @param {?string} text - New value of the attribute
    * @returns {string|object} Attributes or null if no matching attribute found
    */
   attribute = function (cond, text) {
      if (text === undefined) {
         let attr;
         if (cond === undefined) {
            attr = this.#attributes;
         } else if (typeof cond === 'string') {
            attr = Object.fromEntries(Object.entries(this.#attributes).filter(([key]) => key === cond));
         } else if (typeof cond === 'function') {
            attr = Object.fromEntries(Object.entries(this.#attributes).filter(([key, text]) => cond(key, text)));
         } else if (cond instanceof RegExp) {
            attr = Object.fromEntries(Object.entries(this.#attributes).filter(([key]) => cond.test(key)));
         } else if (cond instanceof Elt) {
            throw new UnsupportedCondition(cond, ['string', 'RegEx', '{includes: <...>}']);
         } else if (typeof cond === 'object' && cond['includes'] != null) {
            attr = Object.fromEntries(Object.entries(this.#attributes).filter(([key]) => key.includes(cond.includes)));
         } else {
            return this.attribute();
         }
         return Object.keys(attr).length == 0 ? null : attr;
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

   child = function (filter, strict = false) {
   }

   descendant = function (filter, strict = false) {
   }

   descendantOrSelf = function (filter, strict = false) {
   }

   root = function (filter, strict = false) {
   }

   ancestor = function (filter, strict = false) {
   }

   ancestorOrSelf = function (filter, strict = false) {
   }

   following = function (filter, strict = false) {
   }
   followingSibling = function (filter, strict = false) {
   }
   parent = function (filter, strict = false) {
   }
   preceding = function (filter, strict = false) {
   }
   precedingSibling = function (filter, strict = false) {
   }

   self = function () {
      return this;
   }

}


/**
 * Generic error for unsupported data types
 * @exception {UnsupportedType}
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
 * @exception {UnsupportedCondition}
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


const obj = new Elt('tag', null, { firstName: 'Jean-Luc', lastName: 'Picard', age: 59 });

console.log(`attribute => ${JSON.stringify(obj.attribute())}`);
console.log(`attribute("FIRSTNAME") => ${JSON.stringify(obj.attribute("FIRSTNAME"))}`);
console.log(`attribute("firstName") => ${JSON.stringify(obj.attribute("firstName"))}`);
console.log(`attribute({includes: 'Name'}) => ${JSON.stringify(obj.attribute({ includes: 'Name' }))}`);
console.log(`attribute({includes: 'name'}) => ${JSON.stringify(obj.attribute({ includes: 'name' }))}`);
console.log(`attribute => ${JSON.stringify(obj.attribute( (attr, val) => {return attr === 'age' && val > 50}))}`);
console.log(`attribute(/name/i) => ${JSON.stringify(obj.attribute(/name/i))}`);


module.exports = {   Elt }; 

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