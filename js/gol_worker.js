// This Web Worker is in charge of calculating future generatinos,
// The idea is that these are calculated in the background and then cached,
// so the main GoL widget concentrates only on rendering the cells,
// which is the most demanding task for the cpu.
var GoL = {
  init: function(size) {
    GoL.size = size;

    GoL.alive      = [];
    GoL.candidates = [];
    GoL.dead       = [];
    GoL.born       = [];

    GoL.initializeGrid(GoL.size, GoL.size);
    GoL.randomnizeGrid();

    GoL.run();
  },

  initializeGrid: function(rows, columns) {
    var grid = new Array(rows);

    for (i = 0; i < rows; i++)
      grid[i] = new Array(columns);

    GoL.grid = grid;
  },

  randomnizeGrid: function() {
    var floor  = Math.floor;
    var random = Math.random;
    var limit  = GoL.size * 25;
    var x, y;

    for (i = 0; i < limit; i++) {
      x = floor(random()*GoL.size);
      y = floor(random()*GoL.size);

      if (GoL.grid[x][y] != 10) {
        GoL.grid[x][y] = 10;
        GoL.alive.push([x,y]);
      }
    }

    // Draw the initial position too.
    postMessage([{ born: GoL.alive, dead: [] }]);
  },

  // Calculate 20 generations at a time,
  // and pass them to the foreground,
  // that way the syncrhonization time between this worker,
  // and the main js is reduced to a 1/10th of the time.
  run: function() {
    setTimeout(GoL.run, 2000);

    var generations = [], i;

    for (i = 0; i < 30; i++) {
      GoL.nextGeneration();
      generations.push({ born: GoL.born, dead: GoL.dead });
    }

    postMessage(generations);
  },

  nextGeneration: function() {
    var i, x, y, neighbours, candidate;

    GoL.candidates = GoL.alive;

    for (i = 0, l = GoL.alive.length; i < l; i++)
      GoL.updateNeighbours(GoL.alive[i]);

    GoL.alive = [];
    GoL.born  = [];
    GoL.dead  = [];

    for (i = 0, l = GoL.candidates.length; i < l; i++) {
      candidate = GoL.candidates[i]; x = candidate[0]; y = candidate[1];
      neighbours = GoL.grid[x][y] % 10;

      if (GoL.grid[x][y] >= 10)
        if (neighbours < 2 || neighbours > 3) {
          GoL.dead.push(candidate);
          GoL.grid[x][y] = undefined;
        } else {
          GoL.grid[x][y] = 10
          GoL.alive.push(candidate)
        }
      else
        if (GoL.grid[x][y] == 3) {
          GoL.grid[x][y] = 10;
          GoL.born.push(candidate);
          GoL.alive.push(candidate)
        } else
          GoL.grid[x][y] = undefined
    };
  },

  updateNeighbours: function(coord) {
    var row = coord[0], column = coord[1];
    var j, x, y;
    var coords  = [
      [row - 1, column - 1],
      [row - 1, column    ],
      [row - 1, column + 1],
      [row   ,  column - 1],
      [row   ,  column + 1],
      [row + 1, column - 1],
      [row + 1, column    ],
      [row + 1, column + 1]
    ];

    for (j = 0; j < 8; j++)
      if (coords[j][0] >= 0 && coords[j][0] < GoL.size && coords[j][1] >= 0 && coords[j][1] < GoL.size) {
        x = coords[j][0]; y = coords[j][1];

        if (GoL.grid[x][y])
          GoL.grid[x][y]++;
        else {
          GoL.grid[x][y] = 1;
          GoL.candidates.push(coords[j])
        };
      };
  }
};

onmessage = function(e) { GoL.init(e.data.size); };
