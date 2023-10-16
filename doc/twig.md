## Classes

<dl>
<dt><a href="#Elt">Elt</a></dt>
<dd></dd>
<dt><a href="#Elt">Elt</a></dt>
<dd></dd>
<dt><a href="#UnsupportedType">UnsupportedType</a></dt>
<dd><p>Generic error for unsupported data types</p>
</dd>
<dt><a href="#UnsupportedCondition">UnsupportedCondition</a></dt>
<dd><p>Generic error for unsupported data types</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#EltCondition">EltCondition</a> : <code>string</code> | <code>RegExp</code> | <code>object</code> | <code>function</code></dt>
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

<a name="Elt"></a>

## Elt
**Kind**: global class  

* [Elt](#Elt)
    * [new Elt()](#new_Elt_new)
    * [new Elt(name, text, attributes)](#new_Elt_new)
    * [.attributes](#Elt+attributes) ℗
    * [.isEmpty](#Elt+isEmpty) ⇒ <code>boolean</code>
    * [.isRoot](#Elt+isRoot) ⇒ <code>boolean</code>
    * [.hasChildren](#Elt+hasChildren) ⇒ <code>boolean</code>
    * [.name](#Elt+name) ⇒ <code>string</code>
    * [.tag](#Elt+tag) ⇒ <code>string</code>
    * [.text](#Elt+text) ⇒ <code>string</code>
    * [.text](#Elt+text)
    * [.close](#Elt+close)
    * [.attr](#Elt+attr) ⇒ <code>string</code> \| <code>number</code>
    * [.attribute](#Elt+attribute) ⇒ <code>object</code>

<a name="new_Elt_new"></a>

### new Elt()
Generic class modeling a XML Node

<a name="new_Elt_new"></a>

### new Elt(name, text, attributes)
Creeate a new Elt object


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the XML element |
| text | <code>string</code> \| <code>number</code> | - |
| attributes | <code>object</code> |  |

<a name="Elt+attributes"></a>

### elt.attributes ℗
**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #attributes | <code>object</code> | XML attribute `{ name: <name of attribute>, value: <attribute value>}` |

<a name="Elt+isEmpty"></a>

### elt.isEmpty ⇒ <code>boolean</code>
Returns true if the element is empty, otherwise false.An empty element ha no text nor any child elements, however empty elements can have attributes.

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>boolean</code> - true if empty element  
<a name="Elt+isRoot"></a>

### elt.isRoot ⇒ <code>boolean</code>
Returns true if element is the root object

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>boolean</code> - true if root element  
<a name="Elt+hasChildren"></a>

### elt.hasChildren ⇒ <code>boolean</code>
Returns true if element is the root object

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>boolean</code> - true if root element  
<a name="Elt+name"></a>

### elt.name ⇒ <code>string</code>
Returns the name of the element. Same as tag()

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>string</code> - Element name  
<a name="Elt+tag"></a>

### elt.tag ⇒ <code>string</code>
Returns the name of the element. Same as name()

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>string</code> - Element name  
<a name="Elt+text"></a>

### elt.text ⇒ <code>string</code>
The text of the element. No matter if given as text or CDATA entity

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>string</code> - Element text  
<a name="Elt+text"></a>

### elt.text
Modifies the text of the element

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Throws**:

- [<code>UnsupportedType</code>](#UnsupportedType) - If value is not a string or numeric type


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | New value of the attribute |

<a name="Elt+close"></a>

### elt.close
Closes the element

**Kind**: instance property of [<code>Elt</code>](#Elt)  
<a name="Elt+attr"></a>

### elt.attr ⇒ <code>string</code> \| <code>number</code>
**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>string</code> \| <code>number</code> - - The value of the attrubute or `null` if the attribute does not exist  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the attribute |

<a name="Elt+attribute"></a>

### elt.attribute ⇒ <code>object</code>
Retrieve or update XML attribute.

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>object</code> - Attributes or null if no matching attribute found  

| Param | Type | Description |
| --- | --- | --- |
| cond | [<code>EltCondition</code>](#EltCondition) | Optional condition to select attributes |
| text | <code>string</code> \| <code>number</code> | New value of the attribute |

<a name="Elt"></a>

## Elt
**Kind**: global class  

* [Elt](#Elt)
    * [new Elt()](#new_Elt_new)
    * [new Elt(name, text, attributes)](#new_Elt_new)
    * [.attributes](#Elt+attributes) ℗
    * [.isEmpty](#Elt+isEmpty) ⇒ <code>boolean</code>
    * [.isRoot](#Elt+isRoot) ⇒ <code>boolean</code>
    * [.hasChildren](#Elt+hasChildren) ⇒ <code>boolean</code>
    * [.name](#Elt+name) ⇒ <code>string</code>
    * [.tag](#Elt+tag) ⇒ <code>string</code>
    * [.text](#Elt+text) ⇒ <code>string</code>
    * [.text](#Elt+text)
    * [.close](#Elt+close)
    * [.attr](#Elt+attr) ⇒ <code>string</code> \| <code>number</code>
    * [.attribute](#Elt+attribute) ⇒ <code>object</code>

<a name="new_Elt_new"></a>

### new Elt()
Generic class modeling a XML Node

<a name="new_Elt_new"></a>

### new Elt(name, text, attributes)
Creeate a new Elt object


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the XML element |
| text | <code>string</code> \| <code>number</code> | - |
| attributes | <code>object</code> |  |

<a name="Elt+attributes"></a>

### elt.attributes ℗
**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Access**: private  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #attributes | <code>object</code> | XML attribute `{ name: <name of attribute>, value: <attribute value>}` |

<a name="Elt+isEmpty"></a>

### elt.isEmpty ⇒ <code>boolean</code>
Returns true if the element is empty, otherwise false.An empty element ha no text nor any child elements, however empty elements can have attributes.

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>boolean</code> - true if empty element  
<a name="Elt+isRoot"></a>

### elt.isRoot ⇒ <code>boolean</code>
Returns true if element is the root object

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>boolean</code> - true if root element  
<a name="Elt+hasChildren"></a>

### elt.hasChildren ⇒ <code>boolean</code>
Returns true if element is the root object

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>boolean</code> - true if root element  
<a name="Elt+name"></a>

### elt.name ⇒ <code>string</code>
Returns the name of the element. Same as tag()

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>string</code> - Element name  
<a name="Elt+tag"></a>

### elt.tag ⇒ <code>string</code>
Returns the name of the element. Same as name()

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>string</code> - Element name  
<a name="Elt+text"></a>

### elt.text ⇒ <code>string</code>
The text of the element. No matter if given as text or CDATA entity

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>string</code> - Element text  
<a name="Elt+text"></a>

### elt.text
Modifies the text of the element

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Throws**:

- [<code>UnsupportedType</code>](#UnsupportedType) - If value is not a string or numeric type


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | New value of the attribute |

<a name="Elt+close"></a>

### elt.close
Closes the element

**Kind**: instance property of [<code>Elt</code>](#Elt)  
<a name="Elt+attr"></a>

### elt.attr ⇒ <code>string</code> \| <code>number</code>
**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>string</code> \| <code>number</code> - - The value of the attrubute or `null` if the attribute does not exist  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the attribute |

<a name="Elt+attribute"></a>

### elt.attribute ⇒ <code>object</code>
Retrieve or update XML attribute.

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>object</code> - Attributes or null if no matching attribute found  

| Param | Type | Description |
| --- | --- | --- |
| cond | [<code>EltCondition</code>](#EltCondition) | Optional condition to select attributes |
| text | <code>string</code> \| <code>number</code> | New value of the attribute |

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

<a name="EltCondition"></a>

## EltCondition : <code>string</code> \| <code>RegExp</code> \| <code>object</code> \| <code>function</code>
Optional condition to get an attribute<br> - If `undefined`, then all attributes/elements are returned.<br> - If `string` then the attribute name must be equal to the string- If RegExp` then the attribute name must match the Regular Expression- For [String.prototype.includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes?retiredLocale=de) match use `{includes: '<name of attribute>'}`<br> - You can provide custom condistion by callback function, e.g. `(name, text) => { return name === 'foo' && text === 'bar'}`

**Kind**: global typedef  
