/* eslint-disable */
(function () {
  var PREFIX = 'helJsonp_comps-vue2-meme_';
  var key = Object.keys(window).filter(function (name) { return name.indexOf(PREFIX) === 0; }).pop();
  if (!key) {
    console.warn('[comps-vue2-meme] runtime queue not found');
    return;
  }

  function collect() {
    var registry = {};
    (window[key] || []).forEach(function (item) {
      Object.assign(registry, item[1] || {});
    });
    return registry;
  }

  function expose() {
    var registry = collect();
    var cache = {};
    function req(id) {
      if (cache[id]) return cache[id].exports;
      var factory = registry[id];
      if (!factory) throw new Error('missing module ' + id);
      var module = { exports: {} };
      cache[id] = module;
      factory(module, module.exports, req);
      return module.exports;
    }
    req.d = function (exports, name, getter) {
      if (arguments.length === 2) {
        var definition = name;
        for (var key in definition) {
          if (!Object.prototype.hasOwnProperty.call(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
          }
        }
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(exports, name)) {
        Object.defineProperty(exports, name, { enumerable: true, get: getter });
      }
    };
    req.r = function (exports) {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      }
      Object.defineProperty(exports, '__esModule', { value: true });
    };
    req.n = function (module) {
      var getter = module && module.__esModule ? function () { return module.default; } : function () { return module; };
      req.d(getter, { a: getter });
      return getter;
    };
    req.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };

    var tierModule = req('2af9');
    var lib = tierModule && (tierModule.a || tierModule);
    if (!lib || !lib.TierRanking) throw new Error('TierRanking export not found');

    // entry.js 的 exposeLib 只拿到空占位，这里补一次真正的 libReady，
    // 让 hel 的 preFetchLib/getLib 能在宿主按版本取到组件。
    if (window.HelLibProxy && typeof window.HelLibProxy.libReady === 'function') {
      // comps-vue2 和 comps-vue2-meme 共用 hel 全局缓存；显式 appName 后，
      // 宿主 preFetchLib 也必须传 appGroupName，才能避免串到 comps-vue2。
      window.HelLibProxy.libReady('comps-vue2-meme', lib, {
        appName: 'comps-vue2-meme',
        versionId: '2026.11.23-1',
        allowDup: true
      });
    }

    var target = window['comps-vue2-meme'] || (window['comps-vue2-meme'] = {});
    target.TierRanking = lib.TierRanking;
    target.default = lib;
    target.dtlib = lib;
    console.log('[comps-vue2-meme] TierRanking exposed');
  }

  var tries = 0;
  (function waitForChunk() {
    if (collect()['2af9']) {
      try {
        expose();
        return;
      } catch (error) {
        // chunk-2c52 先到、chunk-439 的依赖后到时，req 会报 missing module；
        // 继续轮询，等所有依赖模块都进了同一个 helJsonp 队列再试。
        if (!/missing module/.test(String(error && error.message))) {
          console.warn('[comps-vue2-meme] expose TierRanking failed', error);
          return;
        }
      }
    }
    if (++tries < 120) {
      setTimeout(waitForChunk, 50);
      return;
    }
    console.warn('[comps-vue2-meme] chunk with TierRanking not found');
  })();
})();
