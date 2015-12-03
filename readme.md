# to-source ![Build](https://travis-ci.org/AGhost-7/js-to-source.svg?branch=master)
Turns code back into source! Doesn't support functions or comments though.
Parameters:

- `string` _data_ This is the javascript value to convert back into source text.
- `number` _tabDepth_ Is the indentation level that the value is starting at.
- `number` _quoteDepth_ Specifies how far deep into the object you want the key to be single quoted.
- `boolean` _brackets_ If false, the object output won't have the openeing and closing brackets. 
This is useful is you want to insert the output into an existing object.
- `string` _tabChar_ specifies what to use for the height character. By default this will
use a single tab character. You can specify two, three, four spaces instead if you want (or 
whatever you want).
- `function` _functionFormatter_ If you want to parse functions, you will need to specify
this argument. The function will feed the tab height and the function object to the
formatter, from there you will need to source it and change the format to preference. If this
argument is not specified the default will be an empty function.

