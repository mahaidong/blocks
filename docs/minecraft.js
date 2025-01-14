// Generated by CoffeeScript 2.7.0
(function() {
  // Imports
  var AmbientLight, ClampToEdgeWrapping, Clock, CollisionHelper, CubeGeometry, CubeSize, DirectionalLight, Floor, Game, Grid, LinearMipMapLinearFilter, Matrix4, Mesh, MeshLambertMaterial, MeshNormalMaterial, NearestFilter, Object3D, PerspectiveCamera, PlaneGeometry, Player, PointLight, Projector, Raycaster, RepeatWrapping, Scene, Texture, TextureHelper, UVMapping, Vector2, Vector3, WebGLRenderer, vec;

  ({Object3D, Matrix4, Scene, Mesh, WebGLRenderer, PerspectiveCamera} = THREE);

  ({CubeGeometry, PlaneGeometry, MeshLambertMaterial, MeshNormalMaterial} = THREE);

  ({AmbientLight, DirectionalLight, PointLight, Raycaster, Vector3, Vector2} = THREE);

  ({MeshLambertMaterial, MeshNormalMaterial, Projector} = THREE);

  ({Texture, UVMapping, RepeatWrapping, RepeatWrapping, NearestFilter} = THREE);

  ({LinearMipMapLinearFilter, ClampToEdgeWrapping, Clock} = THREE);

  vec = function(x, y, z) {
    return new Vector3(x, y, z);
  };

  CubeSize = 50;

  Player = (function() {
    class Player {
      constructor() {
        this.halfHeight = this.height / 2;
        this.halfWidth = this.width / 2;
        this.halfDepth = this.depth / 2;
        this.pos = vec();
        this.eyesDelta = this.halfHeight * 0.9;
      }

      eyesPosition() {
        var ret;
        ret = this.pos.clone();
        ret.y += this.eyesDelta;
        return ret;
      }

      position(axis) {
        if (axis == null) {
          return this.pos;
        }
        return this.pos[axis];
      }

      incPosition(axis, val) {
        this.pos[axis] += val;
      }

      setPosition(axis, val) {
        this.pos[axis] = val;
      }

      collidesWithGround() {
        return this.position('y') < this.halfHeight;
      }

      vertex(vertexX, vertexY, vertexZ) {
        var vertex;
        vertex = this.position().clone();
        vertex.x += vertexX * this.halfWidth;
        vertex.y += vertexY * this.halfHeight;
        vertex.z += vertexZ * this.halfDepth;
        return vertex;
      }

      boundingBox() {
        var vmax, vmin;
        vmin = this.vertex(-1, -1, -1);
        vmax = this.vertex(1, 1, 1);
        return {
          vmin: vmin,
          vmax: vmax
        };
      }

    };

    Player.prototype.width = CubeSize * 0.3;

    Player.prototype.depth = CubeSize * 0.3;

    Player.prototype.height = CubeSize * 1.63;

    return Player;

  }).call(this);

  Grid = class Grid {
    constructor(size1 = 5) {
      this.size = size1;
      this.matrix = [];
      this.size.times((i) => {
        this.matrix[i] = [];
        return this.size.times((j) => {
          return this.matrix[i][j] = [];
        });
      });
      this.map = JSON.parse(JSON.stringify(this.matrix)); //deep copy
    }

    insideGrid(x, y, z) {
      return (0 <= x && x < this.size) && (0 <= y && y < this.size) && (0 <= z && z < this.size);
    }

    get(x, y, z) {
      return this.matrix[x][y][z];
    }

    put(x, y, z, val) {
      this.matrix[x][y][z] = val;
      if (!val) {
        return this.map[x][y][z] = null;
      }
      return this.map[x][y][z] = val.material.materials[0].map.image.src.match(/\/([a-zA-Z0-9_]*)\..*$/)[1];
    }

    gridCoords(x, y, z) {
      x = Math.floor(x / CubeSize);
      y = Math.floor(y / CubeSize);
      z = Math.floor(z / CubeSize);
      return [x, y, z];
    }

  };

  CollisionHelper = (function() {
    class CollisionHelper {
      constructor(player, grid1) {
        this.player = player;
        this.grid = grid1;
        return;
      }

      collides() {
        var cube, l, len, playerBox, ref;
        if (this.player.collidesWithGround()) {
          return true;
        }
        if (this.beyondBounds()) {
          return true;
        }
        playerBox = this.player.boundingBox();
        ref = this.possibleCubes();
        for (l = 0, len = ref.length; l < len; l++) {
          cube = ref[l];
          if (this._collideWithCube(playerBox, cube)) {
            return true;
          }
        }
        return false;
      }

      beyondBounds() {
        var p, x, y, z;
        p = this.player.position();
        [x, y, z] = this.grid.gridCoords(p.x, p.y, p.z);
        if (!this.grid.insideGrid(x, 0, z)) {
          return true;
        }
      }

      _addToPosition(position, value) {
        var pos;
        pos = position.clone();
        pos.x += value;
        pos.y += value;
        pos.z += value;
        return pos;
      }

      collideWithCube(cube) {
        return this._collideWithCube(this.player.boundingBox(), cube);
      }

      _collideWithCube(playerBox, cube) {
        var cubeBox, vmax, vmin;
        vmin = this._addToPosition(cube.position, -this.halfRad);
        vmax = this._addToPosition(cube.position, this.halfRad);
        cubeBox = {vmin, vmax};
        return CollisionUtils.testCubeCollision(playerBox, cubeBox);
      }

      possibleCubes() {
        var cubes, grid;
        cubes = [];
        grid = this.grid;
        this.withRange(function(x, y, z) {
          var cube;
          cube = grid.get(x, y, z);
          if (cube != null) {
            return cubes.push(cube);
          }
        });
        return cubes;
      }

      withRange(func) {
        var maxx, maxy, maxz, minx, miny, minz, vmax, vmin, x, y, z;
        ({vmin, vmax} = this.player.boundingBox());
        minx = this.toGrid(vmin.x);
        miny = this.toGrid(vmin.y);
        minz = this.toGrid(vmin.z);
        maxx = this.toGrid(vmax.x + this.rad);
        maxy = this.toGrid(vmax.y + this.rad);
        maxz = this.toGrid(vmax.z + this.rad);
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
      }

      toGrid(val) {
        var ret;
        ret = Math.floor(val / this.rad);
        if (ret < 0) {
          return 0;
        }
        if (ret > this.grid.size - 1) {
          return this.grid.size - 1;
        }
        return ret;
      }

    };

    CollisionHelper.prototype.rad = CubeSize;

    CollisionHelper.prototype.halfRad = CubeSize / 2;

    return CollisionHelper;

  }).call(this);

  TextureHelper = {
    loadTexture: function(path) {
      var image, texture;
      image = new Image();
      image.src = path;
      texture = new Texture(image, new UVMapping(), ClampToEdgeWrapping, ClampToEdgeWrapping, NearestFilter, LinearMipMapLinearFilter);
      image.onload = function() {
        return texture.needsUpdate = true;
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
        return texture.needsUpdate = true;
      };
      return new THREE.MeshLambertMaterial({
        map: texture,
        ambient: 0xbbbbbb
      });
    }
  };

  Floor = class Floor {
    constructor(width, height) {
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
    }

    addToScene(scene) {
      return scene.add(this.plane);
    }

  };

  Game = (function() {
    class Game {
      constructor(populateWorldFunction) {
        this.enablePointLock = this.enablePointLock.bind(this);
        this.disablePointLock = this.disablePointLock.bind(this);
        this.populateWorldFunction = populateWorldFunction;
        this.rad = CubeSize;
        this.currentMeshSpec = this.createGrassGeometry();
        this.cubeBlocks = this.createBlocksGeometry();
        this.selectCubeBlock('one');
        this.move = {
          x: 0,
          z: 0,
          y: 0
        };
        this.keysDown = {};
        this.grid = new Grid(100);
        this.onGround = true;
        this.pause = false;
        this.fullscreen = false;
        this.renderer = this.createRenderer();
        this.rendererPosition = $("#minecraft-container canvas").offset();
        this.camera = this.createCamera();
        THREEx.WindowResize(this.renderer, this.camera);
        this.canvas = this.renderer.domElement;
        this.CamControls = new CamControls(this.camera, this.canvas);
        this.player = new Player();
        this.scene = new Scene();
        new Floor(50000, 50000).addToScene(this.scene);
        this.scene.add(this.camera);
        this.addLights(this.scene);
        this.projector = new Projector();
        this.castRay = null;
        this.moved = false;
        this.toDelete = null;
        this.collisionHelper = new CollisionHelper(this.player, this.grid);
        this.clock = new Clock();
        this.populateWorld();
        this.defineCamControls();
      }

      width() {
        return window.innerWidth;
      }

      height() {
        return window.innerHeight;
      }

      createBlocksGeometry() {
        var b, cubeBlocks, geo, l, len, t;
        cubeBlocks = {};
        for (l = 0, len = Blocks.length; l < len; l++) {
          b = Blocks[l];
          geo = new THREE.CubeGeometry(this.rad, this.rad, this.rad, 1, 1, 1);
          t = this.texture(b);
          cubeBlocks[b] = this.meshSpec(geo, [t, t, t, t, t, t]);
        }
        return cubeBlocks;
      }

      createGrassGeometry() {
        var dirt, grass, grass_dirt, materials;
        [grass_dirt, grass, dirt] = this.textures("grass_dirt", "grass", "dirt");
        materials = [
          grass_dirt, //right
          grass_dirt, // left
          grass, // top
          dirt, // bottom
          grass_dirt, // back
          grass_dirt //front
        ];
        return this.meshSpec(new THREE.CubeGeometry(this.rad, this.rad, this.rad, 1, 1, 1), materials);
      }

      texture(name) {
        return TextureHelper.loadTexture(`./textures/${name}.png`);
      }

      textures(...names) {
        var name;
        return (function() {
          var l, len, results;
          results = [];
          for (l = 0, len = names.length; l < len; l++) {
            name = names[l];
            results.push(this.texture(name));
          }
          return results;
        }).call(this);
      }

      gridCoords(x, y, z) {
        return this.grid.gridCoords(x, y, z);
      }

      meshSpec(geometry, material) {
        return {geometry, material};
      }

      intoGrid(x, y, z, val) {
        var args;
        args = this.gridCoords(x, y, z).concat(val);
        return this.grid.put(...args);
      }

      generateHeight() {
        var data, perlin, quality, size, z;
        size = 11;
        data = [];
        size.times(function(i) {
          data[i] = [];
          return size.times(function(j) {
            return data[i][j] = 0;
          });
        });
        perlin = new ImprovedNoise();
        quality = 0.05;
        z = Math.random() * 100;
        4..times(function(j) {
          size.times(function(x) {
            return size.times(function(y) {
              var noise;
              noise = perlin.noise(x / quality, y / quality, z);
              return data[x][y] += noise * quality;
            });
          });
          return quality *= 4;
        });
        return data;
      }

      haveSave() {
        return !!localStorage["map"] && !!localStorage["position"] && !!localStorage["direction"];
      }

      loadWorld() {
        var cubeName, direction, l, len, map, mapYZ, mapZ, position, results, x, y, z;
        map = JSON.parse(localStorage["map"]);
        position = JSON.parse(localStorage["position"]);
        direction = JSON.parse(localStorage["direction"]);
        this.player.pos.set(...position);
        this.CamControls.setDirection(direction);
        results = [];
        for (x = l = 0, len = map.length; l < len; x = ++l) {
          mapYZ = map[x];
          results.push((function() {
            var len1, m, results1;
            results1 = [];
            for (y = m = 0, len1 = mapYZ.length; m < len1; y = ++m) {
              mapZ = mapYZ[y];
              results1.push((function() {
                var len2, n, results2;
                results2 = [];
                for (z = n = 0, len2 = mapZ.length; n < len2; z = ++n) {
                  cubeName = mapZ[z];
                  if (cubeName) {
                    results2.push(this.cubeAt(x, y, z, this.cubeBlocks[cubeName]));
                  } else {
                    results2.push(void 0);
                  }
                }
                return results2;
              }).call(this));
            }
            return results1;
          }).call(this));
        }
        return results;
      }

      populateWorld() {
        var data, height, i, j, l, m, middle, middlePos, playerHeight;
        if (this.haveSave()) {
          return this.loadWorld();
        }
        middle = this.grid.size / 2;
        data = this.generateHeight();
        playerHeight = null;
        for (i = l = -5; l <= 5; i = ++l) {
          for (j = m = -5; m <= 5; j = ++m) {
            height = (Math.abs(Math.floor(data[i + 5][j + 5]))) + 1;
            if (i === 0 && j === 0) {
              playerHeight = (height + 1) * CubeSize;
            }
            height.times((k) => {
              return this.cubeAt(middle + i, k, middle + j);
            });
          }
        }
        middlePos = middle * CubeSize;
        return this.player.pos.set(middlePos, playerHeight, middlePos);
      }

      populateWorld2() {
        var i, middle, pos, ret, setblockFunc;
        middle = this.grid.size / 2;
        ret = this.populateWorldFunction != null ? (setblockFunc = (x, y, z, blockName) => {
          return this.cubeAt(x, y, z, this.cubeBlocks[blockName]);
        }, this.populateWorldFunction(setblockFunc, middle)) : [middle, 3, middle];
        pos = (function() {
          var l, len, results;
          results = [];
          for (l = 0, len = ret.length; l < len; l++) {
            i = ret[l];
            results.push(i * CubeSize);
          }
          return results;
        })();
        return this.player.pos.set(...pos);
      }

      cubeAt(x, y, z, meshSpec, validatingFunction) {
        var halfcube, mesh;
        meshSpec || (meshSpec = this.currentMeshSpec);
        if (meshSpec.geometry == null) {
          raise("bad material");
        }
        if (meshSpec.material == null) {
          raise("really bad material");
        }
        mesh = new Mesh(meshSpec.geometry, new THREE.MeshFaceMaterial(meshSpec.material));
        mesh.geometry.dynamic = false;
        halfcube = CubeSize / 2;
        mesh.position.set(CubeSize * x, y * CubeSize + halfcube, CubeSize * z);
        mesh.name = "block";
        if (validatingFunction != null) {
          if (!validatingFunction(mesh)) {
            return;
          }
        }
        this.grid.put(x, y, z, mesh);
        this.scene.add(mesh);
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
      }

      createCamera() {
        var camera;
        camera = new PerspectiveCamera(45, this.width() / this.height(), 1, 10000);
        camera.lookAt(vec(0, 0, 0));
        return camera;
      }

      createRenderer() {
        var renderer;
        renderer = new WebGLRenderer({
          antialias: true
        });
        renderer.setSize(this.width(), this.height());
        renderer.setClearColorHex(0xBFD1E5, 1.0);
        renderer.clear();
        $('#minecraft-container').append(renderer.domElement);
        return renderer;
      }

      addLights(scene) {
        var ambientLight, directionalLight;
        ambientLight = new AmbientLight(0xaaaaaa);
        scene.add(ambientLight);
        directionalLight = new DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 0.5);
        directionalLight.position.normalize();
        return scene.add(directionalLight);
      }

      defineCamControls() {
        var bindit, key, l, len, len1, m, ref, ref1, results, target;
        bindit = (key) => {
          $(document).bind('keydown', key, () => {
            this.keysDown[key] = true;
            return false;
          });
          return $(document).bind('keyup', key, () => {
            this.keysDown[key] = false;
            return false;
          });
        };
        ref = "wasd".split('').concat('space', 'up', 'down', 'left', 'right');
        for (l = 0, len = ref.length; l < len; l++) {
          key = ref[l];
          bindit(key);
        }
        $(document).bind('keydown', 'p', () => {
          return this.togglePause();
        });
        $(document).bind('keydown', 'k', () => {
          return this.save();
        });
        ref1 = [document, this.canvas];
        results = [];
        for (m = 0, len1 = ref1.length; m < len1; m++) {
          target = ref1[m];
          $(target).mousedown((e) => {
            return this.onMouseDown(e);
          });
          $(target).mouseup((e) => {
            return this.onMouseUp(e);
          });
          results.push($(target).mousemove((e) => {
            return this.onMouseMove(e);
          }));
        }
        return results;
      }

      save() {
        localStorage["map"] = JSON.stringify(this.grid.map);
        localStorage["position"] = JSON.stringify([this.player.position("x"), this.player.position("y"), this.player.position("z")]);
        return localStorage["direction"] = JSON.stringify(this.CamControls.getDirection());
      }

      togglePause() {
        this.pause = !this.pause;
        if (this.pause === false) {
          this.clock.start();
        }
      }

      relativePosition(x, y) {
        return [x - this.rendererPosition.left, y - this.rendererPosition.top];
      }

      onMouseUp(e) {
        if (!this.moved && MouseEvent.isLeftButton(e)) {
          this.toDelete = this._targetPosition(e);
        }
        return this.moved = false;
      }

      onMouseMove(event) {
        return this.moved = true;
      }

      onMouseDown(e) {
        this.moved = false;
        if (!MouseEvent.isRightButton(e)) {
          return;
        }
        return this.castRay = this._targetPosition(e);
      }

      _targetPosition(e) {
        if (this.fullscreen) {
          return this.relativePosition(this.width() / 2, this.height() / 2);
        }
        return this.relativePosition(e.pageX, e.pageY);
      }

      deleteBlock() {
        var todir, vector, x, y;
        if (this.toDelete == null) {
          return;
        }
        [x, y] = this.toDelete;
        x = (x / this.width()) * 2 - 1;
        y = (-y / this.height()) * 2 + 1;
        vector = vec(x, y, 1);
        this.projector.unprojectVector(vector, this.camera);
        todir = vector.sub(this.camera.position).normalize();
        this.deleteBlockInGrid(new Raycaster(this.camera.position, todir));
        this.toDelete = null;
      }

      findBlock(ray) {
        var l, len, o, ref;
        ref = ray.intersectObjects(this.scene.children);
        for (l = 0, len = ref.length; l < len; l++) {
          o = ref[l];
          if (o.object.name !== 'floor') {
            return o;
          }
        }
        return null;
      }

      deleteBlockInGrid(ray) {
        var mesh, target, x, y, z;
        target = this.findBlock(ray);
        if (target == null) {
          return;
        }
        if (!this.withinHandDistance(target.object.position)) {
          return;
        }
        mesh = target.object;
        this.scene.remove(mesh);
        ({x, y, z} = mesh.position);
        this.intoGrid(x, y, z, null);
      }

      placeBlock() {
        var todir, vector, x, y;
        if (this.castRay == null) {
          return;
        }
        [x, y] = this.castRay;
        x = (x / this.width()) * 2 - 1;
        y = (-y / this.height()) * 2 + 1;
        vector = vec(x, y, 1);
        this.projector.unprojectVector(vector, this.camera);
        todir = vector.sub(this.camera.position).normalize();
        this.placeBlockInGrid(new Raycaster(this.camera.position, todir));
        this.castRay = null;
      }

      getAdjacentCubePosition(target) {
        var normal, p;
        normal = target.face.normal.clone();
        p = target.object.position.clone().add(normal.multiplyScalar(CubeSize));
        return p;
      }

      addHalfCube(p) {
        p.y += CubeSize / 2;
        p.z += CubeSize / 2;
        p.x += CubeSize / 2;
        return p;
      }

      getCubeOnFloorPosition(raycast) {
        var o, ray, ret, t, v;
        ray = raycast.ray;
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
      }

      selectCubeBlock(name) {
        return this.currentCube = this.cubeBlocks[name];
      }

      getNewCubePosition(ray) {
        var target;
        target = this.findBlock(ray);
        if (target == null) {
          return this.getCubeOnFloorPosition(ray);
        }
        return this.getAdjacentCubePosition(target);
      }

      createCubeAt(x, y, z) {
        return this.cubeAt(x, y, z, this.currentCube, (cube) => {
          return !this.collisionHelper.collideWithCube(cube);
        });
      }

      withinHandDistance(pos) {
        var dist;
        dist = pos.distanceTo(this.player.position());
        return dist <= CubeSize * this.handLength;
      }

      placeBlockInGrid(ray) {
        var gridPos, p, x, y, z;
        p = this.getNewCubePosition(ray);
        if (p == null) {
          return;
        }
        gridPos = this.gridCoords(p.x, p.y, p.z);
        [x, y, z] = gridPos;
        if (!this.withinHandDistance(p)) {
          return;
        }
        if (!this.grid.insideGrid(x, y, z)) {
          return;
        }
        if (this.grid.get(x, y, z) != null) {
          return;
        }
        this.createCubeAt(x, y, z);
      }

      collides() {
        return this.collisionHelper.collides();
      }

      start() {
        var animate;
        animate = () => {
          if (!this.pause) {
            this.tick();
          }
          return requestAnimationFrame(animate, this.renderer.domElement);
        };
        return animate();
      }

      enablePointLock() {
        $("#cursor").show();
        return this.fullscreen = true;
      }

      disablePointLock() {
        $("#cursor").hide();
        return this.fullscreen = false;
      }

      moveCube(speedRatio) {
        var axis, iterationCount, l, len, originalpos, ref;
        this.defineMove();
        iterationCount = Math.round(this.iterationCount * speedRatio);
        while (iterationCount-- > 0) {
          this.applyGravity();
          ref = this.axes;
          for (l = 0, len = ref.length; l < len; l++) {
            axis = ref[l];
            if (!(this.move[axis] !== 0)) {
              continue;
            }
            originalpos = this.player.position(axis);
            this.player.incPosition(axis, this.move[axis]);
            if (this.collides()) {
              this.player.setPosition(axis, originalpos);
              if (axis === 'y' && this.move.y < 0) {
                this.onGround = true;
              }
            } else if (axis === 'y' && this.move.y <= 0) {
              this.onGround = false;
            }
          }
        }
      }

      shouldJump() {
        return this.keysDown.space && this.onGround;
      }

      defineMove() {
        var action, axis, baseVel, jumpSpeed, key, operation, ref, vel;
        baseVel = .4;
        jumpSpeed = .8;
        this.move.x = 0;
        this.move.z = 0;
        ref = this.playerKeys;
        for (key in ref) {
          action = ref[key];
          [axis, operation] = action;
          vel = operation === '-' ? -baseVel : baseVel;
          if (this.keysDown[key]) {
            this.move[axis] += vel;
          }
        }
        if (this.shouldJump()) {
          this.onGround = false;
          this.move.y = jumpSpeed;
        }
        this.garanteeXYNorm();
        this.projectMoveOnCamera();
      }

      garanteeXYNorm() {
        var ratio;
        if (this.move.x !== 0 && this.move.z !== 0) {
          ratio = Math.cos(Math.PI / 4);
          this.move.x *= ratio;
          this.move.z *= ratio;
        }
      }

      projectMoveOnCamera() {
        var frontDir, rightDir, x, z;
        ({x, z} = this.CamControls.viewDirection());
        frontDir = new Vector2(x, z).normalize();
        rightDir = new Vector2(frontDir.y, -frontDir.x);
        frontDir.multiplyScalar(this.move.z);
        rightDir.multiplyScalar(this.move.x);
        this.move.x = frontDir.x + rightDir.x;
        return this.move.z = frontDir.y + rightDir.y;
      }

      applyGravity() {
        if (!(this.move.y < -1)) {
          return this.move.y -= .005;
        }
      }

      setCameraEyes() {
        var eyesDelta, pos;
        pos = this.player.eyesPosition();
        this.CamControls.move(pos);
        eyesDelta = this.CamControls.viewDirection().normalize().multiplyScalar(20);
        eyesDelta.y = 0;
        pos.sub(eyesDelta);
      }

      tick() {
        var speedRatio;
        speedRatio = this.clock.getDelta() / this.idealSpeed;
        this.placeBlock();
        this.deleteBlock();
        this.moveCube(speedRatio);
        this.renderer.clear();
        this.CamControls.update();
        this.setCameraEyes();
        this.renderer.render(this.scene, this.camera);
      }

    };

    Game.prototype.handLength = 7;

    Game.prototype.axes = ['x', 'y', 'z'];

    Game.prototype.iterationCount = 10;

    Game.prototype.playerKeys = {
      w: 'z+',
      up: 'z+',
      s: 'z-',
      down: 'z-',
      a: 'x+',
      left: 'x+',
      d: 'x-',
      right: 'x-'
    };

    Game.prototype.idealSpeed = 1 / 60;

    return Game;

  }).call(this);

  this.Minecraft = {
    start: function() {
      var startGame;
      $(document).bind("contextmenu", function() {
        return false;
      });
      if (!Detector.webgl) {
        return Detector.addGetWebGLMessage();
      }
      startGame = function() {
        var game;
        game = new Game();
        new BlockSelection(game).insert();
        $("#minecraft-blocks").show();
        window.game = game;
        return game.start();
      };
      return new Instructions(startGame).insert();
    }
  };

}).call(this);

//# sourceMappingURL=minecraft.js.map
