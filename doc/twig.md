## Classes

<dl>
<dt><a href="#Twig">Twig</a></dt>
<dd></dd>
<dt><a href="#Twig">Twig</a></dt>
<dd></dd>
<dt><a href="#UnsupportedParser">UnsupportedParser</a></dt>
<dd><p>Error for unsupported data types</p>
</dd>
<dt><a href="#UnsupportedType">UnsupportedType</a></dt>
<dd><p>Generic error for unsupported data types</p>
</dd>
<dt><a href="#UnsupportedCondition">UnsupportedCondition</a></dt>
<dd><p>Generic error for unsupported data types</p>
</dd>
<dt><a href="#NotImplementedYet">NotImplementedYet</a></dt>
<dd><p>Generic error for unsupported data types</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#createParser">createParser(method, method)</a> ⇒ <code>Parser</code></dt>
<dd><p>Create a new Twig parser. Currently <code>expat</code> (default) and <code>sax</code> are supported.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#parserOptions">parserOptions</a> : <code>object</code></dt>
<dd><p>Optional options for the Twig parser</p>
<ul>
<li><code>encoding</code>: Encoding of the XML File. Applies only to &#39;expat&#39; parser. Defaults to &#39;UTF-8&#39;.</li>
<li><code>xmlns</code>: Boolean. If true, then namespaces are supported. Defaults to false.</li>
<li><code>trim</code>: Boolean. If true, then turn any whitespace into a single space. Defaults to true.</li>
</ul>
</dd>
<dt><a href="#TwigCondition">TwigCondition</a> : <code>string</code> | <code>RegExp</code> | <code>object</code> | <code>function</code></dt>
<dd><p>Optional condition to get an attribute<br> </p>
<ul>
<li>If <code>undefined</code>, then all attributes/elements are returned.<br> </li>
<li>If <code>string</code> then the attribute name must be equal to the string</li>
<li>If RegExp` then the attribute name must match the Regular Expression</li>
<li>For <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes?retiredLocale=de">String.prototype.includes</a> match use <code>{includes: &#39;&lt;name of attribute&gt;&#39;}</code><br> </li>
<li>You can provide custom condistion by callback function, e.g. <code>(name, text) =&gt; { return name === &#39;foo&#39; &amp;&amp; text === &#39;bar&#39;}</code></li>
</ul>
</dd>
</dl>

<a name="Twig"></a>

## Twig
**Kind**: global class  

* [Twig](#Twig)
    * [new Twig()](#new_Twig_new)
    * [new Twig(name, parent, attributes)](#new_Twig_new)
    * [.attributes](#Twig+attributes) ℗
    * [.text](#Twig+text) ℗
    * [.name](#Twig+name) ℗
    * [.children](#Twig+children) ℗
    * [.parent](#Twig+parent) ℗
    * [.postion](#Twig+postion) ℗
    * [.isEmpty](#Twig+isEmpty) ⇒ <code>boolean</code>
    * [.isRoot](#Twig+isRoot) ⇒ <code>boolean</code>
    * [.hasChildren](#Twig+hasChildren) ⇒ <code>boolean</code>
    * [.currentLine](#Twig+currentLine) ⇒ <code>number</code>
    * [.name](#Twig+name) ⇒ <code>string</code>
    * [.tag](#Twig+tag) ⇒ <code>string</code>
    * [.text](#Twig+text) ⇒ <code>string</code>
    * [.text](#Twig+text)
    * [.comment](#Twig+comment) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
    * [.comment](#Twig+comment)
    * [.declaration](#Twig+declaration) ⇒ <code>string</code>
    * [.declaration](#Twig+declaration)
    * [.PI](#Twig+PI) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
    * [.PI](#Twig+PI)
    * [.close](#Twig+close)
    * [.attr](#Twig+attr) ⇒ <code>string</code> \| <code>number</code>
    * [.attribute](#Twig+attribute) ⇒ <code>object</code>
    * [.parent](#Twig+parent) ⇒ [<code>Twig</code>](#Twig)

<a name="new_Twig_new"></a>

### new Twig()
Generic class modeling a XML Node

<a name="new_Twig_new"></a>

### new Twig(name, parent, attributes)
Create a new Twig object


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the XML element |
| parent | [<code>Twig</code>](#Twig) | The parent object |
| attributes | <code>object</code> | Attriubte object |

<a name="Twig+attributes"></a>

### twig.attributes ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #attributes | <code>object</code> | XML attribute `{ <attribute 1>: <value 1>, <attribute 2>: <value 2>, ... }` |

<a name="Twig+text"></a>

### twig.text ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #text | <code>string</code> \| <code>number</code> | Content of XML Element |

<a name="Twig+name"></a>

### twig.name ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #name | <code>string</code> | The XML tag name |

<a name="Twig+children"></a>

### twig.children ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #children | [<code>Array.&lt;Twig&gt;</code>](#Twig) | Child XML Elements |

<a name="Twig+parent"></a>

### twig.parent ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #parent | [<code>Twig</code>](#Twig) | The parent object. Undefined on root element |

<a name="Twig+postion"></a>

### twig.postion ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| # | <code>object</code> | The postion of the element |

<a name="Twig+isEmpty"></a>

### twig.isEmpty ⇒ <code>boolean</code>
Returns true if the element is empty, otherwise false.An empty element ha no text nor any child elements, however empty elements can have attributes.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - true if empty element  
<a name="Twig+isRoot"></a>

### twig.isRoot ⇒ <code>boolean</code>
Returns true if element is the root object

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - true if root element  
<a name="Twig+hasChildren"></a>

### twig.hasChildren ⇒ <code>boolean</code>
Returns true if element has child elements

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - true if has child elements exists  
<a name="Twig+currentLine"></a>

### twig.currentLine ⇒ <code>number</code>
Returns the line where current element is closed

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>number</code> - Current line  
<a name="Twig+name"></a>

### twig.name ⇒ <code>string</code>
Returns the name of the element. Same as tag()

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> - Element name  
<a name="Twig+tag"></a>

### twig.tag ⇒ <code>string</code>
Returns the name of the element. Same as name()

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> - Element name  
<a name="Twig+text"></a>

### twig.text ⇒ <code>string</code>
The text of the element. No matter if given as text or CDATA entity

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> - Element text  
<a name="Twig+text"></a>

### twig.text
Modifies the text of the element

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Throws**:

- [<code>UnsupportedType</code>](#UnsupportedType) - If value is not a string or numeric type


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | New value of the attribute |

<a name="Twig+comment"></a>

### twig.comment ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
Comment in element. A XML Element may contain an array of multiple comments.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> \| <code>Array.&lt;string&gt;</code> - The comment or an array of all comments  
<a name="Twig+comment"></a>

### twig.comment
Modifies the comment of the element. A XML Element may contain an array of multiple comments.

**Kind**: instance property of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | New comment to be added |

<a name="Twig+declaration"></a>

### twig.declaration ⇒ <code>string</code>
The XML declaration. Available only on root element.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> - The declaration of the XML  
<a name="Twig+declaration"></a>

### twig.declaration
Set the XML declaration

**Kind**: instance property of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| dec | <code>object</code> | The XML declaration, e.g. `{ version: "1.0", encoding:"UTF-8" }` |

<a name="Twig+PI"></a>

### twig.PI ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
The XML declaration. Available only on root element.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> \| <code>Array.&lt;string&gt;</code> - The declaration of the XML  
<a name="Twig+PI"></a>

### twig.PI
Set Processing Instruction. According ty my knowlege a XML must not contain more than one PI

**Kind**: instance property of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| pi | <code>object</code> | The Processing Instruction object in form of `{ target: <target>, data: <instruction> }`. |

<a name="Twig+close"></a>

### twig.close
Closes the element

**Kind**: instance property of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| pos | <code>object</code> | The current possion (line and column) in the XML document |

<a name="Twig+attr"></a>

### twig.attr ⇒ <code>string</code> \| <code>number</code>
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> \| <code>number</code> - - The value of the attrubute or `null` if the attribute does not exist  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the attribute |

<a name="Twig+attribute"></a>

### twig.attribute ⇒ <code>object</code>
Retrieve or update XML attribute.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>object</code> - Attributes or null if no matching attribute found  

| Param | Type | Description |
| --- | --- | --- |
| cond | [<code>TwigCondition</code>](#TwigCondition) | Optional condition to select attributes |
| text | <code>string</code> \| <code>number</code> | New value of the attribute |

<a name="Twig+parent"></a>

### twig.parent ⇒ [<code>Twig</code>](#Twig)
Returns the parent element or null if root element

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - The parament element  
<a name="Twig"></a>

## Twig
**Kind**: global class  

* [Twig](#Twig)
    * [new Twig()](#new_Twig_new)
    * [new Twig(name, parent, attributes)](#new_Twig_new)
    * [.attributes](#Twig+attributes) ℗
    * [.text](#Twig+text) ℗
    * [.name](#Twig+name) ℗
    * [.children](#Twig+children) ℗
    * [.parent](#Twig+parent) ℗
    * [.postion](#Twig+postion) ℗
    * [.isEmpty](#Twig+isEmpty) ⇒ <code>boolean</code>
    * [.isRoot](#Twig+isRoot) ⇒ <code>boolean</code>
    * [.hasChildren](#Twig+hasChildren) ⇒ <code>boolean</code>
    * [.currentLine](#Twig+currentLine) ⇒ <code>number</code>
    * [.name](#Twig+name) ⇒ <code>string</code>
    * [.tag](#Twig+tag) ⇒ <code>string</code>
    * [.text](#Twig+text) ⇒ <code>string</code>
    * [.text](#Twig+text)
    * [.comment](#Twig+comment) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
    * [.comment](#Twig+comment)
    * [.declaration](#Twig+declaration) ⇒ <code>string</code>
    * [.declaration](#Twig+declaration)
    * [.PI](#Twig+PI) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
    * [.PI](#Twig+PI)
    * [.close](#Twig+close)
    * [.attr](#Twig+attr) ⇒ <code>string</code> \| <code>number</code>
    * [.attribute](#Twig+attribute) ⇒ <code>object</code>
    * [.parent](#Twig+parent) ⇒ [<code>Twig</code>](#Twig)

<a name="new_Twig_new"></a>

### new Twig()
Generic class modeling a XML Node

<a name="new_Twig_new"></a>

### new Twig(name, parent, attributes)
Create a new Twig object


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the XML element |
| parent | [<code>Twig</code>](#Twig) | The parent object |
| attributes | <code>object</code> | Attriubte object |

<a name="Twig+attributes"></a>

### twig.attributes ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #attributes | <code>object</code> | XML attribute `{ <attribute 1>: <value 1>, <attribute 2>: <value 2>, ... }` |

<a name="Twig+text"></a>

### twig.text ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #text | <code>string</code> \| <code>number</code> | Content of XML Element |

<a name="Twig+name"></a>

### twig.name ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #name | <code>string</code> | The XML tag name |

<a name="Twig+children"></a>

### twig.children ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #children | [<code>Array.&lt;Twig&gt;</code>](#Twig) | Child XML Elements |

<a name="Twig+parent"></a>

### twig.parent ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #parent | [<code>Twig</code>](#Twig) | The parent object. Undefined on root element |

<a name="Twig+postion"></a>

### twig.postion ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| # | <code>object</code> | The postion of the element |

<a name="Twig+isEmpty"></a>

### twig.isEmpty ⇒ <code>boolean</code>
Returns true if the element is empty, otherwise false.An empty element ha no text nor any child elements, however empty elements can have attributes.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - true if empty element  
<a name="Twig+isRoot"></a>

### twig.isRoot ⇒ <code>boolean</code>
Returns true if element is the root object

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - true if root element  
<a name="Twig+hasChildren"></a>

### twig.hasChildren ⇒ <code>boolean</code>
Returns true if element has child elements

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - true if has child elements exists  
<a name="Twig+currentLine"></a>

### twig.currentLine ⇒ <code>number</code>
Returns the line where current element is closed

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>number</code> - Current line  
<a name="Twig+name"></a>

### twig.name ⇒ <code>string</code>
Returns the name of the element. Same as tag()

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> - Element name  
<a name="Twig+tag"></a>

### twig.tag ⇒ <code>string</code>
Returns the name of the element. Same as name()

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> - Element name  
<a name="Twig+text"></a>

### twig.text ⇒ <code>string</code>
The text of the element. No matter if given as text or CDATA entity

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> - Element text  
<a name="Twig+text"></a>

### twig.text
Modifies the text of the element

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Throws**:

- [<code>UnsupportedType</code>](#UnsupportedType) - If value is not a string or numeric type


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | New value of the attribute |

<a name="Twig+comment"></a>

### twig.comment ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
Comment in element. A XML Element may contain an array of multiple comments.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> \| <code>Array.&lt;string&gt;</code> - The comment or an array of all comments  
<a name="Twig+comment"></a>

### twig.comment
Modifies the comment of the element. A XML Element may contain an array of multiple comments.

**Kind**: instance property of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | New comment to be added |

<a name="Twig+declaration"></a>

### twig.declaration ⇒ <code>string</code>
The XML declaration. Available only on root element.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> - The declaration of the XML  
<a name="Twig+declaration"></a>

### twig.declaration
Set the XML declaration

**Kind**: instance property of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| dec | <code>object</code> | The XML declaration, e.g. `{ version: "1.0", encoding:"UTF-8" }` |

<a name="Twig+PI"></a>

### twig.PI ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
The XML declaration. Available only on root element.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> \| <code>Array.&lt;string&gt;</code> - The declaration of the XML  
<a name="Twig+PI"></a>

### twig.PI
Set Processing Instruction. According ty my knowlege a XML must not contain more than one PI

**Kind**: instance property of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| pi | <code>object</code> | The Processing Instruction object in form of `{ target: <target>, data: <instruction> }`. |

<a name="Twig+close"></a>

### twig.close
Closes the element

**Kind**: instance property of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| pos | <code>object</code> | The current possion (line and column) in the XML document |

<a name="Twig+attr"></a>

### twig.attr ⇒ <code>string</code> \| <code>number</code>
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> \| <code>number</code> - - The value of the attrubute or `null` if the attribute does not exist  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the attribute |

<a name="Twig+attribute"></a>

### twig.attribute ⇒ <code>object</code>
Retrieve or update XML attribute.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>object</code> - Attributes or null if no matching attribute found  

| Param | Type | Description |
| --- | --- | --- |
| cond | [<code>TwigCondition</code>](#TwigCondition) | Optional condition to select attributes |
| text | <code>string</code> \| <code>number</code> | New value of the attribute |

<a name="Twig+parent"></a>

### twig.parent ⇒ [<code>Twig</code>](#Twig)
Returns the parent element or null if root element

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - The parament element  
<a name="UnsupportedParser"></a>

## UnsupportedParser
Error for unsupported data types

**Kind**: global class  
<a name="new_UnsupportedParser_new"></a>

### new UnsupportedParser(t)
**Throws**:

- UnsupportedParser


| Param | Type | Description |
| --- | --- | --- |
| t | <code>string</code> | Parser type |

<a name="UnsupportedType"></a>

## UnsupportedType
Generic error for unsupported data types

**Kind**: global class  
<a name="new_UnsupportedType_new"></a>

### new UnsupportedType(t)
**Throws**:

- UnsupportedType


| Param | Type | Description |
| --- | --- | --- |
| t | <code>\*</code> | Parameter which was used |

<a name="UnsupportedCondition"></a>

## UnsupportedCondition
Generic error for unsupported data types

**Kind**: global class  
<a name="new_UnsupportedCondition_new"></a>

### new UnsupportedCondition(cond, t)
**Throws**:

- UnsupportedCondition


| Param | Type | Description |
| --- | --- | --- |
| cond | <code>\*</code> | The condition value |
| t | <code>Array.&lt;string&gt;</code> | List of supported data types |

<a name="NotImplementedYet"></a>

## NotImplementedYet
Generic error for unsupported data types

**Kind**: global class  
<a name="new_NotImplementedYet_new"></a>

### new NotImplementedYet(cond, t)
**Throws**:

- NotImplementedYet


| Param | Type | Description |
| --- | --- | --- |
| cond | <code>\*</code> | The condition value |
| t | <code>Array.&lt;string&gt;</code> | List of supported data types |

<a name="createParser"></a>

## createParser(method, method) ⇒ <code>Parser</code>
Create a new Twig parser. Currently `expat` (default) and `sax` are supported.

**Kind**: global function  
**Returns**: <code>Parser</code> - - The Twig parser object  
**Throws**:

- [<code>UnsupportedParser</code>](#UnsupportedParser) - For an unsupported parser


| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The underlying parser you like to use, defaults to `expat` |
| method | [<code>parserOptions</code>](#parserOptions) | Object of optional options |

<a name="parserOptions"></a>

## parserOptions : <code>object</code>
Optional options for the Twig parser- `encoding`: Encoding of the XML File. Applies only to 'expat' parser. Defaults to 'UTF-8'.- `xmlns`: Boolean. If true, then namespaces are supported. Defaults to false.- `trim`: Boolean. If true, then turn any whitespace into a single space. Defaults to true.

**Kind**: global typedef  
**Example**  
```js
{ encoding: 'UTF-8', xmlns: true }
```
<a name="TwigCondition"></a>

## TwigCondition : <code>string</code> \| <code>RegExp</code> \| <code>object</code> \| <code>function</code>
Optional condition to get an attribute<br> - If `undefined`, then all attributes/elements are returned.<br> - If `string` then the attribute name must be equal to the string- If RegExp` then the attribute name must match the Regular Expression- For [String.prototype.includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes?retiredLocale=de) match use `{includes: '<name of attribute>'}`<br> - You can provide custom condistion by callback function, e.g. `(name, text) => { return name === 'foo' && text === 'bar'}`

**Kind**: global typedef  
