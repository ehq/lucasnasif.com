var GoL3D = {
  init: function(element, options) {
    this.buildScene();

    this.size  = 200;
    this.grid  = this.initializeGrid(this.size, this.size);
    this.cubes = this.initializeGrid(this.size, this.size);

    this.randomnizeGrid();

    this.animate();
  },

  buildScene: function() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);

    $(this.container).css({
      "position": "absolute",
      "z-index": 10,
      "top": 0,
      "left": 0,
      "background": "black"
    })

    this.theta = 45;
    this.cameraTarget = new THREE.Vector3(0,0,0);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    var w = window.innerWidth;
    var h = window.innerHeight;
    this.camera = new THREE.CombinedCamera(w, h, 40, 1, 10000, -2000, 10000);

    this.camera.position.y = 600;
    this.camera.position.x = 1400 * Math.sin(this.theta * Math.PI / 360);
    this.camera.position.z = 1400 * Math.cos(this.theta * Math.PI / 360);
    this.camera.lookAt(this.cameraTarget);

    this.scene.add(this.camera);

    // Cubes settings
    this.cubeGeo = new THREE.CubeGeometry(20,20,20);

    this.cubeMaterial = new THREE.MeshBasicMaterial({
      shading: THREE.SmoothShading,
      map:     THREE.ImageUtils.loadTexture("/images/square-outline.png")
    });

    this.cubeMaterial.color.setHSV(0.6, 0.4, 1.0);
    this.cubeMaterial.ambient = this.cubeMaterial.color;

    // Plane
    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000, 200, 200),
                                new THREE.MeshBasicMaterial({ color: 0x222222, wireframe: true }));

    // Projector
    this.projector = new THREE.Projector();

    // FIXME: Adding this rotations means we need to rotate the cubes as well.
    // this.plane.rotation.x = - 80 * Math.PI / 180;
    this.scene.add(this.plane);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.container.appendChild(this.renderer.domElement);
  },

  drawCell: function(x,y) {
    var cube = this.cubes[x][y];

    if (!cube) {
      cube = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);

      cube.position = new THREE.Vector3((x - this.size/2) * 20 + 10, (y - this.size/2) * 20 + 10, 10)

      this.cubes[x][y] = cube;
    }

    this.scene.add(cube);
  },

  killCell: function(x,y) {
    if (this.cubes[x][y]) this.scene.remove(this.cubes[x][y]);
    this.grid[x][y] = undefined;
  },

  animate: function() {
    setTimeout(GoL3D.animate, 150);
    GoL3D.run();
  },

  render: function() {
    this.renderer.render(this.scene, this.camera);
  },

  initializeGrid: function(rows, columns) {
    var grid = new Array(rows);

    for (i = 0; i < rows; i++)
      grid[i] = new Array(columns);

    return grid;
  },

  randomnizeGrid: function() {
    var self    = this;
    var floor   = Math.floor;
    var random  = Math.random;
    var limit   = this.size * 30;
    var x, y;

    this.alive = [];
    this.candidates = [];

    for (i = 0; i < limit; i++) {
      x = floor(random()*self.size);
      y = floor(random()*self.size);

      self.grid[x][y] = 10;
      self.alive.push([x,y])
    }
  },

  run: function() {
    this.nextGeneration()
    this.render()
  },

  nextGeneration: function() {
    var x, y, neighbours;

    this.candidates = this.alive;

    $.each(this.alive, function(_,coords) {
      GoL3D.updateNeighbours(coords);
    });

    this.alive = [];

    $.each(this.candidates, function(_,candidate) {
      x = candidate[0]; y = candidate[1];
      neighbours = GoL3D.grid[x][y] % 10;

      if (GoL3D.grid[x][y] >= 10)
        if (neighbours < 2 || neighbours > 3)
          GoL3D.killCell(x, y)
        else {
          GoL3D.grid[x][y] -= neighbours
          GoL3D.alive.push(candidate)
        }
      else
        if (GoL3D.grid[x][y] == 3) {
          GoL3D.grid[x][y] = 10;
          GoL3D.drawCell(x,y);
          GoL3D.alive.push(candidate)
        } else
          GoL3D.grid[x][y] = undefined
    });
  },

  updateNeighbours: function(coord) {
    var self = this;
    var row = coord[0], column = coord[1];
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

    for (j = 0; j < 8; j++)
      if (coords[j][0] >= 0 && coords[j][0] < self.size && coords[j][1] >= 0 && coords[j][1] < self.size) {
        x = coords[j][0]; y = coords[j][1];

        if (self.grid[x][y])
          self.grid[x][y]++;
        else {
          self.grid[x][y] = 1;
          self.candidates.push(coords[j])
        };
      };
  }
}
