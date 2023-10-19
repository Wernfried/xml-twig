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
<dd><p>Create a new Twig parser</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ParserOptions">ParserOptions</a></dt>
<dd><p>Optional settings for the Twig parser</p>
</dd>
<dt><a href="#TwigHandler">TwigHandler</a></dt>
<dd><p>Reference to handler functions for Twig objects.<br>
If <code>name</code> is not specified, then handler is called on every element.<br>
Otherwise the element name must be equal to the string or Regular Expression. You can specify custom function</p>
</dd>
<dt><a href="#HandlerFunction">HandlerFunction</a></dt>
<dd><p>Handler function for Twig objects, i.e. the way you like to use the XML element.</p>
</dd>
<dt><a href="#ElementCondition">ElementCondition</a> : <code>string</code> | <code>RegExp</code> | <code><a href="#ElementConditionFilter">ElementConditionFilter</a></code> | <code><a href="#Twig">Twig</a></code></dt>
<dd><p>Optional condition to get elements<br> </p>
<ul>
<li>If <code>undefined</code>, then all elements are returned.<br> </li>
<li>If <code>string</code> then the element name must be equal to the string</li>
<li>If <code>RegExp</code> then the element name must match the Regular Expression</li>
<li>If <a href="#ElementConditionFilter">ElementConditionFilter</a> then the element must filter function </li>
<li>Use <a href="#Twig">Twig</a> object to find a specific element (rarely used in <code>createParser(handler)</code>)</li>
</ul>
</dd>
<dt><a href="#ElementConditionFilter">ElementConditionFilter</a> : <code>function</code></dt>
<dd><p>Custom filter function to get desired elements</p>
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
<dt><a href="#+PI">#PI</a> : <code>object</code></dt>
<dd><p>XML Processing Instruction object, exist only on root</p>
</dd>
<dt><a href="#+declaration">#declaration</a> : <code>object</code></dt>
<dd><p>XML Declaration object, exist only on root</p>
</dd>
<dt><a href="#+namespace">#namespace</a> : <code>object</code></dt>
<dd><p>XML namespace of element. Exist onl when parsed with <code>xmlns: true</code></p>
</dd>
<dt><a href="#+comment">#comment</a> : <code>string</code> | <code>Array.&lt;string&gt;</code></dt>
<dd><p>Comment or array of comments inside the XML Elements</p>
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
    * [.level](#Twig+level) ⇒ <code>number</code>
    * [.isRoot](#Twig+isRoot) ⇒ <code>boolean</code>
    * [.hasChildren](#Twig+hasChildren) ⇒ <code>boolean</code>
    * [.line](#Twig+line) ⇒ <code>number</code>
    * [.column](#Twig+column) ⇒ <code>number</code>
    * [.index](#Twig+index) ⇒ <code>number</code>
    * [.name](#Twig+name) ⇒ <code>string</code>
    * [.tag](#Twig+tag) ⇒ <code>string</code>
    * [.text](#Twig+text) ⇒ <code>string</code>
    * [.text](#Twig+text)
    * [.close](#Twig+close)
    * [.addChild](#Twig+addChild) ℗
    * [.writer](#Twig+writer) ⇒ <code>XMLWriter</code>
    * [.attr](#Twig+attr) ⇒ <code>string</code> \| <code>number</code> \| <code>object</code>
    * [.hasAttribute](#Twig+hasAttribute) ⇒ <code>boolean</code>
    * [.attribute](#Twig+attribute) ⇒ <code>object</code>
    * [.root](#Twig+root) ⇒ [<code>Twig</code>](#Twig)
    * [.parent](#Twig+parent) ⇒ [<code>Twig</code>](#Twig)
    * [.self](#Twig+self) ⇒ [<code>Twig</code>](#Twig)
    * [.children](#Twig+children) ⇒ [<code>Array.&lt;Twig&gt;</code>](#Twig)
    * [.next](#Twig+next) ⇒ [<code>Twig</code>](#Twig)
    * [.first](#Twig+first) ⇒ [<code>Twig</code>](#Twig)
    * [.last](#Twig+last) ⇒ [<code>Twig</code>](#Twig)
    * [.purge()](#Twig+purge)
    * [.purgeUpTo(elt)](#Twig+purgeUpTo)
    * [.setRoot(name)](#Twig+setRoot) ℗
    * [.filterElements(elts, condition)](#Twig+filterElements) ⇒ [<code>Array.&lt;Twig&gt;</code>](#Twig)

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
| #level | <code>number</code> | Root element is level 0, children have 1 and so on |

<a name="Twig+isEmpty"></a>

### twig.isEmpty ⇒ <code>boolean</code>
Returns `true` if the element is empty, otherwise `false`.An empty element has no text nor any child elements, however empty elements can have attributes.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - true if empty element  
<a name="Twig+level"></a>

### twig.level ⇒ <code>number</code>
Returns the level of the element. Root element has 0, children have 1, grand-children 2 and so on

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>number</code> - The level of the element.  
<a name="Twig+isRoot"></a>

### twig.isRoot ⇒ <code>boolean</code>
Returns `true` if element is the root object

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - true if root element  
<a name="Twig+hasChildren"></a>

### twig.hasChildren ⇒ <code>boolean</code>
Returns `true` if element has child elements

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - true if has child elements exists  
<a name="Twig+line"></a>

### twig.line ⇒ <code>number</code>
Returns the line where current element is closed

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>number</code> - Current line  
<a name="Twig+column"></a>

### twig.column ⇒ <code>number</code>
Returns the column where current element is closed

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>number</code> - Current column  
<a name="Twig+index"></a>

### twig.index ⇒ <code>number</code>
The position in `#children` array. For root object 0

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>number</code> - Position of element in parent  
<a name="Twig+name"></a>

### twig.name ⇒ <code>string</code>
Returns the name of the element.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> - Element name  
<a name="Twig+tag"></a>

### twig.tag ⇒ <code>string</code>
Returns the name of the element. Synonym for `twig.name`

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

<a name="Twig+close"></a>

### twig.close
Closes the element

**Kind**: instance property of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| pos | <code>object</code> | The current possion (line and column) in the XML document |

<a name="Twig+addChild"></a>

### twig.addChild ℗
Internal recursive function used by `writer()`

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| xw | <code>XMLWriter</code> | The writer object |
| children | [<code>Array.&lt;Twig&gt;</code>](#Twig) | Array of child elements |

<a name="Twig+writer"></a>

### twig.writer ⇒ <code>XMLWriter</code>
Creates xml-writer from current element

**Kind**: instance property of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| indented | <code>boolean</code> \| <code>string</code> | `true` or intention character |

<a name="Twig+attr"></a>

### twig.attr ⇒ <code>string</code> \| <code>number</code> \| <code>object</code>
Returns attriute value or `null` if not found.<br>If more than one  matches the condition, then it returns object as [attribute()](#attribute)

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> \| <code>number</code> \| <code>object</code> - - The value of the attrubute or `null` if the  does not exist  

| Param | Type | Description |
| --- | --- | --- |
| condition | [<code>AttributeCondition</code>](#AttributeCondition) | Optional condition to select attribute |

<a name="Twig+hasAttribute"></a>

### twig.hasAttribute ⇒ <code>boolean</code>
Check if the attribute exist or not

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - - Returns `true` if the attribute exists, else `false`  

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
| condition | [<code>AttributeCondition</code>](#AttributeCondition) | Optional condition to select attributes |
| text | <code>string</code> \| <code>number</code> | New value of the attribute |

**Example**  
```js
attribute((name, val) => { return name === 'age' && val > 50})attribute((name) => { return ['firstName', 'lastName'].includes(name) })attribute('firstName')attribute(/name/i)
```
<a name="Twig+root"></a>

### twig.root ⇒ [<code>Twig</code>](#Twig)
Returns the root object

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - The root element of XML tree  
<a name="Twig+parent"></a>

### twig.parent ⇒ [<code>Twig</code>](#Twig)
Returns the parent element or null if root element

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - The parament element  
<a name="Twig+self"></a>

### twig.self ⇒ [<code>Twig</code>](#Twig)
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - - The current element  
<a name="Twig+children"></a>

### twig.children ⇒ [<code>Array.&lt;Twig&gt;</code>](#Twig)
All children, optionally matching `condition` of the current element or empty array

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Condition**: <code>?ElementCondition</code> condition - Optional condition  
<a name="Twig+next"></a>

### twig.next ⇒ [<code>Twig</code>](#Twig)
Returns the next matching element.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - - The next element  
**Condition**: <code>?ElementCondition</code> condition - Optional condition  
<a name="Twig+first"></a>

### twig.first ⇒ [<code>Twig</code>](#Twig)
Returns the first matching element. This is usally the first element which has no child elements

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - - The first element  
**Condition**: <code>?ElementCondition</code> condition - Optional condition  
<a name="Twig+last"></a>

### twig.last ⇒ [<code>Twig</code>](#Twig)
Returns the last matching element. This is usally the root element

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - - The last element  
**Condition**: <code>?ElementCondition</code> condition - Optional condition  
<a name="Twig+purge"></a>

### twig.purge()
Purges the current, typically used after element has been processed.<br>The root object cannot be purged.

**Kind**: instance method of [<code>Twig</code>](#Twig)  
<a name="Twig+purgeUpTo"></a>

### twig.purgeUpTo(elt)
Purges up to the elt element. This allows you to keep part of the tree in memory when you purge.

**Kind**: instance method of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| elt | [<code>Twig</code>](#Twig) | Up to this element the tree will be purged. If `undefined` then `purge()` is called.<br> The `elt` object itself is not purged. (use `.purge()` is you like to do so) |

<a name="Twig+setRoot"></a>

### twig.setRoot(name) ℗
Sets the name of root element. In some cases the root is created before the XML-Root element is available<br>Used internally!

**Kind**: instance method of [<code>Twig</code>](#Twig)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The element name |

<a name="Twig+filterElements"></a>

### twig.filterElements(elts, condition) ⇒ [<code>Array.&lt;Twig&gt;</code>](#Twig)
Common function to filter Twig elements from array

**Kind**: instance method of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Array.&lt;Twig&gt;</code>](#Twig) - List of matching elements or empty array  

| Param | Type | Description |
| --- | --- | --- |
| elts | [<code>Array.&lt;Twig&gt;</code>](#Twig) | Array of elements you like to filter |
| condition | [<code>ElementCondition</code>](#ElementCondition) | The filter condition |

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
    * [.level](#Twig+level) ⇒ <code>number</code>
    * [.isRoot](#Twig+isRoot) ⇒ <code>boolean</code>
    * [.hasChildren](#Twig+hasChildren) ⇒ <code>boolean</code>
    * [.line](#Twig+line) ⇒ <code>number</code>
    * [.column](#Twig+column) ⇒ <code>number</code>
    * [.index](#Twig+index) ⇒ <code>number</code>
    * [.name](#Twig+name) ⇒ <code>string</code>
    * [.tag](#Twig+tag) ⇒ <code>string</code>
    * [.text](#Twig+text) ⇒ <code>string</code>
    * [.text](#Twig+text)
    * [.close](#Twig+close)
    * [.addChild](#Twig+addChild) ℗
    * [.writer](#Twig+writer) ⇒ <code>XMLWriter</code>
    * [.attr](#Twig+attr) ⇒ <code>string</code> \| <code>number</code> \| <code>object</code>
    * [.hasAttribute](#Twig+hasAttribute) ⇒ <code>boolean</code>
    * [.attribute](#Twig+attribute) ⇒ <code>object</code>
    * [.root](#Twig+root) ⇒ [<code>Twig</code>](#Twig)
    * [.parent](#Twig+parent) ⇒ [<code>Twig</code>](#Twig)
    * [.self](#Twig+self) ⇒ [<code>Twig</code>](#Twig)
    * [.children](#Twig+children) ⇒ [<code>Array.&lt;Twig&gt;</code>](#Twig)
    * [.next](#Twig+next) ⇒ [<code>Twig</code>](#Twig)
    * [.first](#Twig+first) ⇒ [<code>Twig</code>](#Twig)
    * [.last](#Twig+last) ⇒ [<code>Twig</code>](#Twig)
    * [.purge()](#Twig+purge)
    * [.purgeUpTo(elt)](#Twig+purgeUpTo)
    * [.setRoot(name)](#Twig+setRoot) ℗
    * [.filterElements(elts, condition)](#Twig+filterElements) ⇒ [<code>Array.&lt;Twig&gt;</code>](#Twig)

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
| #level | <code>number</code> | Root element is level 0, children have 1 and so on |

<a name="Twig+isEmpty"></a>

### twig.isEmpty ⇒ <code>boolean</code>
Returns `true` if the element is empty, otherwise `false`.An empty element has no text nor any child elements, however empty elements can have attributes.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - true if empty element  
<a name="Twig+level"></a>

### twig.level ⇒ <code>number</code>
Returns the level of the element. Root element has 0, children have 1, grand-children 2 and so on

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>number</code> - The level of the element.  
<a name="Twig+isRoot"></a>

### twig.isRoot ⇒ <code>boolean</code>
Returns `true` if element is the root object

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - true if root element  
<a name="Twig+hasChildren"></a>

### twig.hasChildren ⇒ <code>boolean</code>
Returns `true` if element has child elements

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - true if has child elements exists  
<a name="Twig+line"></a>

### twig.line ⇒ <code>number</code>
Returns the line where current element is closed

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>number</code> - Current line  
<a name="Twig+column"></a>

### twig.column ⇒ <code>number</code>
Returns the column where current element is closed

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>number</code> - Current column  
<a name="Twig+index"></a>

### twig.index ⇒ <code>number</code>
The position in `#children` array. For root object 0

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>number</code> - Position of element in parent  
<a name="Twig+name"></a>

### twig.name ⇒ <code>string</code>
Returns the name of the element.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> - Element name  
<a name="Twig+tag"></a>

### twig.tag ⇒ <code>string</code>
Returns the name of the element. Synonym for `twig.name`

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

<a name="Twig+close"></a>

### twig.close
Closes the element

**Kind**: instance property of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| pos | <code>object</code> | The current possion (line and column) in the XML document |

<a name="Twig+addChild"></a>

### twig.addChild ℗
Internal recursive function used by `writer()`

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| xw | <code>XMLWriter</code> | The writer object |
| children | [<code>Array.&lt;Twig&gt;</code>](#Twig) | Array of child elements |

<a name="Twig+writer"></a>

### twig.writer ⇒ <code>XMLWriter</code>
Creates xml-writer from current element

**Kind**: instance property of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| indented | <code>boolean</code> \| <code>string</code> | `true` or intention character |

<a name="Twig+attr"></a>

### twig.attr ⇒ <code>string</code> \| <code>number</code> \| <code>object</code>
Returns attriute value or `null` if not found.<br>If more than one  matches the condition, then it returns object as [attribute()](#attribute)

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>string</code> \| <code>number</code> \| <code>object</code> - - The value of the attrubute or `null` if the  does not exist  

| Param | Type | Description |
| --- | --- | --- |
| condition | [<code>AttributeCondition</code>](#AttributeCondition) | Optional condition to select attribute |

<a name="Twig+hasAttribute"></a>

### twig.hasAttribute ⇒ <code>boolean</code>
Check if the attribute exist or not

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: <code>boolean</code> - - Returns `true` if the attribute exists, else `false`  

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
| condition | [<code>AttributeCondition</code>](#AttributeCondition) | Optional condition to select attributes |
| text | <code>string</code> \| <code>number</code> | New value of the attribute |

**Example**  
```js
attribute((name, val) => { return name === 'age' && val > 50})attribute((name) => { return ['firstName', 'lastName'].includes(name) })attribute('firstName')attribute(/name/i)
```
<a name="Twig+root"></a>

### twig.root ⇒ [<code>Twig</code>](#Twig)
Returns the root object

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - The root element of XML tree  
<a name="Twig+parent"></a>

### twig.parent ⇒ [<code>Twig</code>](#Twig)
Returns the parent element or null if root element

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - The parament element  
<a name="Twig+self"></a>

### twig.self ⇒ [<code>Twig</code>](#Twig)
**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - - The current element  
<a name="Twig+children"></a>

### twig.children ⇒ [<code>Array.&lt;Twig&gt;</code>](#Twig)
All children, optionally matching `condition` of the current element or empty array

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Condition**: <code>?ElementCondition</code> condition - Optional condition  
<a name="Twig+next"></a>

### twig.next ⇒ [<code>Twig</code>](#Twig)
Returns the next matching element.

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - - The next element  
**Condition**: <code>?ElementCondition</code> condition - Optional condition  
<a name="Twig+first"></a>

### twig.first ⇒ [<code>Twig</code>](#Twig)
Returns the first matching element. This is usally the first element which has no child elements

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - - The first element  
**Condition**: <code>?ElementCondition</code> condition - Optional condition  
<a name="Twig+last"></a>

### twig.last ⇒ [<code>Twig</code>](#Twig)
Returns the last matching element. This is usally the root element

**Kind**: instance property of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Twig</code>](#Twig) - - The last element  
**Condition**: <code>?ElementCondition</code> condition - Optional condition  
<a name="Twig+purge"></a>

### twig.purge()
Purges the current, typically used after element has been processed.<br>The root object cannot be purged.

**Kind**: instance method of [<code>Twig</code>](#Twig)  
<a name="Twig+purgeUpTo"></a>

### twig.purgeUpTo(elt)
Purges up to the elt element. This allows you to keep part of the tree in memory when you purge.

**Kind**: instance method of [<code>Twig</code>](#Twig)  

| Param | Type | Description |
| --- | --- | --- |
| elt | [<code>Twig</code>](#Twig) | Up to this element the tree will be purged. If `undefined` then `purge()` is called.<br> The `elt` object itself is not purged. (use `.purge()` is you like to do so) |

<a name="Twig+setRoot"></a>

### twig.setRoot(name) ℗
Sets the name of root element. In some cases the root is created before the XML-Root element is available<br>Used internally!

**Kind**: instance method of [<code>Twig</code>](#Twig)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The element name |

<a name="Twig+filterElements"></a>

### twig.filterElements(elts, condition) ⇒ [<code>Array.&lt;Twig&gt;</code>](#Twig)
Common function to filter Twig elements from array

**Kind**: instance method of [<code>Twig</code>](#Twig)  
**Returns**: [<code>Array.&lt;Twig&gt;</code>](#Twig) - List of matching elements or empty array  

| Param | Type | Description |
| --- | --- | --- |
| elts | [<code>Array.&lt;Twig&gt;</code>](#Twig) | Array of elements you like to filter |
| condition | [<code>ElementCondition</code>](#ElementCondition) | The filter condition |

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

### new UnsupportedCondition(condition, t)
**Throws**:

- UnsupportedCondition


| Param | Type | Description |
| --- | --- | --- |
| condition | <code>\*</code> | The condition value |
| t | <code>Array.&lt;string&gt;</code> | List of supported data types |

<a name="NotImplementedYet"></a>

## NotImplementedYet
Generic error for unsupported data types

**Kind**: global class  
<a name="createParser"></a>

## createParser(handler, options)
Create a new Twig parser

**Kind**: global function  
**Throws**:

- [<code>UnsupportedParser</code>](#UnsupportedParser) - For an unsupported parser. Currently `expat` (default) and `sax` are supported.


| Param | Type | Description |
| --- | --- | --- |
| handler | [<code>TwigHandler</code>](#TwigHandler) \| [<code>Array.&lt;TwigHandler&gt;</code>](#TwigHandler) | Function or array of function to handle elements |
| options | [<code>ParserOptions</code>](#ParserOptions) | Object of optional options |

<a name="ParserOptions"></a>

## ParserOptions
Optional settings for the Twig parser

**Kind**: global typedef  
**Default**: <code>{ method: &#x27;expat&#x27;, encoding: &#x27;UTF-8&#x27;, xmlns: false, trim: true, resumeAfterError: false, partial: false }</code>  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The underlaying parser. Either `'sax'` or `'expat'`. |
| encoding | <code>string</code> | Encoding of the XML File. Applies only to `expat` parser. |
| xmlns | <code>boolean</code> | If true, then namespaces are accessible by `namespace` property. |
| trim | <code>boolean</code> | If true, then turn any whitespace into a single space. Text and comments are trimmed. |
| resumeAfterError | <code>boolean</code> | If true then parser continues reading after an error. Otherwiese it throws exception. |
| partial | <code>boolean</code> | It true then unhandled elements are purged. |

**Example**  
```js
{ encoding: 'UTF-8', xmlns: true }
```
<a name="TwigHandler"></a>

## TwigHandler
Reference to handler functions for Twig objects.<br>If `name` is not specified, then handler is called on every element.<br>Otherwise the element name must be equal to the string or Regular Expression. You can specify custom function

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>RegExp</code> \| [<code>ElementCondition</code>](#ElementCondition) | Name of handled element or any element if not specified |
| HandlerFunction | <code>function</code> | Definition of handler function, either anonymous or explict function |

<a name="HandlerFunction"></a>

## HandlerFunction
Handler function for Twig objects, i.e. the way you like to use the XML element.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| elt | [<code>Twig</code>](#Twig) | The current Twig element on which the function was called. |

<a name="ElementCondition"></a>

## ElementCondition : <code>string</code> \| <code>RegExp</code> \| [<code>ElementConditionFilter</code>](#ElementConditionFilter) \| [<code>Twig</code>](#Twig)
Optional condition to get elements<br> - If `undefined`, then all elements are returned.<br> - If `string` then the element name must be equal to the string- If `RegExp` then the element name must match the Regular Expression- If [ElementConditionFilter](#ElementConditionFilter) then the element must filter function - Use [Twig](#Twig) object to find a specific element (rarely used in `createParser(handler)`)

**Kind**: global typedef  
<a name="ElementConditionFilter"></a>

## ElementConditionFilter : <code>function</code>
Custom filter function to get desired elements

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the element |
| elt | [<code>Twig</code>](#Twig) | The full Twig object |

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

<a name="+PI"></a>

## #PI : <code>object</code>
XML Processing Instruction object, exist only on root

**Kind**: global typedef  
<a name="+declaration"></a>

## #declaration : <code>object</code>
XML Declaration object, exist only on root

**Kind**: global typedef  
<a name="+namespace"></a>

## #namespace : <code>object</code>
XML namespace of element. Exist onl when parsed with `xmlns: true`

**Kind**: global typedef  
<a name="+comment"></a>

## #comment : <code>string</code> \| <code>Array.&lt;string&gt;</code>
Comment or array of comments inside the XML Elements

**Kind**: global typedef  
