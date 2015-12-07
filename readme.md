# to-source ![Build](https://travis-ci.org/AGhost-7/js-to-source.svg?branch=master)
Turns code back into source! Doesn't support functions (but you can override
that) or comments though.

This is currently used for code generation, hence why you have more control
over how the output is going to look like.

## Parameters

- `any` _data_ This is the javascript value to convert back into source text.
- `object` _options_ The options object is also optional, See below for the
options to modify the output along with the defaults.

## Options
- `number` _tabDepth_ Is the indentation level that the value is starting at.
- `number` _quoteDepth_ Specifies how far deep into the object you want the key
to be single quoted.
- `boolean` _enclose_ If false, the object output won't have the openeing and
closing brackets. 
This is useful is you want to insert the output into an existing object.
- `string` _tabChar_ specifies what to use for the height character. By default
this will use a single tab character. You can specify two, three, four spaces
instead if you want (or whatever you want).
- `function` _functionFormatter_ If you want to parse functions, you will need
to specify this argument. The function will feed the tab height and the
function object to the formatter, from there you will need to source it and
change the format to preference. If this argument is not specified the default
will be an empty function.
- `string` _quoteChar_ This will specify what kind of character to use to
escape keys in objects and what to use for strings. By default, this is a
single quote.

## Overriding the default function serializer
You can override the default formatter globally. A utility function is provided
which can make a decent serializer that should indent things properly for most
use cases.

```javascript
var toSource = require('to-source');

// By default mkFnFormatter will use tabs, but you can specify what kind of
// character you want to use for a single indentation level.
toSource.defaultFnFormatter = toSource.mkFnFormatter();

var example = function() {
	return 'foobar';
};

toSource(example); // -> outputs the whole function!
```

Preferably, you should use a proper code formatter like `beautify-js` to format
the function block. This is why you can specify your own formatter.
