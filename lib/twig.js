
//https://metacpan.org/pod/XML::Twig#XML::Twig::Elt



class Elt {
   #attributes = {};
   #text;
   #children = [];
   #parent;
   #name;

   constructor(name, attributes, text) {
      this.#name = name;
      this.#attributes = attributes;
      this.#text = text;
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
    * Retrive or update XML attribute.
    * @param {?string|RegExp|object} cond - If undefined, then all attributes are returned. 
    *        If string or RegExp then attributes matching this string are returned. For exact match use {name: '<name of attribute>'}
    *        If only one attributes matches, then the attribute value is returned.
    * @param {?string} value - New value of the attribute
    * @returns {string|object} Attributes or attribute value
    */
   attribute = function (cond, value) {
      if (value === undefined) {
         let attr;
         if (cond === undefined) {
            attr = this.#attributes;
         } else if (typeof cond === 'string') {
            attr = Object.fromEntries(Object.entries(this.#attributes).filter(([key]) => key.includes(cond)));
         } else if (cond instanceof RegExp) {
            attr = Object.fromEntries(Object.entries(this.#attributes).filter(([key]) => cond.test(key)));
         } else if (cond instanceof Elt) {
            throw new UnsupportedCondition(cond, ['string', 'RegEx', '{name: <...>}']);
         } else if (typeof cond === 'object' && cond['name'] != null) {
            return this.#attributes[cond.name];
         } else {
            return this.attribute();
         }
         return Object.keys(attr).length == 1 ? this.#attributes[Object.keys(attr)[0]] : attr;
      } else {
         if (!['string', 'number', 'bigint'].includes(typeof value))
            throw new UnsupportedType(value);
         if (typeof value !== 'string')
            throw new UnsupportedCondition(cond, ['string']);
         this.#attributes[cond] = value;
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


class UnsupportedType extends TypeError {
   constructor(t) {
      super(`Type ${typeof t} is not supported in XML`);
   }
}

class UnsupportedCondition extends TypeError {
   constructor(cond, t) {
      super(`Condition '${JSON.stringify(cond)}' must be a ${t.map(x => `'${x}'`).join(' or ')}`);
   }
}


const obj = new Elt('tag', { firstName: 'Jean-Luc', lastName: 'Picard', age: 59 });

console.log(`attribute => ${JSON.stringify(obj.attribute())}`);
console.log(`attribute("name") => ${JSON.stringify(obj.attribute("name"))}`);
console.log(`attribute("Name") => ${JSON.stringify(obj.attribute("Name"))}`);
console.log(`attribute("firstName") => ${JSON.stringify(obj.attribute("firstName"))}`);
console.log(`attribute({name: 'FirstName'}) => ${JSON.stringify(obj.attribute({ name: 'FirstName' }))}`);
console.log(`attribute({name: 'firstName'}) => ${JSON.stringify(obj.attribute({ name: 'firstName' }))}`);
console.log(`attribute(/name/i) => ${JSON.stringify(obj.attribute(/name/i))}`);


//module.exports = {   Elt, }; 

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