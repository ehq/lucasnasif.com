lucasnasif.com
==============

This app uses the Cuba ruby framework: https://github.com/soveran/cuba

The dependencies are handled with the `dep` gem. So if you install that gem you can just run `dep install`. If not you can just install the cuba gem and haml, as that's all I'm using here.

To run the app I use shotgun and thin: `shotgun -s thin` but you can also just use `rackup`.

Game of Life
------------

The Game of Life code is under the ./js dir. It uses Three.js to render everything, and a web worker for calculating the future generations of cells. The size of the grid is 200x200, but right now the squares grid is limited to 50x50 until I can improve the performance.
