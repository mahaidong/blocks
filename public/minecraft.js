(function() {
  var AmbientLight, ClampToEdgeWrapping, CollisionHelper, CubeGeometry, CubeSize, DirectionalLight, Floor, Game, Grid, LinearMipMapLinearFilter, Matrix4, Mesh, MeshLambertMaterial, MeshNormalMaterial, MethodTracer, NearestFilter, Object3D, PerspectiveCamera, PlaneGeometry, Player, PointLight, Projector, Ray, RepeatWrapping, Scene, Texture, TextureHelper, UVMapping, Vector2, Vector3, WebGLRenderer, _ref, init_web_app, pvec, vec;
  var __hasProp = Object.prototype.hasOwnProperty, __slice = Array.prototype.slice, __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  _ref = THREE;
  Object3D = _ref.Object3D;
  Matrix4 = _ref.Matrix4;
  Scene = _ref.Scene;
  Mesh = _ref.Mesh;
  WebGLRenderer = _ref.WebGLRenderer;
  PerspectiveCamera = _ref.PerspectiveCamera;
  _ref = THREE;
  CubeGeometry = _ref.CubeGeometry;
  PlaneGeometry = _ref.PlaneGeometry;
  MeshLambertMaterial = _ref.MeshLambertMaterial;
  MeshNormalMaterial = _ref.MeshNormalMaterial;
  _ref = THREE;
  AmbientLight = _ref.AmbientLight;
  DirectionalLight = _ref.DirectionalLight;
  PointLight = _ref.PointLight;
  Ray = _ref.Ray;
  Vector3 = _ref.Vector3;
  Vector2 = _ref.Vector2;
  _ref = THREE;
  MeshLambertMaterial = _ref.MeshLambertMaterial;
  MeshNormalMaterial = _ref.MeshNormalMaterial;
  Projector = _ref.Projector;
  _ref = THREE;
  Texture = _ref.Texture;
  UVMapping = _ref.UVMapping;
  RepeatWrapping = _ref.RepeatWrapping;
  RepeatWrapping = _ref.RepeatWrapping;
  NearestFilter = _ref.NearestFilter;
  _ref = THREE;
  LinearMipMapLinearFilter = _ref.LinearMipMapLinearFilter;
  ClampToEdgeWrapping = _ref.ClampToEdgeWrapping;
  vec = function(x, y, z) {
    return new Vector3(x, y, z);
  };
  pvec = function(v) {
    return [v.x, v.y, v.z].toString();
  };
  CubeSize = 50;
  MethodTracer = function() {
    this.tracer = {};
    return this;
  };
  MethodTracer.prototype.trace = function(clasname) {
    var _i, _ref2, clas, name;
    clas = eval(clasname);
    _ref2 = clas.prototype;
    for (_i in _ref2) {
      if (!__hasProp.call(_ref2, _i)) continue;
      (function() {
        var tracer, uniqueId;
        var name = _i;
        var f = _ref2[_i];
        if (typeof f === 'function') {
          uniqueId = ("" + (clasname) + "#" + (name));
          tracer = this.tracer;
          tracer[uniqueId] = false;
          return (clas.prototype[name] = function() {
            var args;
            args = __slice.call(arguments, 0);
            tracer[uniqueId] = true;
            return f.apply(this, args);
          });
        }
      }).call(this);
    }
    return this;
  };
  MethodTracer.prototype.traceClasses = function(classNames) {
    var _i, _len, _ref2, clas;
    _ref2 = classNames.split(' ');
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      clas = _ref2[_i];
      this.trace(clas);
    }
    return this;
  };
  MethodTracer.prototype.printUnused = function() {
    var _ref2, id, used;
    _ref2 = this.tracer;
    for (id in _ref2) {
      if (!__hasProp.call(_ref2, id)) continue;
      used = _ref2[id];
      if (!used) {
        puts(id);
      }
    }
    return this;
  };
  Player = function() {
    this.halfHeight = this.height / 2;
    this.halfWidth = this.width / 2;
    this.halfDepth = this.depth / 2;
    this.pos = vec(850, 300, 35);
    this.eyesDelta = this.halfHeight * 0.9;
    return this;
  };
  Player.prototype.width = CubeSize * 0.3;
  Player.prototype.depth = CubeSize * 0.3;
  Player.prototype.height = CubeSize * 1.63;
  Player.prototype.eyesPosition = function() {
    var ret;
    ret = this.pos.clone();
    ret.y += this.eyesDelta;
    return ret;
  };
  Player.prototype.position = function(axis) {
    if (!(typeof axis !== "undefined" && axis !== null)) {
      return this.pos;
    }
    return this.pos[axis];
  };
  Player.prototype.incPosition = function(axis, val) {
    this.pos[axis] += val;
    return null;
  };
  Player.prototype.setPosition = function(axis, val) {
    this.pos[axis] = val;
    return null;
  };
  Player.prototype.collidesWithGround = function() {
    return this.position('y') < this.halfHeight;
  };
  Player.prototype.vertex = function(vertexX, vertexY, vertexZ) {
    var vertex;
    vertex = this.position().clone();
    vertex.x += vertexX * this.halfWidth;
    vertex.y += vertexY * this.halfHeight;
    vertex.z += vertexZ * this.halfDepth;
    return vertex;
  };
  Player.prototype.boundingBox = function() {
    var vmax, vmin;
    vmin = this.vertex(-1, -1, -1);
    vmax = this.vertex(1, 1, 1);
    return {
      vmin: vmin,
      vmax: vmax
    };
  };
  Grid = function(_arg) {
    this.size = _arg;
    this.size || (this.size = 5);
    this.matrix = [];
    this.size.times(__bind(function(i) {
      this.matrix[i] = [];
      return this.size.times(__bind(function(j) {
        return (this.matrix[i][j] = []);
      }, this));
    }, this));
    return this;
  };
  Grid.prototype.insideGrid = function(x, y, z) {
    return (0 <= x) && (x < this.size) && (0 <= y) && (y < this.size) && (0 <= z) && (z < this.size);
  };
  Grid.prototype.get = function(x, y, z) {
    return this.matrix[x][y][z];
  };
  Grid.prototype.put = function(x, y, z, val) {
    return (this.matrix[x][y][z] = val);
  };
  CollisionHelper = function(_arg, _arg2) {
    this.grid = _arg2;
    this.player = _arg;
    return null;
    return this;
  };
  CollisionHelper.prototype.rad = CubeSize;
  CollisionHelper.prototype.halfRad = CubeSize / 2;
  CollisionHelper.prototype.collides = function() {
    var _i, _len, _ref2, cube, playerBox;
    if (this.player.collidesWithGround()) {
      return true;
    }
    playerBox = this.player.boundingBox();
    _ref2 = this.possibleCubes();
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      cube = _ref2[_i];
      if (this.collideWithCube(playerBox, cube)) {
        return true;
      }
    }
    return false;
  };
  CollisionHelper.prototype._addToPosition = function(position, value) {
    var pos;
    pos = position.clone();
    pos.x += value;
    pos.y += value;
    pos.z += value;
    return pos;
  };
  CollisionHelper.prototype.collideWithCube = function(playerBox, cube) {
    var cubeBox, vmax, vmin;
    vmin = this._addToPosition(cube.position, -this.halfRad);
    vmax = this._addToPosition(cube.position, this.halfRad);
    cubeBox = {
      vmin: vmin,
      vmax: vmax
    };
    return CollisionUtils.testCubeCollision(playerBox, cubeBox);
  };
  CollisionHelper.prototype.possibleCubes = function() {
    var cubes, grid;
    cubes = [];
    grid = this.grid;
    this.withRange(function(x, y, z) {
      var cube;
      cube = grid.get(x, y, z);
      if (typeof cube !== "undefined" && cube !== null) {
        return cubes.push(cube);
      }
    });
    return cubes;
  };
  CollisionHelper.prototype.withRange = function(func) {
    var _ref2, maxx, maxy, maxz, minx, miny, minz, vmax, vmin, x, y, z;
    _ref2 = this.player.boundingBox();
    vmin = _ref2.vmin;
    vmax = _ref2.vmax;
    minx = this.toGrid(vmin.x);
    miny = this.toGrid(vmin.y);
    minz = this.toGrid(vmin.z);
    maxx = this.toGrid(vmax.x) + 1;
    maxy = this.toGrid(vmax.y) + 1;
    maxz = this.toGrid(vmax.z) + 1;
    x = minx;
    while (x <= maxx) {
      y = miny;
      while (y <= maxy) {
        z = minz;
        while (z <= maxz) {
          func(x, y, z);
          z++;
        }
        y++;
      }
      x++;
    }
    return null;
  };
  CollisionHelper.prototype.toGrid = function(val) {
    var ret;
    ret = Math.floor(val / this.rad);
    if (ret < 0) {
      return 0;
    }
    if (ret > this.grid.size) {
      return this.grid.size;
    }
    return ret;
  };
  TextureHelper = {
    loadTexture: function(path) {
      var image, texture;
      image = new Image();
      image.src = path;
      texture = new Texture(image, new UVMapping(), ClampToEdgeWrapping, ClampToEdgeWrapping, NearestFilter, LinearMipMapLinearFilter);
      image.onload = function() {
        return (texture.needsUpdate = true);
      };
      return new THREE.MeshLambertMaterial({
        map: texture,
        ambient: 0xbbbbbb
      });
    },
    tileTexture: function(path, repeatx, repeaty) {
      var image, texture;
      image = new Image();
      image.src = path;
      texture = new Texture(image, new UVMapping(), RepeatWrapping, RepeatWrapping, NearestFilter, LinearMipMapLinearFilter);
      texture.repeat.x = repeatx;
      texture.repeat.y = repeaty;
      image.onload = function() {
        return (texture.needsUpdate = true);
      };
      return new THREE.MeshLambertMaterial({
        map: texture,
        ambient: 0xbbbbbb
      });
    }
  };
  Floor = function(width, height) {
    var material, plane, planeGeo, repeatX, repeatY;
    repeatX = width / CubeSize;
    repeatY = height / CubeSize;
    material = TextureHelper.tileTexture("./textures/bedrock.png", repeatX, repeatY);
    planeGeo = new PlaneGeometry(width, height, 1, 1);
    plane = new Mesh(planeGeo, material);
    plane.position.y = -1;
    plane.rotation.x = -Math.PI / 2;
    plane.name = 'floor';
    this.plane = plane;
    return this;
  };
  Floor.prototype.addToScene = function(scene) {
    return scene.add(this.plane);
  };
  Game = function() {
    var dirt, grass, grass_dirt, materials;
    this.rad = CubeSize;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    grass_dirt = TextureHelper.loadTexture("./textures/grass_dirt.png");
    grass = TextureHelper.loadTexture("./textures/grass.png");
    dirt = TextureHelper.loadTexture("./textures/dirt.png");
    materials = [grass_dirt, grass_dirt, grass, dirt, grass_dirt, grass_dirt];
    this.geo = new THREE.CubeGeometry(this.rad, this.rad, this.rad, 1, 1, 1, materials);
    this.mat = new MeshLambertMaterial({
      color: 0xCC0000
    });
    this.move = {
      x: 0,
      z: 0,
      y: 0
    };
    this.keysDown = {};
    this.grid = new Grid(200);
    this.onGround = true;
    this.pause = false;
    this.renderer = this.createRenderer();
    this.camera = this.createCamera();
    this.canvas = this.renderer.domElement;
    this.controls = new Controls(this.camera, this.canvas);
    this.player = new Player();
    this.scene = new Scene();
    new Floor(50000, 50000).addToScene(this.scene);
    this.scene.add(this.camera);
    this.populateWorld();
    this.addLights(this.scene);
    this.renderer.render(this.scene, this.camera);
    this.defineControls();
    this.projector = new Projector();
    this.castRay = null;
    this.moved = false;
    this.toDelete = null;
    return this;
  };
  Game.prototype.gridCoords = function(x, y, z) {
    x = Math.floor(x / this.rad);
    y = Math.floor(y / this.rad);
    z = Math.floor(z / this.rad);
    return [x, y, z];
  };
  Game.prototype.intoGrid = function(x, y, z, val) {
    var args;
    args = this.gridCoords(x, y, z).concat(val);
    return this.grid.put.apply(this.grid, args);
  };
  Game.prototype.populateWorld = function() {
    var _ref2, _ref3, _result, i, j, size;
    size = 5;
    _ref2 = (2 * size);
    for (i = 0; (0 <= _ref2 ? i <= _ref2 : i >= _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
      _ref3 = (2 * size);
      for (j = 0; (0 <= _ref3 ? j <= _ref3 : j >= _ref3); (0 <= _ref3 ? j += 1 : j -= 1)) {
        this.cubeAt(4 + i, 0, j);
      }
    }
    _ref2 = (2 * size);
    for (i = size; (size <= _ref2 ? i <= _ref2 : i >= _ref2); (size <= _ref2 ? i += 1 : i -= 1)) {
      _ref3 = (2 * size);
      for (j = size; (size <= _ref3 ? j <= _ref3 : j >= _ref3); (size <= _ref3 ? j += 1 : j -= 1)) {
        this.cubeAt(4 + i, 1, j);
      }
    }
    _ref2 = (2 * size);
    for (i = size; (size <= _ref2 ? i <= _ref2 : i >= _ref2); (size <= _ref2 ? i += 1 : i -= 1)) {
      _ref3 = (2 * size);
      for (j = size; (size <= _ref3 ? j <= _ref3 : j >= _ref3); (size <= _ref3 ? j += 1 : j -= 1)) {
        this.cubeAt(4 + i, 4, j);
      }
    }
    _result = [];
    for (i = 0; i <= 30; i++) {
      _result.push(this.cubeAt(15 + i, 1 + i, 1));
    }
    return _result;
  };
  Game.prototype.cubeAt = function(x, y, z) {
    var halfcube, mesh;
    mesh = new Mesh(this.geo, new THREE.MeshFaceMaterial());
    mesh.geometry.dynamic = false;
    halfcube = CubeSize / 2;
    mesh.position.set(CubeSize * x, y * CubeSize + halfcube, CubeSize * z);
    mesh.name = ("block at " + (x) + ", " + (y) + ", " + (z));
    this.grid.put(x, y, z, mesh);
    this.scene.add(mesh);
    mesh.updateMatrix();
    return (mesh.matrixAutoUpdate = false);
  };
  Game.prototype.createCamera = function() {
    var camera;
    camera = new PerspectiveCamera(45, this.width / this.height, 1, 10000);
    camera.position.set(1500, 400, 800);
    camera.lookAt(vec(0, 0, 0));
    return camera;
  };
  Game.prototype.createRenderer = function() {
    var renderer;
    renderer = new WebGLRenderer({
      antialias: true
    });
    renderer.setSize(this.width, this.height);
    renderer.setClearColorHex(0xBFD1E5, 1.0);
    renderer.clear();
    $('#container').append(renderer.domElement);
    return renderer;
  };
  Game.prototype.addLights = function(scene) {
    var ambientLight, directionalLight;
    ambientLight = new AmbientLight(0xcccccc);
    scene.add(ambientLight);
    directionalLight = new DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 0.5);
    directionalLight.position.normalize();
    return scene.add(directionalLight);
  };
  Game.prototype.defineControls = function() {
    var _i, _len, _ref2;
    _ref2 = "wasd".split('').concat('space');
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      (function() {
        var key = _ref2[_i];
        $(document).bind('keydown', key, __bind(function() {
          return (this.keysDown[key] = true);
        }, this));
        return $(document).bind('keyup', key, __bind(function() {
          return (this.keysDown[key] = false);
        }, this));
      }).call(this);
    }
    $(document).bind('keydown', 'p', __bind(function() {
      return (this.pause = !this.pause);
    }, this));
    $(this.canvas).mousedown(__bind(function(e) {
      return this.onMouseDown(e);
    }, this));
    $(this.canvas).mouseup(__bind(function(e) {
      return this.onMouseUp(e);
    }, this));
    return $(this.canvas).mousemove(__bind(function(e) {
      return this.onMouseMove(e);
    }, this));
  };
  Game.prototype.onMouseUp = function(event) {
    if (!this.moved && MouseEvent.isLeftButton(event)) {
      this.toDelete = [event.pageX, event.pageY];
    }
    return (this.moved = false);
  };
  Game.prototype.onMouseMove = function(event) {
    return (this.moved = true);
  };
  Game.prototype.onMouseDown = function(event) {
    this.moved = false;
    if (!(MouseEvent.isRightButton(event))) {
      return null;
    }
    return (this.castRay = [event.pageX, event.pageY]);
  };
  Game.prototype.deleteBlock = function() {
    var _ref2, todir, vector, x, y;
    if (!(typeof (_ref2 = this.toDelete) !== "undefined" && _ref2 !== null)) {
      return null;
    }
    _ref2 = this.toDelete;
    x = _ref2[0];
    y = _ref2[1];
    x = (x / this.width) * 2 - 1;
    y = (-y / this.height) * 2 + 1;
    vector = vec(x, y, 1);
    this.projector.unprojectVector(vector, this.camera);
    todir = vector.subSelf(this.camera.position).normalize();
    this.deleteBlockInGrid(new Ray(this.camera.position, todir));
    this.toDelete = null;
    return null;
  };
  Game.prototype.findBlock = function(ray) {
    var _i, _len, _ref2, o;
    _ref2 = ray.intersectScene(this.scene);
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      o = _ref2[_i];
      if (o.object.name !== 'floor') {
        return o;
      }
    }
    return null;
  };
  Game.prototype.deleteBlockInGrid = function(ray) {
    var _ref2, mesh, target, x, y, z;
    target = this.findBlock(ray);
    if (!(typeof target !== "undefined" && target !== null)) {
      return null;
    }
    mesh = target.object;
    this.scene.remove(mesh);
    _ref2 = mesh.position;
    x = _ref2.x;
    y = _ref2.y;
    z = _ref2.z;
    this.intoGrid(x, y, z, null);
    return null;
  };
  Game.prototype.placeBlock = function() {
    var _ref2, todir, vector, x, y;
    if (!(typeof (_ref2 = this.castRay) !== "undefined" && _ref2 !== null)) {
      return null;
    }
    _ref2 = this.castRay;
    x = _ref2[0];
    y = _ref2[1];
    x = (x / this.width) * 2 - 1;
    y = (-y / this.height) * 2 + 1;
    vector = vec(x, y, 1);
    this.projector.unprojectVector(vector, this.camera);
    todir = vector.subSelf(this.camera.position).normalize();
    this.placeBlockInGrid(new Ray(this.camera.position, todir));
    this.castRay = null;
    return null;
  };
  Game.prototype.getAdjacentCubePosition = function(target) {
    var matrix, normal, p;
    normal = target.face.normal.clone();
    matrix = target.object.matrixRotationWorld;
    p = vec().add(target.point, matrix.multiplyVector3(normal));
    return this.addHalfCube(p);
  };
  Game.prototype.addHalfCube = function(p) {
    p.y += CubeSize / 2;
    p.z += CubeSize / 2;
    p.x += CubeSize / 2;
    return p;
  };
  Game.prototype.getCubeOnFloorPosition = function(ray) {
    var o, ret, t, v;
    if (ray.direction.y >= 0) {
      return null;
    }
    ret = vec();
    o = ray.origin;
    v = ray.direction;
    t = (-o.y) / v.y;
    ret.y = 0;
    ret.x = o.x + t * v.x;
    ret.z = o.z + t * v.z;
    return this.addHalfCube(ret);
  };
  Game.prototype.getNewCubePosition = function(ray) {
    var target;
    target = this.findBlock(ray);
    if (!(typeof target !== "undefined" && target !== null)) {
      return this.getCubeOnFloorPosition(ray);
    }
    return this.getAdjacentCubePosition(target);
  };
  Game.prototype.placeBlockInGrid = function(ray) {
    var _ref2, gridPos, p, x, y, z;
    p = this.getNewCubePosition(ray);
    if (!(typeof p !== "undefined" && p !== null)) {
      return null;
    }
    gridPos = this.gridCoords(p.x, p.y, p.z);
    _ref2 = gridPos;
    x = _ref2[0];
    y = _ref2[1];
    z = _ref2[2];
    if (!(this.grid.insideGrid(x, y, z))) {
      return null;
    }
    if (typeof (_ref2 = this.grid.get(x, y, z)) !== "undefined" && _ref2 !== null) {
      return null;
    }
    this.cubeAt(x, y, z);
    return null;
  };
  Game.prototype.collides = function() {
    return new CollisionHelper(this.player, this.grid).collides();
  };
  Game.prototype.start = function() {
    var animate;
    animate = __bind(function() {
      if (!(this.pause)) {
        this.tick();
      }
      return requestAnimationFrame(animate, this.renderer.domElement);
    }, this);
    return animate();
  };
  Game.prototype.axes = ['x', 'y', 'z'];
  Game.prototype.iterationCount = 10;
  Game.prototype.moveCube = function(axis) {
    var _i, _len, _ref2, iterationCount, ivel, originalpos;
    iterationCount = this.iterationCount;
    ivel = {};
    _ref2 = this.axes;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      axis = _ref2[_i];
      ivel[axis] = this.move[axis] / this.iterationCount;
    }
    while (iterationCount-- > 0) {
      _ref2 = this.axes;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        axis = _ref2[_i];
        if (ivel[axis] !== 0) {
          originalpos = this.player.position(axis);
          this.player.incPosition(axis, ivel[axis]);
          if (this.collides()) {
            this.player.setPosition(axis, originalpos);
            if (axis === 'y' && ivel.y < 0) {
              this.touchesGround();
            }
            this.move[axis] = 0;
            ivel[axis] = 0;
          }
        }
      }
    }
    return null;
  };
  Game.prototype.touchesGround = function() {
    return (this.onGround = true);
  };
  Game.prototype.playerKeys = {
    w: 'z+',
    s: 'z-',
    a: 'x+',
    d: 'x-'
  };
  Game.prototype.shouldJump = function() {
    return this.keysDown.space && this.onGround && this.move.y === 0;
  };
  Game.prototype.defineMove = function() {
    var _ref2, _ref3, action, axis, baseVel, jumpSpeed, key, operation, vel;
    baseVel = 7;
    jumpSpeed = 12;
    this.move.x = 0;
    this.move.z = 0;
    _ref2 = this.playerKeys;
    for (key in _ref2) {
      if (!__hasProp.call(_ref2, key)) continue;
      action = _ref2[key];
      _ref3 = action;
      axis = _ref3[0];
      operation = _ref3[1];
      vel = operation === '-' ? -baseVel : baseVel;
      if (this.keysDown[key]) {
        this.move[axis] += vel;
      }
    }
    if (this.shouldJump()) {
      this.onGround = false;
      this.move.y += jumpSpeed;
    }
    this.projectMoveOnCamera();
    this.applyGravity();
    return null;
  };
  Game.prototype.projectMoveOnCamera = function() {
    var _ref2, frontDir, rightDir, x, z;
    _ref2 = this.controls.viewDirection();
    x = _ref2.x;
    z = _ref2.z;
    frontDir = new Vector2(x, z).normalize();
    rightDir = new Vector2(frontDir.y, -frontDir.x);
    frontDir.multiplyScalar(this.move.z);
    rightDir.multiplyScalar(this.move.x);
    this.move.x = frontDir.x + rightDir.x;
    return (this.move.z = frontDir.y + rightDir.y);
  };
  Game.prototype.applyGravity = function() {
    if (!(this.move.y < -20)) {
      return this.move.y -= 1;
    }
  };
  Game.prototype.setCameraEyes = function() {
    var eyesDelta, pos;
    pos = this.player.eyesPosition();
    this.controls.move(pos);
    eyesDelta = this.controls.viewDirection().normalize().multiplyScalar(20);
    eyesDelta.y = 0;
    pos.subSelf(eyesDelta);
    return null;
  };
  Game.prototype.tick = function() {
    this.placeBlock();
    this.deleteBlock();
    this.defineMove();
    this.moveCube();
    this.renderer.clear();
    this.controls.update();
    this.setCameraEyes();
    this.renderer.render(this.scene, this.camera);
    return null;
  };
  Game.prototype.debug = function() {
    var _i, _len, _ref2, axis;
    _ref2 = this.axes;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      axis = _ref2[_i];
      $('#pos' + axis).html(String(this.player.position(axis)));
    }
    return null;
  };
  init_web_app = function() {
    return new Game().start();
  };
window.AmbientLight = AmbientLight
window.ClampToEdgeWrapping = ClampToEdgeWrapping
window.CollisionHelper = CollisionHelper
window.CubeGeometry = CubeGeometry
window.CubeSize = CubeSize
window.DirectionalLight = DirectionalLight
window.Floor = Floor
window.Game = Game
window.Grid = Grid
window.LinearMipMapLinearFilter = LinearMipMapLinearFilter
window.Matrix4 = Matrix4
window.Mesh = Mesh
window.MeshLambertMaterial = MeshLambertMaterial
window.MeshNormalMaterial = MeshNormalMaterial
window.MethodTracer = MethodTracer
window.NearestFilter = NearestFilter
window.Object3D = Object3D
window.PerspectiveCamera = PerspectiveCamera
window.PlaneGeometry = PlaneGeometry
window.Player = Player
window.PointLight = PointLight
window.Projector = Projector
window.Ray = Ray
window.RepeatWrapping = RepeatWrapping
window.Scene = Scene
window.Texture = Texture
window.TextureHelper = TextureHelper
window.UVMapping = UVMapping
window.Vector2 = Vector2
window.Vector3 = Vector3
window.WebGLRenderer = WebGLRenderer
window._ref = _ref
window.init_web_app = init_web_app
window.pvec = pvec
window.vec = vec
}).call(this);
