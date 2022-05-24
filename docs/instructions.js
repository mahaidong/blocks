// Generated by CoffeeScript 2.7.0
(function() {
  this.Instructions = (function() {
    class Instructions {
      constructor(callback) {
        this.callback = callback;
        this.domElement = $('#instructions');
      }

      intructionsBody() {
        this.domElement.append(`<div id='instructionsContent'> <h1>Click to start</h1> <table>${this.lines()}</table> </div>`);
        $("#instructionsContent").mousedown(() => {
          this.domElement.hide();
          return this.callback();
        });
      }

      insert() {
        this.setBoder();
        this.intructionsBody();
        return this.domElement.show();
      }

      lines() {
        var inst, ret;
        ret = (function() {
          var results;
          results = [];
          for (inst in this.instructions) {
            results.push(this.line(inst));
          }
          return results;
        }).call(this);
        return ret.join(' ');
      }

      line(name) {
        var inst;
        inst = this.instructions[name];
        return `<tr><td class='image'>${this.img(name)}</td> <td class='label'>${inst}</td></tr>`;
      }

      setBoder() {
        var i, len, prefix, ref;
        ref = ['-webkit-', '-moz-', '-o-', '-ms-', ''];
        for (i = 0, len = ref.length; i < len; i++) {
          prefix = ref[i];
          this.domElement.css(prefix + 'border-radius', '10px');
        }
      }

      img(name) {
        return `<img src='./instructions/${name}.png'/>`;
      }

    };

    Instructions.prototype.instructions = {
      leftclick: "Remove block",
      rightclick: "Add block",
      drag: "Drag with the left mouse clicked to move the camera",
      save: "Save map",
      pause: "Pause/Unpause",
      space: "Jump",
      wasd: "WASD keys to move",
      scroll: "Scroll to change selected block"
    };

    return Instructions;

  }).call(this);

}).call(this);

//# sourceMappingURL=instructions.js.map
