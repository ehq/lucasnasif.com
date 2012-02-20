var GoL3D = {
  init: function(element, options) {
    this.buildScene();

    this.grid  = this.initializeGrid(200,200);
    this.cubes = this.initializeGrid(200,200);

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
      "left": 0
    })

    this.theta = 45;
    this.cameraTarget = new THREE.Vector3(0,0,0);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.CombinedCamera(window.innerWidth,
                                           window.innerHeight,
                                           40,
                                           1,
                                           10000,
                                           -2000,
                                           10000);

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
                                new THREE.MeshBasicMaterial({ color: 0xDDDDDD, wireframe: true }));

    // Projector
    this.projector = new THREE.Projector();

    // FIXME: Adding this rotations means we need to rotate the cubes as well.
    // this.plane.rotation.x = - 80 * Math.PI / 180;
    this.scene.add(this.plane);

    // Lights
    var ambientLight = new THREE.AmbientLight(0x606060);
    this.scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);

    directionalLight.position.set(1, 0.75, 0.5).normalize();

    this.scene.add(directionalLight);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: false });

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.container.appendChild(this.renderer.domElement);
  },

  drawCell: function(x,y) {
    var cube = this.cubes[x][y];

    if (!cube) {
      cube = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);

      cube.position = new THREE.Vector3((x - 150) * 20 + 10, (y - 150) * 20 + 10, 10)

      this.cubes[x][y] = cube;
    }

    this.scene.add(cube);
  },

  killCell: function(x,y) {
    if (this.cubes[x][y]) this.scene.remove(this.cubes[x][y]);
    this.grid[x][y] = undefined;
  },

  animate: function() {
    setTimeout(GoL3D.animate, 100);
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
    var limit   = 200 * 50;
    var x, y;

    this.alive = [];
    this.candidates = [];

    for (i = 0; i < limit; i++) {
      x = floor(random()*200);
      y = floor(random()*200);

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
      if (coords[j][0] >= 0 && coords[j][0] < 200 && coords[j][1] >= 0 && coords[j][1] < 200) {
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
