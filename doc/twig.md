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
<dt><a href="#createParser">createParser(handler, options)</a></dt>
<dd><p>Create a new Twig parser. Currently <code>expat</code> (default) and <code>sax</code> are supported.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ParserOptions">ParserOptions</a></dt>
<dd><p>Optional options for the Twig parser</p>
<ul>
<li><code>method</code>: The underlaying parser. Either &#39;sax&#39; or &#39;expat&#39;.</li>
<li><code>encoding</code>: Encoding of the XML File. Applies only to &#39;expat&#39; parser.</li>
<li><code>xmlns</code>: If true, then namespaces are supported.</li>
<li><code>trim</code>: If true, then turn any whitespace into a single space.</li>
<li><code>resumeAfterError</code>: If true then parser continues reading after an error. Otherwiese it throws exception.</li>
<li><code>partial</code>: It true then unhandled elements are purged.</li>
</ul>
</dd>
<dt><a href="#TwigHandler">TwigHandler</a></dt>
<dd><p>Handler functions for Twig objects</p>
</dd>
<dt><a href="#AttributeCondition">AttributeCondition</a> : <code>string</code> | <code>RegExp</code> | <code><a href="#AttributeConditionFilter">AttributeConditionFilter</a></code></dt>
<dd><p>Optional condition to get attributes<br> </p>
<ul>
<li>If <code>undefined</code>, then all attributes are returned.<br> </li>
<li>If <code>string</code> then the attribute name must be equal to the string</li>
<li>If <code>RegExp</code> then the attribute name must match the Regular Expression</li>
<li>If <a href="#AttributeConditionFilter">AttributeConditionFilter</a> then the attribute must filter function</li>
</ul>
</dd>
<dt><a href="#AttributeConditionFilter">AttributeConditionFilter</a> : <code>function</code></dt>
<dd><p>Custom filter function to get desired attributes</p>
</dd>
<dt><a href="#ElementCondition">ElementCondition</a> : <code>string</code> | <code>RegExp</code> | <code><a href="#ElementConditionFilter">ElementConditionFilter</a></code> | <code><a href="#Twig">Twig</a></code></dt>
<dd><p>Optional condition to get elements<br> </p>
<ul>
<li>If <code>undefined</code>, then all elements are returned.<br> </li>
<li>If <code>string</code> then the element name must be equal to the string</li>
<li>If <code>RegExp</code> then the element name must match the Regular Expression</li>
<li>If <a href="#ElementConditionFilter">ElementConditionFilter</a> then the element must filter function </li>
<li>Use <a href="#Twig">Twig</a> object to find a specific element</li>
</ul>
</dd>
<dt><a href="#ElementConditionFilter">ElementConditionFilter</a> : <code>function</code></dt>
<dd><p>Custom filter function to get desired elements</p>
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
    * [.level](#Twig+level) ℗
    * [.isEmpty](#Twig+isEmpty) ⇒ <code>boolean</code>
    * [.isRoot](#Twig+isRoot) ⇒ <code>boolean</code>
    * [.root](#Twig+root) ⇒ [<code>Twig</code>](#Twig)
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
    * [.hasAttribute](#Twig+hasAttribute) ⇒ <code>boolean</code>
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
| #postion | <code>object</code> | The postion of the element in #children array |

<a name="Twig+level"></a>

### twig.level ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #level | <code>number</code> | The level in XML DOM.<br> Root element is level 0, children have 1 and so on |

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
<a name="Twig+root"></a>

### twig.root ⇒ [<code>Twig</code>](#Twig)
Returns the root object

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - The root element of XML tree  
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

<a name="Twig+hasAttribute"></a>

### twig.hasAttribute ⇒ <code>boolean</code>
Check if the attribute exist or not

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - - Returns true if the attribute exists, else false  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the attribute |

<a name="Twig+attribute"></a>

### twig.attribute ⇒ <code>object</code>
Retrieve or update XML attribute.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>object</code> - Attributes or `null` if no matching attribute found  

| Param | Type | Description |
| --- | --- | --- |
| cond | [<code>AttributeCondition</code>](#AttributeCondition) | Optional condition to select attributes |
| text | <code>string</code> \| <code>number</code> | New value of the attribute |

**Example**  
```js
attribute((name, val) => { return name === 'age' && val > 50})attribute((name) => { return ['firstName', 'lastName'].includes(name) })attribute('firstName')attribute(/name/i)
```
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
    * [.level](#Twig+level) ℗
    * [.isEmpty](#Twig+isEmpty) ⇒ <code>boolean</code>
    * [.isRoot](#Twig+isRoot) ⇒ <code>boolean</code>
    * [.root](#Twig+root) ⇒ [<code>Twig</code>](#Twig)
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
    * [.hasAttribute](#Twig+hasAttribute) ⇒ <code>boolean</code>
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
| #postion | <code>object</code> | The postion of the element in #children array |

<a name="Twig+level"></a>

### twig.level ℗
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #level | <code>number</code> | The level in XML DOM.<br> Root element is level 0, children have 1 and so on |

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
<a name="Twig+root"></a>

### twig.root ⇒ [<code>Twig</code>](#Twig)
Returns the root object

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - The root element of XML tree  
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

<a name="Twig+hasAttribute"></a>

### twig.hasAttribute ⇒ <code>boolean</code>
Check if the attribute exist or not

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - - Returns true if the attribute exists, else false  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the attribute |

<a name="Twig+attribute"></a>

### twig.attribute ⇒ <code>object</code>
Retrieve or update XML attribute.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>object</code> - Attributes or `null` if no matching attribute found  

| Param | Type | Description |
| --- | --- | --- |
| cond | [<code>AttributeCondition</code>](#AttributeCondition) | Optional condition to select attributes |
| text | <code>string</code> \| <code>number</code> | New value of the attribute |

**Example**  
```js
attribute((name, val) => { return name === 'age' && val > 50})attribute((name) => { return ['firstName', 'lastName'].includes(name) })attribute('firstName')attribute(/name/i)
```
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

## createParser(handler, options)
Create a new Twig parser. Currently `expat` (default) and `sax` are supported.

**Kind**: global function  
**Throws**:

- [<code>UnsupportedParser</code>](#UnsupportedParser) - For an unsupported parser


| Param | Type | Description |
| --- | --- | --- |
| handler | [<code>TwigHandler</code>](#TwigHandler) \| [<code>Array.&lt;TwigHandler&gt;</code>](#TwigHandler) | Function or array of function to handle elements |
| options | [<code>ParserOptions</code>](#ParserOptions) | Object of optional options |

**Example**  
```js
function rootHandler(tree, elt) { console.log(elt.name);}
```
**Example**  
```js
function handler(tree, elt) { console.log(elt.name);}
```
<a name="ParserOptions"></a>

## ParserOptions
Optional options for the Twig parser- `method`: The underlaying parser. Either 'sax' or 'expat'.- `encoding`: Encoding of the XML File. Applies only to 'expat' parser.- `xmlns`: If true, then namespaces are supported.- `trim`: If true, then turn any whitespace into a single space.- `resumeAfterError`: If true then parser continues reading after an error. Otherwiese it throws exception.- `partial`: It true then unhandled elements are purged.

**Kind**: global typedef  
**Default**: <code>{ method: &#x27;expat&#x27;, encoding: &#x27;UTF-8&#x27;, xmlns: false, trim: true, resumeAfterError: false, partial: false }</code>  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The underlaying parser. Either 'sax' or 'expat'. |

**Example**  
```js
{ encoding: 'UTF-8', xmlns: true }
```
<a name="TwigHandler"></a>

## TwigHandler
Handler functions for Twig objects

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>RegExp</code> \| <code>HandlerConditionFilter</code> | - |
| function | <code>function</code> | - |

<a name="AttributeCondition"></a>

## AttributeCondition : <code>string</code> \| <code>RegExp</code> \| [<code>AttributeConditionFilter</code>](#AttributeConditionFilter)
Optional condition to get attributes<br> - If `undefined`, then all attributes are returned.<br> - If `string` then the attribute name must be equal to the string- If `RegExp` then the attribute name must match the Regular Expression- If [AttributeConditionFilter](#AttributeConditionFilter) then the attribute must filter function

**Kind**: global typedef  
<a name="AttributeConditionFilter"></a>

## AttributeConditionFilter : <code>function</code>
Custom filter function to get desired attributes

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the attribute |
| value | <code>string</code> \| <code>number</code> | Value of the attribute |

<a name="ElementCondition"></a>

## ElementCondition : <code>string</code> \| <code>RegExp</code> \| [<code>ElementConditionFilter</code>](#ElementConditionFilter) \| [<code>Twig</code>](#Twig)
Optional condition to get elements<br> - If `undefined`, then all elements are returned.<br> - If `string` then the element name must be equal to the string- If `RegExp` then the element name must match the Regular Expression- If [ElementConditionFilter](#ElementConditionFilter) then the element must filter function - Use [Twig](#Twig) object to find a specific element

**Kind**: global typedef  
<a name="ElementConditionFilter"></a>

## ElementConditionFilter : <code>function</code>
Custom filter function to get desired elements

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the element |
| elt | [<code>Twig</code>](#Twig) | The full element Twig object |

