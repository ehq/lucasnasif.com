lucasnasif.com
==============

This app uses the Cuba ruby framework: https://github.com/soveran/cuba

The dependencies are handled with the `dep` gem. So if you install that gem you can just run `dep install`. If not you can just install the cuba gem and haml, as that's all I'm using here.

To run the app I use shotgun and thin: `shotgun -s thin` but you can also just use `rackup`.

Game of Life
------------

The Game of Life code is under the ./js dir. It uses Three.js to render everything, and a web worker for calculating the future generations of cells.

Thanks
------

Special thanks to mrdoob, gero3 and bai from #three.js on Freenode, for helping me out with some important optimizations.

License
-------

Copyright (c) 2012 Lucas Nasif & Evelin García.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
