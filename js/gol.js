var GoL = {
  init: function(element, options) {
    // Widget options.
    this.size           = options.size;

    // Rendering elements.
    this.canvas         = document.createElement('canvas');
    this.buffer         = document.createElement('canvas');
    this.context        = this.canvas.getContext('2d');
    this.buffer_context = this.buffer.getContext('2d');
    this.element        = $(element);

    this.element.data("gol", this);
    this.element.append(this.canvas);
    $(this.canvas).attr("id", "gol_container");

    // Instance variables.
    this.innerWidth    = window.innerWidth;
    this.innerHeight   = window.innerHeight;
    this.alive         = [];
    this.candidates    = [];
    this.colors        = options.colors || ['#fff','#A6BABB','#667B80','#5979A8','#a6babb','#ded13f','#A68F8E']

    // Initialize the widget.
    this.adjustDimensions(this.size, this.size);
    this.initializeGrid(this.rows, this.columns);
    this.randomnizeGrid();
    this.enableControls();

    // Start the application loop.
    this.startLoop(options.speed);
  },

  initializeGrid: function(rows, columns) {
    var grid = new Array(rows);

    for (i=0;i<rows;i++)
      grid[i] = new Array(columns);

    this.grid = grid;
  },

  randomnizeGrid: function() {
    var self    = this;
    var floor   = Math.floor;
    var random  = Math.random;
    var limit   = this.size * 40;
    var x, y;

    self.alive  = [];
    self.candidates = [];

    for (i = 0; i < limit; i++) {
      x = floor(random()*self.rows);
      y = floor(random()*self.columns);

      self.grid[x][y] = 10;
      self.alive.push([x,y])
    }
  },

  // Calculates the size and offset of the squares.
  // the offset for each square has to be at least 1px
  // plus the margin on each side.
  adjustDimensions: function(rows, columns) {
    var floor           = Math.floor;
    this.squares_margin = 1;
    this.min_offset     = this.squares_margin + 1;
    this.square_offset  = Math.max(floor($(document).width() / columns), this.min_offset);
    this.square_size    = this.square_offset - this.squares_margin;

    // Adjust the size of the canvas and the buffer.
    this.canvas.width  = this.innerWidth;
    this.canvas.height = this.innerHeight;
    this.buffer.width  = this.innerWidth;
    this.buffer.height = this.innerHeight;

    // Add extra columns or rows if there's empty space.
    this.columns = floor($(document).height() / this.square_offset);
    this.rows    = floor($(document).width()  / this.square_offset);
  },

  // Enable the resizing, speed and population controls.
  enableControls: function() {
    var self = this;

    $('#reset').click(function() {
      self.adjustDimensions(self.size, self.size);
      self.initializeGrid(self.rows, self.columns);
      self.randomnizeGrid();
    });

    $('#speed a').click(function() {
      self.changeSpeed($(this).attr('data-speed'))
    });

    $('#size a').click(function() {
      var size = parseInt($(this).attr('data-size'));

      if ((size <= 250) || confirm("Seriously? This may bring your cpu to it's knees.\nIt's super cool though.")) {
        self.size = size;
        self.adjustDimensions(self.size, self.size);
        self.initializeGrid(self.rows, self.columns);
        self.randomnizeGrid();
      }
    });

    $('.max_size').click(function() {
      $('.insane_size').show()
    });
  },

  // Advance to the next iteration and
  // render the grid on the canvas.
  run: function() {
    this.canvas.width = this.innerWidth;
    this.buffer.width = this.innerWidth;

    this.nextGeneration()
    this.renderGrid()
  },

  startLoop: function(speed) {
    this.interval = setInterval(function(gol) { gol.run() }, speed, this);
  },

  // Change the current speed of the animation.
  changeSpeed: function(speed) {
    clearInterval(this.interval);
    this.startLoop(speed)
  },

  // Renders the grid on the canvas.
  renderCell: function(i,j) {
    var x = i * this.square_offset + this.squares_margin
    var y = j * this.square_offset + this.squares_margin

    this.buffer_context.fillStyle = this.colors[Math.min(this.grid[i][j]/10, 6)];
    this.buffer_context.fillRect(x, y, this.square_size, this.square_size);
  },

  renderGrid: function() {
    this.context.drawImage(this.buffer, 0, 0);
  },

  // Advance to the next generation of cells.
  nextGeneration: function() {
    var self         = this;
    var grid         = self.grid;
    var alive_length = self.alive.length;
    var i, x, y, count, neighbours;
    self.candidates  = self.alive;

    for (i=0;i<alive_length;i++)
      self.updateNeighbours(self.alive[i]);

    self.alive = [];
    var candidates_length = self.candidates.length;

    for (i=0;i<candidates_length;i++) {
      x     = self.candidates[i][0];
      y     = self.candidates[i][1];
      count = grid[x][y];

      if (count >= 10) { // If the cell is alive...
        neighbours = count % 10;

        if (neighbours < 2 || neighbours > 3)
          grid[x][y] = undefined; // Kill the cell.
        else {

          grid[x][y] = count - neighbours; // Add 10 for each generation the cell survived.

          if (grid[x][y] < 60) { grid[x][y] += 10; } // Add 10 for each generation the cell survived.

          self.renderCell(x,y);
          self.alive.push(self.candidates[i]);
        }
      } else // If the cell wasn't alive...
        if (count == 3) { // Mark it as alive.
          grid[x][y] = 10;
          self.renderCell(x,y);
          self.alive.push(self.candidates[i]);
        } else
          grid[x][y] = undefined; // Kill the cell.
    };

    self.candidates = [];
  },

  updateNeighbours: function(coord) {
    var self    = this;
    var row     = coord[0];
    var column  = coord[1];
    var j, x, y;
    var coords  = [
      [row - 1, column - 1 ],
      [row - 1, column     ],
      [row - 1, column + 1 ],
      [row   ,  column - 1 ],
      [row   ,  column + 1 ],
      [row + 1, column - 1 ],
      [row + 1, column     ],
      [row + 1, column + 1 ]
    ];

    for (j=0;j<8;j++) {
      if ( coords[j][0] >= 0 && coords[j][0] < self.rows && coords[j][1] >= 0 && coords[j][1] < self.columns ) {
        x = coords[j][0];
        y = coords[j][1];

        if (self.grid[x][y])
          self.grid[x][y]++;
        else
          self.grid[x][y] = 1;

        if (self.grid[x][y] == 1)
          self.candidates.push(coords[j])
      };
    };
  }
}
