(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    const globalObject = Function('return this')();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = globalObject;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2dsb2JhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFBQSxNQUFNLFlBQVksR0FBUSxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztJQUNwRDtzQkFBZSxZQUFZLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnbG9iYWxPYmplY3Q6IGFueSA9IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5leHBvcnQgZGVmYXVsdCBnbG9iYWxPYmplY3Q7XG4iXX0=