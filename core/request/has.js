(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../has', '../global'], factory);
    }
})(function (require, exports) {
    "use strict";
    const has_1 = require('../has');
    const global_1 = require('../global');
    has_1.add('node-buffer', 'Buffer' in global_1.default && typeof global_1.default.Buffer === 'function');
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = has_1.default;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcXVlc3QvaGFzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQUFBLHNCQUF5QixRQUFRLENBQUMsQ0FBQTtJQUNsQyx5QkFBbUIsV0FBVyxDQUFDLENBQUE7SUFFL0IsU0FBRyxDQUFDLGFBQWEsRUFBRSxRQUFRLElBQUksZ0JBQU0sSUFBSSxPQUFPLGdCQUFNLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDO0lBRTlFO3NCQUFlLGFBQUcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBoYXMsIHsgYWRkIH0gZnJvbSAnLi4vaGFzJztcbmltcG9ydCBnbG9iYWwgZnJvbSAnLi4vZ2xvYmFsJztcblxuYWRkKCdub2RlLWJ1ZmZlcicsICdCdWZmZXInIGluIGdsb2JhbCAmJiB0eXBlb2YgZ2xvYmFsLkJ1ZmZlciA9PT0gJ2Z1bmN0aW9uJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGhhcztcbiJdfQ==