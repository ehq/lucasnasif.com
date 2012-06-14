var GoL3D = {
  init: function() {
    this.size = 200;
    this.nextGenerations = [];

    // Initialize the worker first, so it starts calulating
    // the future generations of cells.
    this.initializeWorker();

    this.transitions = [];

    this.initializeCubes(this.size, this.size);
    this.buildScene();

    this.cubesLoop();
    this.animate();
  },

  buildScene: function() {
    // DOM Elements.
    this.container = document.createElement('div');
    document.body.appendChild(this.container);

    $(this.container).css({
      "position": "absolute",
      "z-index": 10,
      "top": 0,
      "left": 0,
      "background": "black"
    })

    // Scene.
    this.scene = new THREE.Scene();

    // Camera.
    var w = window.innerWidth;
    var h = window.innerHeight;
    this.camera = new THREE.CombinedCamera(w, h, 40, 1, 10000, -2000, 10000);
    this.theta = Math.cos(45 * Math.PI / 360);
    this.alpha = Math.sin(45 * Math.PI / 360);
    this.still_camera = { x: false, y: false, z: false };
    this.camera_x = 1400
    this.camera_y = 600
    this.camera_z = 1400
    this.cameraTarget = new THREE.Vector3(0,0,0);
    this.camera.position.y = this.camera_y;
    this.camera.position.z = this.camera_z * this.theta;
    this.camera.position.x = this.camera_x * this.alpha;
    this.camera.lookAt(this.cameraTarget);

    this.scene.add(this.camera);

    // Plane.
    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000, 200, 200),
                                new THREE.MeshBasicMaterial({ color: 0x222222, wireframe: true }));
    this.scene.add(this.plane);

    // Renderer.
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.container.appendChild(this.renderer.domElement);
  },

  drawCell: function(coords) {
    this.scene.add(this.cubes(coords[0], coords[1]));
  },

  killCell: function(coords) {
    this.scene.remove(this.cubes(coords[0], coords[1]));
  },

  animate: function() {
    requestAnimationFrame(GoL3D.animate)
    GoL3D.moveCamera();
    GoL3D.render();
  },

  transition: function(x,y,z) {
    this.transitions.push({ x: x, y: y, z: z });
  },

  moveCamera: function() {
    var diff, tr = this.transitions[0];

    if (!tr) return;

    $.each(["x","y","z"], function(_,axis) {
      diff = GoL3D["camera_"+axis] - tr[axis]
      Math.abs(diff) > 30 ?
        GoL3D["camera_"+axis] += 30 * (diff > 0 ? -1 : 1) :
        GoL3D.still_camera[axis] = true;
    });

    if (this.still_camera.x && this.still_camera.y && this.still_camera.z) {
      this.transitions.shift();
      this.still_camera = { x: false, y: false, z: false };
    }

    this.camera.position.y = this.camera_y;
    this.camera.position.z = this.camera_z * this.theta;
    this.camera.position.x = this.camera_x * this.alpha;

    this.camera.lookAt(this.cameraTarget);
  },

  initializeWorker: function() {
    var worker = new Worker("/js/gol_worker.js");

    worker.onmessage = function(e) {
      GoL3D.nextGenerations = GoL3D.nextGenerations.concat(e.data);
    };

    worker.postMessage({ size: GoL3D.size })
  },

  cubesLoop: function() {
    setTimeout(GoL3D.cubesLoop, 150);

    var gen = GoL3D.nextGenerations.shift();
    var i, l;

    if (!gen) return;

    for (i = 0, l = gen.born.length; i < l; i++)
      GoL3D.drawCell(gen.born[i]);

    for (i = 0, l = gen.dead.length; i < l; i++)
      GoL3D.killCell(gen.dead[i]);
  },

  render: function() {
    this.renderer.render(this.scene, this.camera);
  },

  matrix: function(rows, columns) {
    var grid = new Array(rows);

    for (i = 0; i < rows; i++)
      grid[i] = new Array(columns);

    return grid;
  },

  // Cubes might be used over and over again in the same position.
  // They are cached, so next time we don't need to build the same cube again.
  cubes: function(x,y) {
    if (this.cubesCache[x][y]) return this.cubesCache[x][y]

    var cube = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);

    cube.position = new THREE.Vector3((x - this.size/2) * 20 + 10, (y - this.size/2) * 20 + 10, 10)

    this.cubesCache[x][y] = cube;

    return cube;
  },

  initializeCubes: function(rows, columns) {
    var cube;
    this.cubesCache = this.matrix(rows, columns)

    this.cubeGeo = new THREE.CubeGeometry(20,20,20);

    this.cubeMaterial = new THREE.MeshBasicMaterial({
      shading: THREE.FlatShading,
      map: THREE.ImageUtils.loadTexture("/images/square-outline.png")
    });

    this.cubeMaterial.color.setHSV(0.6, 0.4, 1.0);
    this.cubeMaterial.ambient = this.cubeMaterial.color;
  }
}
