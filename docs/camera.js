// Generated by CoffeeScript 2.7.0
(function() {
  this.MouseEvent = {
    isLeftButton: function(event) {
      return event.which === 1;
    },
    isRightButton: function(event) {
      return event.which === 3;
    },
    isLeftButtonDown: function(event) {
      return event.button === 0 && this.isLeftButton(event);
    }
  };

  this.Controls = (function() {
    class Controls {
      constructor(object, domElement) {
        this.object = object;
        this.target = new THREE.Vector3(0, 0, 0);
        this.domElement = domElement || document;
        this.lookSpeed = 0.20;
        this.mouseX = 0;
        this.mouseY = 0;
        this.lat = -66.59;
        this.lon = -31.8;
        this.deltaX = 0;
        this.deltaY = 0;
        this.mouseDragOn = false;
        this.anchorx = null;
        this.anchory = null;
        this.mouseLocked = false;
        this.defineBindings();
      }

      enableMouseLocked() {
        return this.mouseLocked = true;
      }

      disableMouseLocked() {
        return this.mouseLocked = false;
      }

      defineBindings() {
        $(document).mousemove((e) => {
          return this.onMouseMove(e);
        });
        $(this.domElement).mousedown((e) => {
          return this.onMouseDown(e);
        });
        $(this.domElement).mouseup((e) => {
          return this.onMouseUp(e);
        });
        return $(this.domElement).mouseenter((e) => {
          return this.onMouserEnter(e);
        });
      }

      showCrosshair() {
        return document.getElementById('cursor').style.display = 'block';
      }

      hideCrosshair() {
        return document.getElementById('cursor').style.display = 'none';
      }

      onMouserEnter(event) {
        if (!MouseEvent.isLeftButtonDown(event)) {
          return this.onMouseUp(event);
        }
      }

      onMouseDown(event) {
        if (!MouseEvent.isLeftButton(event)) {
          return;
        }
        if (this.mouseLocked && this.domElement !== document) {
          this.domElement.focus();
        }
        this.anchorx = event.pageX;
        this.anchory = event.pageY;
        this.setMouse(this.anchorx, this.anchory);
        this.mouseDragOn = true;
        return false;
      }

      onMouseUp(event) {
        this.mouseDragOn = false;
        return false;
      }

      setMouse(x, y) {
        this.mouseX = x;
        this.mouseY = y;
        return this.setDelta(x - this.anchorx, y - this.anchory);
      }

      setDelta(x, y) {
        this.deltaX = x;
        return this.deltaY = y;
      }

      setDirection(dir) {
        return ({lat: this.lat, lon: this.lon} = dir);
      }

      getDirection() {
        return {lat: this.lat, lon: this.lon};
      }

      onMouseMove(event) {
        var e, x, y;
        if (this.mouseDragOn) {
          console.log(event);
          this.setMouse(event.pageX, event.pageY);
        } else if (this.mouseLocked) {
          e = event.originalEvent;
          x = e.movementX || e.mozMovementX || e.webkitMovementX;
          y = e.movementY || e.mozMovementY || e.webkitMovementY;
          this.setDelta(x, y);
        }
      }

      viewDirection() {
        return this.target.clone().sub(this.object.position);
      }

      move(newPosition) {
        this.object.position = newPosition;
        return this.updateLook();
      }

      updateLook() {
        var cos, p, phi, sin, theta;
        ({sin, cos} = Math);
        phi = (90 - this.lat) * this.halfCircle;
        theta = this.lon * this.halfCircle;
        p = this.object.position;
        assoc(this.target, {
          x: p.x + 100 * sin(phi) * cos(theta),
          y: p.y + 100 * cos(phi),
          z: p.z + 100 * sin(phi) * sin(theta)
        });
        this.object.lookAt(this.target);
      }

      update() {
        var max, min;
        if (!(this.mouseDragOn || this.mouseLocked)) {
          return;
        }
        if (this.mouseDragOn && this.mouseX === this.anchorx && this.mouseY === this.anchory) {
          return;
        }
        ({max, min} = Math);
        if (this.mouseLocked) {
          if (this.deltaX === this.previousDeltaX && this.deltaY === this.previousDeltaY) {
            return;
          }
          this.previousDeltaX = this.deltaX;
          this.previousDeltaY = this.deltaY;
          this.anchorx = window.innerWidth / 2;
          this.anchory = window.innerHeight / 2;
        } else if (this.mouseDragOn) {
          if (this.mouseX === this.anchorx && this.mouseY === this.anchory) {
            return;
          }
          this.anchorx = this.mouseX;
          this.anchory = this.mouseY;
        }
        this.lon += this.deltaX * this.lookSpeed;
        this.lat -= this.deltaY * this.lookSpeed;
        this.lat = max(-85, min(85, this.lat));
        this.updateLook();
      }

    };

    Controls.prototype.halfCircle = Math.PI / 180;

    return Controls;

  }).call(this);

}).call(this);

//# sourceMappingURL=camera.js.map
