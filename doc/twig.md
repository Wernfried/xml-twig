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

<a name="Elt"></a>

## Elt
**Kind**: global class  

* [Elt](#Elt)
    * [new Elt()](#new_Elt_new)
    * [new Elt(name, text, attributes)](#new_Elt_new)
    * [.isEmpty](#Elt+isEmpty) ⇒ <code>boolean</code>
    * [.isRoot](#Elt+isRoot) ⇒ <code>boolean</code>
    * [.name](#Elt+name) ⇒ <code>string</code>
    * [.tag](#Elt+tag) ⇒ <code>string</code>
    * [.text](#Elt+text) ⇒ <code>string</code>
    * [.text](#Elt+text)
    * [.close](#Elt+close)
    * [.attribute](#Elt+attribute) ⇒ <code>string</code> \| <code>object</code>

<a name="new_Elt_new"></a>

### new Elt()
A module for adding two values.

<a name="new_Elt_new"></a>

### new Elt(name, text, attributes)
Creeate a new Elt object


| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| text | <code>string</code> \| <code>number</code> | 
| attributes | <code>object</code> | 

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
The text of the element

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
<a name="Elt+attribute"></a>

### elt.attribute ⇒ <code>string</code> \| <code>object</code>
Retrive or update XML attribute.

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>string</code> \| <code>object</code> - Attributes or null if no matching attribute found  

| Param | Type | Description |
| --- | --- | --- |
| cond | <code>string</code> \| <code>RegExp</code> \| <code>object</code> \| <code>function</code> | If undefined, then all attributes are returned. br>  If string or RegExp then attributes matching this string are returned.<br>   For [String.prototype.includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes?retiredLocale=de) match use `{includes: '<name of attribute>'}`<br>  You can provide any filter by callback function, e.g. `(name, text) => { return name === 'foo' && text === 'bar'}`<br> |
| text | <code>string</code> | New value of the attribute |

<a name="Elt"></a>

## Elt
**Kind**: global class  

* [Elt](#Elt)
    * [new Elt()](#new_Elt_new)
    * [new Elt(name, text, attributes)](#new_Elt_new)
    * [.isEmpty](#Elt+isEmpty) ⇒ <code>boolean</code>
    * [.isRoot](#Elt+isRoot) ⇒ <code>boolean</code>
    * [.name](#Elt+name) ⇒ <code>string</code>
    * [.tag](#Elt+tag) ⇒ <code>string</code>
    * [.text](#Elt+text) ⇒ <code>string</code>
    * [.text](#Elt+text)
    * [.close](#Elt+close)
    * [.attribute](#Elt+attribute) ⇒ <code>string</code> \| <code>object</code>

<a name="new_Elt_new"></a>

### new Elt()
A module for adding two values.

<a name="new_Elt_new"></a>

### new Elt(name, text, attributes)
Creeate a new Elt object


| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| text | <code>string</code> \| <code>number</code> | 
| attributes | <code>object</code> | 

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
The text of the element

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
<a name="Elt+attribute"></a>

### elt.attribute ⇒ <code>string</code> \| <code>object</code>
Retrive or update XML attribute.

**Kind**: instance property of [<code>Elt</code>](#Elt)  
**Returns**: <code>string</code> \| <code>object</code> - Attributes or null if no matching attribute found  

| Param | Type | Description |
| --- | --- | --- |
| cond | <code>string</code> \| <code>RegExp</code> \| <code>object</code> \| <code>function</code> | If undefined, then all attributes are returned. br>  If string or RegExp then attributes matching this string are returned.<br>   For [String.prototype.includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes?retiredLocale=de) match use `{includes: '<name of attribute>'}`<br>  You can provide any filter by callback function, e.g. `(name, text) => { return name === 'foo' && text === 'bar'}`<br> |
| text | <code>string</code> | New value of the attribute |

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

