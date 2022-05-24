// Generated by CoffeeScript 2.6.1
(function() {
  this.MethodTracer = class MethodTracer {
    constructor() {
      this.tracer = {};
    }

    trace(clasname) {
      var clas, f, name, ref, tracer, uniqueId;
      clas = eval(clasname);
      ref = clas.prototype;
      for (name in ref) {
        f = ref[name];
        if (!(typeof f === 'function')) {
          continue;
        }
        uniqueId = `${clasname}#${name}`;
        tracer = this.tracer;
        tracer[uniqueId] = false;
        clas.prototype[name] = function(...args) {
          tracer[uniqueId] = true;
          return f(...args);
        };
      }
      return this;
    }

    traceClasses(classNames) {
      var clas, i, len, ref;
      ref = classNames.split(' ');
      for (i = 0, len = ref.length; i < len; i++) {
        clas = ref[i];
        this.trace(clas);
      }
      return this;
    }

    traceModule(module, moduleName) {
      var f, name, tracer, uniqueId;
      for (name in module) {
        f = module[name];
        if (!(typeof f === 'function')) {
          continue;
        }
        uniqueId = `Module ${moduleName}#${name}`;
        tracer = this.tracer;
        tracer[uniqueId] = false;
        module[name] = this.wrapfn(module, uniqueId, f);
      }
      return this;
    }

    wrapfn(module, uniqueId, f) {
      var self;
      self = this;
      return function(...args) {
        self.tracer[uniqueId] = true;
        return f.apply(module, args);
      };
    }

    printUnused() {
      var id, ref, used;
      ref = this.tracer;
      for (id in ref) {
        used = ref[id];
        if (!used) {
          puts(id);
        }
      }
      return this;
    }

  };

}).call(this);

//# sourceMappingURL=methodTracer.js.map
